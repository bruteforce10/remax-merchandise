import { BADGE_RANK, CATEGORIES, CATEGORY_MAP } from "@/lib/data/catalog";
import type { Product, SortOption } from "@/types/product";

/**
 * Pure, client-safe catalog helpers (filtering/sorting/search). Operate on
 * in-memory arrays so the search page can filter instantly without a round
 * trip. Data fetching lives in `services/content`.
 */

export function categoryName(slug: string): string {
  return CATEGORY_MAP[slug]?.name ?? slug;
}

export function categoryColors(slug: string): string[] {
  return CATEGORY_MAP[slug]?.colors ?? [];
}

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Terpopuler" },
  { value: "new", label: "Terbaru" },
  { value: "price-asc", label: "Harga Terendah" },
  { value: "price-desc", label: "Harga Tertinggi" },
];

export function sortProducts(list: Product[], sort: SortOption): Product[] {
  const out = [...list];
  switch (sort) {
    case "price-asc":
      out.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      out.sort((a, b) => b.price - a.price);
      break;
    case "new":
      out.sort(
        (a, b) => (b.badge === "new" ? 1 : 0) - (a.badge === "new" ? 1 : 0),
      );
      break;
    case "popular":
    default:
      out.sort(
        (a, b) =>
          (b.badge ? BADGE_RANK[b.badge] : 0) -
          (a.badge ? BADGE_RANK[a.badge] : 0),
      );
      break;
  }
  return out;
}

export interface ProductFilters {
  query: string;
  categories: string[];
  priceMax: number;
  colors: string[];
}

export function filterProducts(
  list: Product[],
  filters: ProductFilters,
): Product[] {
  return list.filter((p) => {
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const catName = categoryName(p.categorySlug).toLowerCase();
      if (!(p.name.toLowerCase().includes(q) || catName.includes(q))) {
        return false;
      }
    }
    if (filters.categories.length && !filters.categories.includes(p.categorySlug)) {
      return false;
    }
    if (p.price > filters.priceMax) return false;
    if (filters.colors.length) {
      const pc = categoryColors(p.categorySlug);
      if (!filters.colors.some((c) => pc.includes(c))) return false;
    }
    return true;
  });
}

/** Home tab membership — the "bag" tab groups tote + backpack. */
export function productInTab(product: Product, tab: string): boolean {
  if (tab === "all") return true;
  if (tab === "bag") {
    return product.categorySlug === "tote" || product.categorySlug === "backpack";
  }
  return product.categorySlug === tab;
}

export interface Suggestion {
  kind: "category" | "product";
  label: string;
  meta: string;
  href: string;
  icon: string;
}

export function searchSuggestions(
  products: Product[],
  query: string,
  limit = 6,
): Suggestion[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const categoryHits: Suggestion[] = CATEGORIES.filter((c) =>
    c.name.toLowerCase().includes(q),
  )
    .slice(0, 2)
    .map((c) => ({
      kind: "category",
      label: c.name,
      meta: "Kategori",
      href: `/categories/${c.slug}`,
      icon: c.icon,
    }));
  const productHits: Suggestion[] = products.filter((p) =>
    p.name.toLowerCase().includes(q),
  )
    .slice(0, 5)
    .map((p) => ({
      kind: "product",
      label: p.name,
      meta: categoryName(p.categorySlug),
      href: `/products/${p.slug}`,
      icon: "package",
    }));
  return [...categoryHits, ...productHits].slice(0, limit);
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageCount: number;
}

export function paginate<T>(list: T[], page: number, size: number): Paginated<T> {
  const pageCount = Math.max(1, Math.ceil(list.length / size));
  const current = Math.min(Math.max(1, page), pageCount);
  return {
    items: list.slice((current - 1) * size, current * size),
    page: current,
    pageCount,
  };
}
