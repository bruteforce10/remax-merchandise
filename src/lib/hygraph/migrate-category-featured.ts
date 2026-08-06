/* eslint-disable no-console */
/**
 * Hygraph schema amendment — adds a boolean `featured` field to the Category
 * model so the admin "Unggulan" toggle can be persisted. Run once against a
 * project that already has the base schema:
 *   pnpm hygraph:migrate:category-featured
 *
 * Re-running after the field exists will fail — amend via update/delete calls.
 */
import process from "node:process";

import { Client, SimpleFieldType } from "@hygraph/management-sdk";

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
    name: `remax-catalog-category-featured-${Date.now()}`,
  });

  client.createSimpleField({
    modelApiId: "Category",
    apiId: "featured",
    displayName: "Featured",
    description: "Show this category as a highlighted/unggulan category.",
    type: SimpleFieldType.Boolean,
    isRequired: false,
  });

  console.log("Submitting migration 'remax-catalog-category-featured-v1'…");
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
