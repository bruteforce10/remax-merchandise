/* eslint-disable no-console */
/**
 * Seed 3 starter homepage banners into Hygraph and publish them. Guarded by an
 * existence check so re-running does not create duplicates (banners have no
 * natural unique key). Images are attached later in the Hygraph asset UI.
 *
 *   pnpm hygraph:seed:banners
 */
import process from "node:process";

import { gql, GraphQLClient } from "graphql-request";

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

const SEED_BANNERS = [
  { alt: "Banner premium merchandise REMAX", link: "/search", order: 1 },
  {
    alt: "Banner seragam & event kit custom",
    link: "/categories/jacket",
    order: 2,
  },
  { alt: "Banner promo corporate gift", link: "/contact", order: 3 },
];

const COUNT = gql`
  query BannerCount {
    bannersConnection(stage: DRAFT) {
      aggregate {
        count
      }
    }
  }
`;

const CREATE = gql`
  mutation CreateBanner($data: BannerCreateInput!) {
    createBanner(data: $data) {
      id
    }
  }
`;

const PUBLISH = gql`
  mutation PublishBanner($id: ID!) {
    publishBanner(where: { id: $id }, to: PUBLISHED) {
      id
    }
  }
`;

interface CountResult {
  bannersConnection: { aggregate: { count: number } };
}
interface CreateResult {
  createBanner: { id: string };
}

async function seed(ep: string, tok: string): Promise<void> {
  const client = new GraphQLClient(ep, {
    headers: { authorization: `Bearer ${tok}` },
  });

  const { bannersConnection } = await client.request<CountResult>(COUNT);
  if (bannersConnection.aggregate.count > 0) {
    console.log(
      `Skipped — ${bannersConnection.aggregate.count} banner(s) already exist.`,
    );
    return;
  }

  for (const b of SEED_BANNERS) {
    const created = await client.request<CreateResult>(CREATE, {
      data: { ...b, publishStatus: "Published" },
    });
    await client.request(PUBLISH, { id: created.createBanner.id });
    console.log(`  ✓ #${b.order} — ${b.alt}`);
  }
  console.log(`Seeded and published ${SEED_BANNERS.length} banners.`);
}

seed(endpoint, token).catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
