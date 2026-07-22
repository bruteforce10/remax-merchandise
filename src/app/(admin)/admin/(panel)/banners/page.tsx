import type { Metadata } from "next";
import type { ReactNode } from "react";

import { BannersList } from "@/components/admin/BannersList";
import { getAdminBanners } from "@/services/operational/banners";

export const metadata: Metadata = { title: "Banner" };

export default async function AdminBannersPage(): Promise<ReactNode> {
  const banners = await getAdminBanners();
  return <BannersList initial={banners} />;
}
