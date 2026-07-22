import type { Metadata } from "next";
import type { ReactNode } from "react";

import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { getMedia } from "@/services/operational/media";

export const metadata: Metadata = { title: "Media Library" };

export default async function AdminMediaPage(): Promise<ReactNode> {
  const items = await getMedia();
  return <MediaLibrary initial={items} />;
}
