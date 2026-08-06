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
  /** Comma-separated SEO keywords, also used to boost search matching. */
  keywords: string;
  /**
   * True when the product defines selectable options (color / size / custom).
   * The storefront card uses this to open a variant picker before adding to the
   * cart instead of adding a bare, unspecified line. Derived in the mapper from
   * the product's own option dimensions.
   */
  hasOptions: boolean;
}

/** A user-defined option dimension, e.g. "Bahan" → ["Cotton", "Poly"]. */
export interface ProductCustomVariant {
  id: string;
  name: string;
  values: string[];
}

/** A sellable stock-keeping combination of a product's options. */
export interface ProductVariant {
  id: string;
  sku: string;
  /** Human label, e.g. "Hitam / M / Cotton". */
  title: string;
  /** Per-variant price in IDR; null falls back to the product base price. */
  price: number | null;
  /** Per-variant stock in pcs; null = not tracked. */
  stock: number | null;
  /** One value per option dimension, keyed by dimension name. */
  options: Record<string, string>;
}

/** Full product shape for the detail page — adds option definitions + variants. */
export interface ProductDetail extends Product {
  description: string;
  /** All gallery image URLs (Hygraph asset order); first is the primary. */
  images: string[];
  colors: string[];
  sizes: string[];
  customVariants: ProductCustomVariant[];
  variants: ProductVariant[];
}

export type SortOption = "popular" | "new" | "price-asc" | "price-desc";
