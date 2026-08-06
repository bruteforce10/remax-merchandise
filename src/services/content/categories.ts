import { unstable_cache } from "next/cache";

import { hygraphRead } from "@/lib/hygraph/client";
import { mapCategory, type RawCategory } from "@/lib/hygraph/map";
import { CATEGORIES_QUERY } from "@/lib/hygraph/queries";
import type { Category } from "@/types/category";

/**
 * Category content fetchers — sourced from Hygraph. The full list is fetched
 * once and cached (Data Cache), and every single-item/derived fetcher reads
 * from that list to stay well within the CMS read limit. Returns safe defaults
 * on failure so a transient CMS error degrades gracefully.
 */

// Only successful responses are cached. If the request throws it propagates out
// of unstable_cache (which does NOT cache rejections), so a transient CMS error
// is retried on the next call instead of poisoning the cache with an empty list.
const fetchCategoriesCached: () => Promise<Category[]> = unstable_cache(
  async () => {
    const { categories } = await hygraphRead().request<{
      categories: RawCategory[];
    }>(CATEGORIES_QUERY);
    return categories.map(mapCategory);
  },
  ["categories"],
  { revalidate: 300, tags: ["categories"] },
);

export async function getCategories(): Promise<Category[]> {
  try {
    return await fetchCategoriesCached();
  } catch (error) {
    // Degrade gracefully for the caller, but the failure itself is not cached.
    console.error("getCategories failed:", error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function getCategorySlugs(): Promise<string[]> {
  const categories = await getCategories();
  return categories.map((c) => c.slug);
}

export async function getRelatedCategories(
  slug: string,
  limit = 4,
): Promise<Category[]> {
  const categories = await getCategories();
  return categories.filter((c) => c.slug !== slug).slice(0, limit);
}
