/** Product content model (maps to Hygraph `Product` in Phase 2). */
export type ProductBadge = "new" | "popular" | "featured";

export interface Product {
  sku: string;
  slug: string;
  name: string;
  /** Short label used on placeholder tiles and cart lines. */
  short: string;
  categorySlug: string;
  /** Starting price in IDR (integer rupiah). */
  price: number;
  /** Remaining stock in pcs. null = not tracked. */
  stock: number | null;
  badge: ProductBadge | null;
  /** Primary image (Hygraph asset URL), or null when none is attached. */
  imageUrl: string | null;
}

export type SortOption = "popular" | "new" | "price-asc" | "price-desc";
