import { BANNERS } from "@/lib/data/catalog";
import type { Banner } from "@/types/banner";

/** Homepage banner fetcher. Static in Phase 1; Hygraph in Phase 2. */
export async function getBanners(): Promise<Banner[]> {
  return BANNERS.filter((b) => b.status === "published").sort(
    (a, b) => a.order - b.order,
  );
}
