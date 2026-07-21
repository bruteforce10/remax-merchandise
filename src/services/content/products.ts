import { sortProducts } from "@/lib/catalog";
import { PRODUCTS, PRODUCT_SLUG_MAP } from "@/lib/data/catalog";
import type { Product } from "@/types/product";

/**
 * Product content fetchers. Static in Phase 1; swap the bodies for Hygraph
 * GraphQL queries in Phase 2 without changing call sites.
 */

export async function getProducts(): Promise<Product[]> {
  return PRODUCTS;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return PRODUCT_SLUG_MAP[slug] ?? null;
}

export async function getProductSlugs(): Promise<string[]> {
  return PRODUCTS.map((p) => p.slug);
}

export async function getProductsByCategory(
  categorySlug: string,
): Promise<Product[]> {
  return PRODUCTS.filter((p) => p.categorySlug === categorySlug);
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  return sortProducts(PRODUCTS, "popular").slice(0, limit);
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const sameCategory = PRODUCTS.filter(
    (p) => p.categorySlug === product.categorySlug && p.sku !== product.sku,
  );
  const others = PRODUCTS.filter((p) => p.categorySlug !== product.categorySlug);
  return [...sameCategory, ...others].slice(0, limit);
}
