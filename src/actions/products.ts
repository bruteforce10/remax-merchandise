"use server";

import { gql } from "graphql-request";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

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
import type { ActionResult } from "@/types/action";

const productSchema = z.object({
  name: z.string().trim().min(1, "Nama produk wajib diisi"),
  slug: z.string().trim().min(1),
  sku: z.string().trim().min(1, "SKU wajib diisi"),
  categorySlug: z.string().trim().min(1, "Kategori wajib dipilih"),
  shortDescription: z.string().default(""),
  description: z.string().default(""),
  price: z.number().int().min(0).default(0),
  stock: z.number().int().min(0).nullable().default(null),
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

  try {
    const client = hygraphWrite();
    await client.request(CREATE_PRODUCT, {
      data: toHygraphData(parsed.data, "connect"),
    });
    // Always publish so the published stage carries the latest field values;
    // the publishStatus field (filtered in public queries) gates visibility.
    await client.request(PUBLISH_PRODUCT, { sku: parsed.data.sku });
    await syncVariants(parsed.data.sku, parsed.data.variants, false);
    revalidateProducts();
    return { success: true, data: null, message: "Produk disimpan" };
  } catch (error) {
    console.error("createProduct failed:", error);
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
    await hygraphWrite().request(DELETE_PRODUCT, { sku });
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
