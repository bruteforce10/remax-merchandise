"use server";

import { gql, type GraphQLClient } from "graphql-request";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

import { deleteAsset } from "@/actions/assets";
import { hygraphWrite } from "@/lib/hygraph/client";
import { hygraphErrorMessage } from "@/lib/hygraph/errors";
import {
  CREATE_PRODUCT,
  DELETE_PRODUCT,
  DELETE_PRODUCT_VARIANT,
  PUBLISH_PRODUCT,
  PUBLISH_PRODUCT_VARIANT,
  UPDATE_PRODUCT,
  UPSERT_PRODUCT_VARIANT,
} from "@/lib/hygraph/mutations";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getProductDetailBySlug } from "@/services/content/products";
import type { ActionResult } from "@/types/action";
import type { ProductDetail } from "@/types/product";

const slugSchema = z.string().trim().min(1);

/**
 * Read the full option/variant matrix for one product. Used by the storefront
 * quick-add sheet to load choices on demand (the lean catalog list omits them),
 * so a card can force variant selection before adding to the cart.
 */
export async function getProductOptions(
  slug: string,
): Promise<ActionResult<ProductDetail>> {
  const parsed = slugSchema.safeParse(slug);
  if (!parsed.success) {
    return { success: false, data: null, message: "Produk tidak valid" };
  }
  try {
    const detail = await getProductDetailBySlug(parsed.data);
    if (!detail) {
      return { success: false, data: null, message: "Produk tidak ditemukan" };
    }
    return { success: true, data: detail, message: "" };
  } catch (error) {
    console.error("getProductOptions failed:", error);
    return { success: false, data: null, message: "Gagal memuat pilihan produk" };
  }
}

const productSchema = z.object({
  name: z.string().trim().min(1, "Nama produk wajib diisi"),
  slug: z.string().trim().min(1),
  sku: z.string().trim().min(1, "SKU wajib diisi"),
  categorySlug: z.string().trim().min(1, "Kategori wajib dipilih"),
  shortDescription: z.string().default(""),
  description: z.string().default(""),
  price: z.number().int().min(0).default(0),
  stock: z.number().int().min(0).nullable().default(null),
  /** Shipping weight per unit in grams (0 = unset → global fallback at checkout). */
  weight: z.number().int().min(0).default(0),
  sizes: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  material: z.string().default(""),
  branding: z.string().default(""),
  customVariants: z
    .array(z.object({ name: z.string(), values: z.array(z.string()) }))
    .default([]),
  variants: z
    .array(
      z.object({
        sku: z.string().trim().min(1),
        title: z.string().default(""),
        price: z.number().int().min(0).nullable().default(null),
        stock: z.number().int().min(0).nullable().default(null),
        options: z.record(z.string(), z.string()).default({}),
      }),
    )
    .default([]),
  imageIds: z.array(z.string()).default([]),
  seoTitle: z.string().default(""),
  seoDescription: z.string().default(""),
  keywords: z.string().default(""),
  status: z.enum(["published", "draft"]).default("draft"),
});

export type ProductInput = z.input<typeof productSchema>;

type ProductData = z.output<typeof productSchema>;

function revalidateProducts(): void {
  revalidateTag("products");
  revalidateTag("inventory");
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/admin/products");
}

function toHygraphData(
  data: ProductData,
  imageOp: "connect" | "set",
): Record<string, unknown> {
  const imageRefs = data.imageIds.map((id) => ({ id }));
  return {
    name: data.name,
    slug: data.slug,
    sku: data.sku,
    shortDescription: data.shortDescription,
    description: data.description,
    price: data.price,
    stock: data.stock,
    weight: data.weight,
    sizes: data.sizes,
    colors: data.colors,
    material: data.material,
    branding: data.branding,
    customVariants: data.customVariants,
    // ProductCreateInput only accepts `connect`; `set` (replace) is update-only.
    images: { [imageOp]: imageRefs },
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    keywords: data.keywords,
    publishStatus: data.status === "published" ? "Published" : "Draft",
    category: { connect: { slug: data.categorySlug } },
  };
}

const VARIANT_SKUS_QUERY = gql`
  query VariantSkus($sku: String!) {
    productVariants(
      where: { product: { sku: $sku } }
      stage: DRAFT
      first: 500
    ) {
      sku
    }
  }
`;

const PRODUCT_IMAGES_QUERY = gql`
  query ProductImages($sku: String!) {
    products(where: { sku: $sku }, stage: DRAFT, first: 1) {
      images {
        id
      }
    }
  }
`;

/**
 * Sync a product's variants in Hygraph: upsert + publish each submitted variant,
 * then (on update) delete variants no longer present. Runs sequentially to stay
 * within Hygraph's write rate limits.
 */
async function syncVariants(
  productSku: string,
  variants: ProductData["variants"],
  prune: boolean,
): Promise<void> {
  const client = hygraphWrite();
  for (const v of variants) {
    await client.request(UPSERT_PRODUCT_VARIANT, {
      sku: v.sku,
      upsert: {
        create: {
          sku: v.sku,
          title: v.title,
          price: v.price,
          stock: v.stock,
          options: v.options,
          product: { connect: { sku: productSku } },
        },
        update: {
          title: v.title,
          price: v.price,
          stock: v.stock,
          options: v.options,
        },
      },
    });
    await client.request(PUBLISH_PRODUCT_VARIANT, { sku: v.sku });
  }
  if (prune) {
    const { productVariants } = await client.request<{
      productVariants: { sku: string }[];
    }>(VARIANT_SKUS_QUERY, { sku: productSku });
    const keep = new Set(variants.map((v) => v.sku));
    for (const existing of productVariants) {
      if (!keep.has(existing.sku)) {
        await client.request(DELETE_PRODUCT_VARIANT, { sku: existing.sku });
      }
    }
  }
}

/**
 * Sync Supabase `inventory` (the live source of truth for stock) from the saved
 * product: one row per variant, or a single row keyed by the product SKU for a
 * simple product. Empty stock becomes 0. Prunes rows for SKUs no longer present.
 */
async function syncInventory(data: ProductData): Promise<void> {
  const rows =
    data.variants.length > 0
      ? data.variants.map((v) => ({
          sku: v.sku,
          product_sku: data.sku,
          name: v.title ? `${data.name} — ${v.title}` : data.name,
          stock: v.stock ?? 0,
          weight_grams: data.weight,
        }))
      : [
          {
            sku: data.sku,
            product_sku: data.sku,
            name: data.name,
            stock: data.stock ?? 0,
            weight_grams: data.weight,
          },
        ];

  const db = supabaseAdmin();
  const { error: upsertError } = await db
    .from("inventory")
    .upsert(rows, { onConflict: "sku" });
  if (upsertError) throw upsertError;

  const keep = rows.map((r) => r.sku);
  const { data: existing, error: selectError } = await db
    .from("inventory")
    .select("sku")
    .eq("product_sku", data.sku);
  if (selectError) throw selectError;
  const stale = (existing ?? [])
    .map((r) => r.sku as string)
    .filter((sku) => !keep.includes(sku));
  if (stale.length > 0) {
    const { error: deleteError } = await db
      .from("inventory")
      .delete()
      .in("sku", stale);
    if (deleteError) throw deleteError;
  }
}

/**
 * Best-effort cleanup of a partially-created product. A create that fails *after*
 * the Hygraph product row exists would otherwise strand the SKU — Hygraph enforces
 * a unique `sku`, so every retry would then die with "value is not unique for the
 * field sku". Removing the partial product (and any variants we attempted) frees
 * the SKU so the admin can simply save again.
 */
async function rollbackCreatedProduct(
  client: GraphQLClient,
  sku: string,
  variantSkus: string[],
): Promise<void> {
  try {
    for (const variantSku of variantSkus) {
      try {
        await client.request(DELETE_PRODUCT_VARIANT, { sku: variantSku });
      } catch {
        // Variant may never have been created — ignore.
      }
    }
    await client.request(DELETE_PRODUCT, { sku });
  } catch (cleanupError) {
    console.error("createProduct rollback failed:", cleanupError);
  }
}

export async function createProduct(
  input: ProductInput,
): Promise<ActionResult> {
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      data: null,
      message: parsed.error.issues[0]?.message ?? "Data produk tidak valid",
    };
  }

  const client = hygraphWrite();
  let productCreated = false;
  try {
    await client.request(CREATE_PRODUCT, {
      data: toHygraphData(parsed.data, "connect"),
    });
    productCreated = true;
    // Always publish so the published stage carries the latest field values;
    // the publishStatus field (filtered in public queries) gates visibility.
    await client.request(PUBLISH_PRODUCT, { sku: parsed.data.sku });
    await syncVariants(parsed.data.sku, parsed.data.variants, false);
    await syncInventory(parsed.data);
    revalidateProducts();
    return { success: true, data: null, message: "Produk disimpan" };
  } catch (error) {
    console.error("createProduct failed:", error);
    if (productCreated) {
      await rollbackCreatedProduct(
        client,
        parsed.data.sku,
        parsed.data.variants.map((v) => v.sku),
      );
    }
    return {
      success: false,
      data: null,
      message: hygraphErrorMessage(error, "Gagal menyimpan produk"),
    };
  }
}

export async function updateProduct(
  sku: string,
  input: ProductInput,
): Promise<ActionResult> {
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      data: null,
      message: parsed.error.issues[0]?.message ?? "Data produk tidak valid",
    };
  }

  try {
    const client = hygraphWrite();
    await client.request(UPDATE_PRODUCT, {
      sku,
      data: toHygraphData(parsed.data, "set"),
    });
    await client.request(PUBLISH_PRODUCT, { sku: parsed.data.sku });
    await syncVariants(parsed.data.sku, parsed.data.variants, true);
    await syncInventory(parsed.data);
    revalidateProducts();
    return { success: true, data: null, message: "Produk diperbarui" };
  } catch (error) {
    console.error("updateProduct failed:", error);
    return {
      success: false,
      data: null,
      message: hygraphErrorMessage(error, "Gagal memperbarui produk"),
    };
  }
}

const quickUpdateSchema = z.object({
  name: z.string().trim().min(1, "Nama produk wajib diisi"),
  price: z.number().int().min(0),
  stock: z.number().int().min(0).nullable(),
  categorySlug: z.string().trim().min(1, "Kategori wajib dipilih"),
  status: z.enum(["published", "draft"]),
});

export type QuickProductInput = z.input<typeof quickUpdateSchema>;

/** Partial update (name/price/stock/category/status) — used by the quick-edit
 * drawer and bulk-status actions. Leaves all other product fields untouched. */
export async function quickUpdateProduct(
  sku: string,
  patch: QuickProductInput,
): Promise<ActionResult> {
  const parsed = quickUpdateSchema.safeParse(patch);
  if (!parsed.success) {
    return {
      success: false,
      data: null,
      message: parsed.error.issues[0]?.message ?? "Data produk tidak valid",
    };
  }

  const { name, price, stock, categorySlug, status } = parsed.data;
  try {
    const client = hygraphWrite();
    await client.request(UPDATE_PRODUCT, {
      sku,
      data: {
        name,
        price,
        stock,
        publishStatus: status === "published" ? "Published" : "Draft",
        category: { connect: { slug: categorySlug } },
      },
    });
    await client.request(PUBLISH_PRODUCT, { sku });
    // Simple-product live stock lives in Supabase; a variable product has no
    // row keyed by its own SKU, so this is a safe no-op there.
    if (stock !== null) {
      await supabaseAdmin()
        .from("inventory")
        .update({ stock, name })
        .eq("sku", sku)
        .eq("product_sku", sku);
    }
    revalidateProducts();
    return { success: true, data: null, message: "Perubahan disimpan" };
  } catch (error) {
    console.error("quickUpdateProduct failed:", error);
    return {
      success: false,
      data: null,
      message: hygraphErrorMessage(error, "Gagal menyimpan perubahan"),
    };
  }
}

export async function deleteProduct(sku: string): Promise<ActionResult> {
  try {
    const client = hygraphWrite();
    // Hygraph doesn't cascade relations, so collect the product's image asset
    // ids up front (they must be deleted explicitly or they linger orphaned in
    // the asset library).
    const { products } = await client.request<{
      products: { images: { id: string }[] }[];
    }>(PRODUCT_IMAGES_QUERY, { sku });
    const imageIds = products[0]?.images.map((img) => img.id) ?? [];

    // Delete the product's variants first (also not cascaded), then the product.
    const { productVariants } = await client.request<{
      productVariants: { sku: string }[];
    }>(VARIANT_SKUS_QUERY, { sku });
    for (const v of productVariants) {
      try {
        await client.request(DELETE_PRODUCT_VARIANT, { sku: v.sku });
      } catch (variantError) {
        console.error(
          `deleteProduct: failed to delete variant ${v.sku}:`,
          variantError,
        );
      }
    }
    await client.request(DELETE_PRODUCT, { sku });

    // Delete the now-unreferenced image assets from Hygraph.
    for (const id of imageIds) {
      const res = await deleteAsset(id);
      if (!res.success) {
        console.error(
          `deleteProduct: failed to delete asset ${id}: ${res.message}`,
        );
      }
    }

    // Remove the live stock rows in Supabase (every row is keyed by product_sku,
    // covering both a simple product and all of its variants).
    const { error } = await supabaseAdmin()
      .from("inventory")
      .delete()
      .eq("product_sku", sku);
    if (error) {
      console.error("deleteProduct: inventory cleanup failed:", error);
    }
    revalidateProducts();
    return { success: true, data: null, message: "Produk dihapus" };
  } catch (error) {
    console.error("deleteProduct failed:", error);
    return {
      success: false,
      data: null,
      message: hygraphErrorMessage(error, "Gagal menghapus produk"),
    };
  }
}
