/**
 * Cross-system SKU audit — surfaces leftovers from failed product saves by
 * reconciling Hygraph (products + variants) against Supabase (`inventory`).
 * Read-only by default.
 *
 *   pnpm audit:skus                 # report only
 *   pnpm audit:skus --fix           # + delete orphan inventory rows (Supabase, safe)
 *   pnpm audit:skus --fix-variants  # + delete orphan variants (parent product gone)
 *                                     from Hygraph AND their inventory rows
 *
 * Whole-product deletion stays manual — review flagged products and delete
 * unwanted ones from /admin/products.
 */
import process from "node:process";

import { createClient } from "@supabase/supabase-js";
import { gql, GraphQLClient } from "graphql-request";

// Load .env.local so the script can run standalone (Node >= 20.12).
(process as unknown as { loadEnvFile?: (path: string) => void }).loadEnvFile?.(
  ".env.local",
);

const hygraphEndpoint = process.env.HYGRAPH_MANAGEMENT_ENDPOINT;
const hygraphToken = process.env.HYGRAPH_MANAGEMENT_TOKEN;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!hygraphEndpoint || !hygraphToken) {
  console.error(
    "Missing HYGRAPH_MANAGEMENT_ENDPOINT or HYGRAPH_MANAGEMENT_TOKEN in .env.local.",
  );
  process.exit(1);
}
if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local.",
  );
  process.exit(1);
}

interface AuditProduct {
  sku: string;
  slug: string;
  name: string;
  publishStatus: string;
  variants: { sku: string }[];
}
interface AuditVariant {
  sku: string;
  product: { sku: string } | null;
}
interface InventoryRow {
  sku: string;
  productSku: string;
}

const PRODUCTS_QUERY = gql`
  query AuditProducts($first: Int!, $skip: Int!) {
    products(first: $first, skip: $skip, stage: DRAFT, orderBy: createdAt_ASC) {
      sku
      slug
      name
      publishStatus
      variants(first: 200) {
        sku
      }
    }
  }
`;

const VARIANTS_QUERY = gql`
  query AuditVariants($first: Int!, $skip: Int!) {
    productVariants(first: $first, skip: $skip, stage: DRAFT) {
      sku
      product {
        sku
      }
    }
  }
`;

const DELETE_VARIANT = gql`
  mutation DeleteProductVariant($sku: String!) {
    deleteProductVariant(where: { sku: $sku }) {
      id
    }
  }
`;

const PAGE = 100;

async function fetchAllProducts(
  client: GraphQLClient,
): Promise<AuditProduct[]> {
  const out: AuditProduct[] = [];
  for (let skip = 0; ; skip += PAGE) {
    const { products } = await client.request<{ products: AuditProduct[] }>(
      PRODUCTS_QUERY,
      { first: PAGE, skip },
    );
    out.push(...products);
    if (products.length < PAGE) break;
  }
  return out;
}

async function fetchAllVariants(
  client: GraphQLClient,
): Promise<AuditVariant[]> {
  const out: AuditVariant[] = [];
  for (let skip = 0; ; skip += PAGE) {
    const { productVariants } = await client.request<{
      productVariants: AuditVariant[];
    }>(VARIANTS_QUERY, { first: PAGE, skip });
    out.push(...productVariants);
    if (productVariants.length < PAGE) break;
  }
  return out;
}

function duplicates(values: string[]): string[] {
  const seen = new Set<string>();
  const dup = new Set<string>();
  for (const v of values) {
    if (seen.has(v)) dup.add(v);
    else seen.add(v);
  }
  return [...dup];
}

function section(title: string, lines: string[]): void {
  const mark = lines.length === 0 ? "✅" : "⚠️ ";
  console.log(`\n${mark} ${title} — ${lines.length}`);
  for (const line of lines) console.log(`     ${line}`);
}

async function main(): Promise<void> {
  const fix = process.argv.includes("--fix");
  const fixVariants = process.argv.includes("--fix-variants");
  const client = new GraphQLClient(hygraphEndpoint as string, {
    headers: { authorization: `Bearer ${hygraphToken as string}` },
  });
  const db = createClient(supabaseUrl as string, supabaseKey as string, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const products = await fetchAllProducts(client);

  let variants: AuditVariant[] = [];
  try {
    variants = await fetchAllVariants(client);
  } catch {
    console.warn(
      "⚠️  Could not query ProductVariant (model not migrated?) — skipping variant checks.",
    );
  }

  const { data: invData, error: invError } = await db
    .from("inventory")
    .select("sku, product_sku");
  if (invError) {
    console.error("Supabase inventory read failed:", invError.message);
    process.exit(1);
  }
  const inventory: InventoryRow[] = (invData ?? []).map((r) => ({
    sku: String(r.sku),
    productSku: String(r.product_sku),
  }));

  const productSkus = new Set(products.map((p) => p.sku));
  const variantSkus = new Set(variants.map((v) => v.sku));
  const inventorySkus = new Set(inventory.map((r) => r.sku));

  // [1] Unpublished products — genuine drafts OR a create whose publish failed.
  const draftProducts = products
    .filter((p) => p.publishStatus !== "Published")
    .map((p) => `${p.sku}  ·  ${p.name}  (/${p.slug})`);

  // [2] Products with no inventory rows for their expected SKUs → likely a
  //     create that failed before syncInventory ran.
  const missingInventory: string[] = [];
  for (const p of products) {
    const expected =
      p.variants.length > 0 ? p.variants.map((v) => v.sku) : [p.sku];
    const missing = expected.filter((s) => !inventorySkus.has(s));
    if (missing.length > 0) {
      missingInventory.push(
        `${p.sku}  ·  ${p.name}  — missing ${missing.length}/${expected.length}: ${missing.join(", ")}`,
      );
    }
  }

  // [3] Inventory rows whose SKU matches no Hygraph product/variant → orphaned
  //     by a deleted or renamed product. Safe to delete.
  const orphanInventory = inventory.filter(
    (r) => !productSkus.has(r.sku) && !variantSkus.has(r.sku),
  );

  // [4] Variants whose parent product is gone.
  const orphanVariantList = variants.filter(
    (v) => !v.product || !productSkus.has(v.product.sku),
  );
  const orphanVariants = orphanVariantList.map(
    (v) => `${v.sku}  (product: ${v.product?.sku ?? "—none—"})`,
  );

  // [5] A SKU used as BOTH a product SKU and a variant SKU → ambiguous inventory
  //     key; a variant sale would decrement the wrong row.
  const collisions = [...productSkus].filter((s) => variantSkus.has(s));

  // [6] Duplicate product SKUs/slugs (Hygraph enforces uniqueness — defensive).
  const dupSkus = duplicates(products.map((p) => p.sku));
  const dupSlugs = duplicates(products.map((p) => p.slug));

  const publishedCount = products.filter(
    (p) => p.publishStatus === "Published",
  ).length;

  console.log("=== SKU Audit ===");
  console.log(
    `Hygraph products: ${products.length} (published ${publishedCount}, draft ${products.length - publishedCount})`,
  );
  console.log(`Hygraph variants: ${variants.length}`);
  console.log(`Supabase inventory rows: ${inventory.length}`);

  section("[1] Produk DRAFT / belum publish", draftProducts);
  section(
    "[2] Produk tanpa inventory (indikasi create gagal separuh)",
    missingInventory,
  );
  section(
    `[3] Baris inventory orphan (SKU tak dikenal)${fix ? "" : "  ·  jalankan --fix untuk hapus"}`,
    orphanInventory.map((r) => `${r.sku}  (product_sku: ${r.productSku})`),
  );
  section(
    `[4] Varian orphan (produk induk hilang)${fixVariants ? "" : "  ·  jalankan --fix-variants untuk hapus"}`,
    orphanVariants,
  );
  section("[5] Tabrakan SKU produk ↔ varian", collisions);
  section(
    "[6] SKU/slug produk duplikat",
    [...dupSkus.map((s) => `SKU: ${s}`), ...dupSlugs.map((s) => `slug: ${s}`)],
  );

  if (fix && orphanInventory.length > 0) {
    const skus = orphanInventory.map((r) => r.sku);
    const { error } = await db.from("inventory").delete().in("sku", skus);
    if (error) {
      console.error(`\n❌ Gagal menghapus inventory orphan: ${error.message}`);
      process.exit(1);
    }
    console.log(`\n🧹 Menghapus ${skus.length} baris inventory orphan.`);
  }

  if (fixVariants && orphanVariantList.length > 0) {
    const skus = orphanVariantList.map((v) => v.sku);
    let deleted = 0;
    for (const sku of skus) {
      try {
        await client.request(DELETE_VARIANT, { sku });
        deleted += 1;
      } catch (err) {
        console.error(`   gagal hapus varian ${sku}:`, err);
      }
    }
    // Their inventory rows are now orphaned too — clear them in the same pass.
    const { error } = await db.from("inventory").delete().in("sku", skus);
    if (error) {
      console.error(`\n❌ Gagal menghapus inventory varian: ${error.message}`);
    }
    console.log(
      `\n🧹 Menghapus ${deleted}/${skus.length} varian orphan (+ baris inventory-nya).`,
    );
  }

  const issues =
    draftProducts.length +
    missingInventory.length +
    orphanInventory.length +
    orphanVariants.length +
    collisions.length +
    dupSkus.length +
    dupSlugs.length;
  console.log(
    issues === 0
      ? "\n✅ Bersih — tidak ada SKU nyangkut/orphan."
      : `\nSelesai. ${issues} temuan. Bersihkan: inventory orphan → --fix · varian orphan → --fix-variants · produk utuh → hapus manual dari /admin/products.`,
  );
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
