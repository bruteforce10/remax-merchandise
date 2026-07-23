/* eslint-disable no-console */
/**
 * Hygraph schema migration — creates the Product, Category, and Banner content
 * models (plus supporting enumerations) for the REMAX Merchandise Catalog.
 *
 * Run once against a project that does not yet have these models:
 *   pnpm hygraph:migrate
 *
 * Uses @hygraph/management-sdk v1.6 (flat Client API). Re-running against a
 * project that already has the models will fail — use the update/delete calls
 * to amend an existing schema instead.
 */
import process from "node:process";

import {
  Client,
  RelationalFieldType,
  SimpleFieldType,
} from "@hygraph/management-sdk";

// Load .env.local so the script can run standalone (Node >= 20.12).
(process as unknown as { loadEnvFile?: (path: string) => void }).loadEnvFile?.(
  ".env.local",
);

const endpoint = process.env.HYGRAPH_MANAGEMENT_ENDPOINT;
const authToken = process.env.HYGRAPH_MANAGEMENT_TOKEN;

if (!endpoint || !authToken) {
  console.error(
    "Missing HYGRAPH_MANAGEMENT_ENDPOINT or HYGRAPH_MANAGEMENT_TOKEN. " +
      "Add them to .env.local before running the migration.",
  );
  process.exit(1);
}

interface StringFieldOpts {
  isRequired?: boolean;
  isUnique?: boolean;
  isList?: boolean;
  isTitle?: boolean;
}

async function run(managementEndpoint: string, token: string): Promise<void> {
  const client = new Client({
    endpoint: managementEndpoint,
    authToken: token,
    name: "remax-catalog-schema-v1",
  });

  const str = (
    modelApiId: string,
    apiId: string,
    displayName: string,
    opts: StringFieldOpts = {},
  ): void => {
    client.createSimpleField({
      modelApiId,
      apiId,
      displayName,
      type: SimpleFieldType.String,
      ...opts,
    });
  };

  const asset = (
    modelApiId: string,
    apiId: string,
    displayName: string,
    reverseApiId: string,
    isList = false,
  ): void => {
    client.createRelationalField({
      modelApiId,
      apiId,
      displayName,
      type: RelationalFieldType.Asset,
      isList,
      isRequired: false,
      reverseField: {
        modelApiId: "Asset",
        apiId: reverseApiId,
        displayName,
        isList: true,
      },
    });
  };

  // ── Enumerations ──────────────────────────────────────────────────────────
  client.createEnumeration({
    apiId: "ProductBadge",
    displayName: "Product Badge",
    values: [
      { apiId: "New", displayName: "New" },
      { apiId: "Popular", displayName: "Popular" },
      { apiId: "Featured", displayName: "Featured" },
    ],
  });
  client.createEnumeration({
    apiId: "PublishStatus",
    displayName: "Publish Status",
    values: [
      { apiId: "Draft", displayName: "Draft" },
      { apiId: "Published", displayName: "Published" },
    ],
  });

  // ── Category ──────────────────────────────────────────────────────────────
  client.createModel({ apiId: "Category", apiIdPlural: "Categories", displayName: "Category" });
  str("Category", "name", "Name", { isRequired: true, isTitle: true });
  str("Category", "slug", "Slug", { isRequired: true, isUnique: true });
  str("Category", "icon", "Icon (Lucide name)");
  str("Category", "material", "Material");
  str("Category", "branding", "Branding");
  str("Category", "colors", "Colors", { isList: true });
  str("Category", "sizes", "Sizes", { isList: true });
  str("Category", "description", "Description");
  str("Category", "seoTitle", "SEO Title");
  str("Category", "seoDescription", "SEO Description");
  asset("Category", "image", "Image", "categoryImage");

  // ── Product ───────────────────────────────────────────────────────────────
  client.createModel({ apiId: "Product", apiIdPlural: "Products", displayName: "Product" });
  str("Product", "name", "Name", { isRequired: true, isTitle: true });
  str("Product", "slug", "Slug", { isRequired: true, isUnique: true });
  str("Product", "sku", "SKU", { isRequired: true, isUnique: true });
  str("Product", "shortDescription", "Short Description");
  str("Product", "description", "Description");
  client.createSimpleField({ modelApiId: "Product", apiId: "price", displayName: "Price (IDR)", type: SimpleFieldType.Int });
  client.createSimpleField({ modelApiId: "Product", apiId: "stock", displayName: "Stock (pcs)", type: SimpleFieldType.Int });
  str("Product", "sizes", "Sizes", { isList: true });
  str("Product", "colors", "Colors", { isList: true });
  str("Product", "material", "Material");
  str("Product", "branding", "Branding");
  client.createSimpleField({ modelApiId: "Product", apiId: "customVariants", displayName: "Custom Variants", type: SimpleFieldType.Json });
  str("Product", "seoTitle", "SEO Title");
  str("Product", "seoDescription", "SEO Description");
  str("Product", "keywords", "Keywords");
  client.createEnumerableField({ modelApiId: "Product", apiId: "badge", displayName: "Badge", enumerationApiId: "ProductBadge" });
  client.createEnumerableField({ modelApiId: "Product", apiId: "status", displayName: "Status", enumerationApiId: "PublishStatus", isRequired: true });
  asset("Product", "images", "Images", "productImages", true);
  client.createRelationalField({
    modelApiId: "Product",
    apiId: "category",
    displayName: "Category",
    type: RelationalFieldType.Relation,
    isList: false,
    reverseField: {
      modelApiId: "Category",
      apiId: "products",
      displayName: "Products",
      isList: true,
    },
  });

  // ── Banner ────────────────────────────────────────────────────────────────
  client.createModel({ apiId: "Banner", apiIdPlural: "Banners", displayName: "Banner" });
  str("Banner", "alt", "Image Alt", { isRequired: true, isTitle: true });
  str("Banner", "link", "Link");
  client.createSimpleField({ modelApiId: "Banner", apiId: "order", displayName: "Order", type: SimpleFieldType.Int });
  client.createEnumerableField({ modelApiId: "Banner", apiId: "status", displayName: "Status", enumerationApiId: "PublishStatus", isRequired: true });
  asset("Banner", "image", "Image", "bannerImage");

  console.log("Submitting migration 'remax-catalog-schema-v1'…");
  const result = await client.run(true);

  if (result.errors) {
    console.error("Migration failed:", result.errors);
    process.exit(1);
  }
  console.log(`Migration finished with status: ${result.status}`);
}

run(endpoint, authToken).catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
