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

async function fetchCategories(): Promise<Category[]> {
  try {
    const { categories } = await hygraphRead().request<{
      categories: RawCategory[];
    }>(CATEGORIES_QUERY);
    return categories.map(mapCategory);
  } catch (error) {
    console.error("getCategories failed:", error);
    return [];
  }
}

export const getCategories: () => Promise<Category[]> = unstable_cache(
  fetchCategories,
  ["categories"],
  { revalidate: 300, tags: ["categories"] },
);

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
