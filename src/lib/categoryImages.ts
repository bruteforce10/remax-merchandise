/**
 * Category image path conventions.
 *
 * Drop a file named after the category slug into the matching public/ folder and
 * it is picked up automatically — no registration/map needed:
 *   - product image (icon) → public/category-products/<slug>.webp
 *   - hero cover           → public/category-covers/<slug>.webp
 *
 * Missing files degrade gracefully on the client: <CategoryVisual> falls back to
 * the Lucide icon, <CategoryCover> falls back to the hero gradient (via onError).
 */
export function categoryImageSrc(slug: string): string {
  return `/category-products/${slug}.webp`;
}

export function categoryCoverSrc(slug: string): string {
  return `/category-covers/${slug}.webp`;
}
