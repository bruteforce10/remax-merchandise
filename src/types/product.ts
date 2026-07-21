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
  /** Minimum order quantity (pcs). */
  moq: number;
  badge: ProductBadge | null;
}

export type SortOption = "popular" | "new" | "price-asc" | "price-desc";
