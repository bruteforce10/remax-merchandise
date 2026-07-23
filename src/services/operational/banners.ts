import { hygraphWrite } from "@/lib/hygraph/client";
import { mapAdminBanner, type RawBanner } from "@/lib/hygraph/map";
import { ADMIN_BANNERS_QUERY } from "@/lib/hygraph/queries";
import type { AdminBanner } from "@/types/admin";

/**
 * Admin banner list — reads the DRAFT stage via the authenticated client so
 * unpublished banners are visible. Not cached: the admin needs fresh data.
 */
export async function getAdminBanners(): Promise<AdminBanner[]> {
  try {
    const { banners } = await hygraphWrite().request<{ banners: RawBanner[] }>(
      ADMIN_BANNERS_QUERY,
    );
    return banners.map(mapAdminBanner);
  } catch (error) {
    console.error("getAdminBanners failed:", error);
    return [];
  }
}
