/* eslint-disable no-console */
/**
 * Hygraph schema amendment — adds the ProductVariant model and its relation to
 * Product (per-combination stock/price). Run once against a project that already
 * has the base schema:
 *   pnpm hygraph:migrate:variants
 *
 * Re-running after the model exists will fail — amend via update/delete calls.
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

async function run(managementEndpoint: string, token: string): Promise<void> {
  const client = new Client({
    endpoint: managementEndpoint,
    authToken: token,
    name: `remax-catalog-variants-${Date.now()}`,
  });

  // ── ProductVariant ──────────────────────────────────────────────────────────
  client.createModel({
    apiId: "ProductVariant",
    apiIdPlural: "ProductVariants",
    displayName: "Product Variant",
  });
  client.createSimpleField({
    modelApiId: "ProductVariant",
    apiId: "sku",
    displayName: "SKU",
    type: SimpleFieldType.String,
    isRequired: true,
    isUnique: true,
    isTitle: true,
  });
  client.createSimpleField({
    modelApiId: "ProductVariant",
    apiId: "title",
    displayName: "Title",
    type: SimpleFieldType.String,
  });
  client.createSimpleField({
    modelApiId: "ProductVariant",
    apiId: "price",
    displayName: "Price (IDR)",
    type: SimpleFieldType.Int,
  });
  client.createSimpleField({
    modelApiId: "ProductVariant",
    apiId: "stock",
    displayName: "Stock (pcs)",
    type: SimpleFieldType.Int,
  });
  client.createSimpleField({
    modelApiId: "ProductVariant",
    apiId: "options",
    displayName: "Options",
    type: SimpleFieldType.Json,
  });
  client.createRelationalField({
    modelApiId: "ProductVariant",
    apiId: "product",
    displayName: "Product",
    type: RelationalFieldType.Relation,
    isList: false,
    isRequired: false,
    reverseField: {
      modelApiId: "Product",
      apiId: "variants",
      displayName: "Variants",
      isList: true,
    },
  });

  console.log("Submitting migration 'remax-catalog-variants-v1'…");
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
