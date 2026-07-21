import { CATEGORIES, CATEGORY_MAP } from "@/lib/data/catalog";
import type { Category } from "@/types/category";

/**
 * Category content fetchers. Static in Phase 1; swap the bodies for Hygraph
 * GraphQL queries in Phase 2 without changing call sites.
 */

export async function getCategories(): Promise<Category[]> {
  return CATEGORIES;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return CATEGORY_MAP[slug] ?? null;
}

export async function getCategorySlugs(): Promise<string[]> {
  return CATEGORIES.map((c) => c.slug);
}

export async function getRelatedCategories(
  slug: string,
  limit = 4,
): Promise<Category[]> {
  return CATEGORIES.filter((c) => c.slug !== slug).slice(0, limit);
}
