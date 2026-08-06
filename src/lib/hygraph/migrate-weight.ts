/**
 * Hygraph schema amendment — adds a `weight` (grams per unit) field to the
 * Product model, used to calculate shipping cost (ongkir). Run once against a
 * project that already has the base Product model:
 *   pnpm hygraph:migrate:weight
 *
 * The field is optional; existing products default to no weight and fall back to
 * SHIP_DEFAULT_WEIGHT_GRAMS at checkout until an admin sets a real value.
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
    name: `remax-catalog-weight-${Date.now()}`,
  });

  client.createSimpleField({
    modelApiId: "Product",
    apiId: "weight",
    displayName: "Weight (grams)",
    type: SimpleFieldType.Int,
    isRequired: false,
  });

  console.log("Submitting migration 'remax-catalog-weight-v1'…");
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
