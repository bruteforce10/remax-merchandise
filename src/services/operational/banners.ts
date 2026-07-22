import { ADMIN_BANNERS } from "@/lib/data/admin";
import type { AdminBanner } from "@/types/admin";

export async function getAdminBanners(): Promise<AdminBanner[]> {
  return [...ADMIN_BANNERS].sort((a, b) => a.order - b.order);
}
