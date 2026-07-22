import { MEDIA_ITEMS } from "@/lib/data/admin";
import type { MediaItem } from "@/types/admin";

export async function getMedia(): Promise<MediaItem[]> {
  return MEDIA_ITEMS;
}
