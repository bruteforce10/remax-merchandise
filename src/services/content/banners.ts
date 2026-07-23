import { unstable_cache } from "next/cache";

import { hygraphRead } from "@/lib/hygraph/client";
import { mapPublicBanner, type RawBanner } from "@/lib/hygraph/map";
import { BANNERS_QUERY } from "@/lib/hygraph/queries";
import type { Banner } from "@/types/banner";

/** Homepage banner fetcher — published banners from Hygraph, cached. */
async function fetchBanners(): Promise<Banner[]> {
  try {
    const { banners } = await hygraphRead().request<{ banners: RawBanner[] }>(
      BANNERS_QUERY,
    );
    return banners.map(mapPublicBanner);
  } catch (error) {
    console.error("getBanners failed:", error);
    return [];
  }
}

export const getBanners: () => Promise<Banner[]> = unstable_cache(
  fetchBanners,
  ["banners"],
  { revalidate: 300, tags: ["banners"] },
);
