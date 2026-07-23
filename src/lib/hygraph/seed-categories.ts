/* eslint-disable no-console */
/**
 * Seed the 15 catalog categories from the static constants into Hygraph and
 * publish them. Idempotent — re-running upserts by slug instead of duplicating.
 *
 *   pnpm hygraph:seed:categories
 */
import process from "node:process";

import { gql, GraphQLClient } from "graphql-request";

import { CATEGORIES } from "@/lib/data/catalog";

// Load .env.local so the script can run standalone (Node >= 20.12).
(process as unknown as { loadEnvFile?: (path: string) => void }).loadEnvFile?.(
  ".env.local",
);

const endpoint = process.env.HYGRAPH_MANAGEMENT_ENDPOINT;
const token = process.env.HYGRAPH_MANAGEMENT_TOKEN;

if (!endpoint || !token) {
  console.error(
    "Missing HYGRAPH_MANAGEMENT_ENDPOINT or HYGRAPH_MANAGEMENT_TOKEN in .env.local.",
  );
  process.exit(1);
}

const UPSERT = gql`
  mutation UpsertCategory(
    $slug: String!
    $create: CategoryCreateInput!
    $update: CategoryUpdateInput!
  ) {
    upsertCategory(
      where: { slug: $slug }
      upsert: { create: $create, update: $update }
    ) {
      id
      slug
    }
  }
`;

const PUBLISH = gql`
  mutation PublishCategory($slug: String!) {
    publishCategory(where: { slug: $slug }, to: PUBLISHED) {
      id
    }
  }
`;

interface UpsertResult {
  upsertCategory: { id: string; slug: string } | null;
}
interface PublishResult {
  publishCategory: { id: string } | null;
}

async function seed(ep: string, tok: string): Promise<void> {
  const client = new GraphQLClient(ep, {
    headers: { authorization: `Bearer ${tok}` },
  });

  for (const c of CATEGORIES) {
    const fields = {
      name: c.name,
      slug: c.slug,
      icon: c.icon,
      material: c.material,
      branding: c.branding,
      colors: c.colors,
      sizes: c.sizes,
      description: c.description,
      seoTitle: `${c.name} | RE/MAX Merchandise`,
      seoDescription: c.description.slice(0, 155),
    };

    await client.request<UpsertResult>(UPSERT, {
      slug: c.slug,
      create: fields,
      update: fields,
    });
    await client.request<PublishResult>(PUBLISH, { slug: c.slug });
    console.log(`  ✓ ${c.slug} — ${c.name}`);
  }

  console.log(`Seeded and published ${CATEGORIES.length} categories.`);
}

seed(endpoint, token).catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
