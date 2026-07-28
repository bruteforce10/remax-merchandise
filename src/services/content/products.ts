import { unstable_cache } from "next/cache";

import { sortProducts } from "@/lib/catalog";
import { hygraphRead } from "@/lib/hygraph/client";
import {
  mapProduct,
  mapProductDetail,
  type RawProduct,
  type RawProductDetail,
} from "@/lib/hygraph/map";
import { PRODUCT_BY_SLUG_QUERY, PRODUCTS_QUERY } from "@/lib/hygraph/queries";
import type { Product, ProductDetail } from "@/types/product";

/**
 * Product content fetchers — sourced from Hygraph (published entries only).
 * The full list is fetched once and cached (Data Cache); every single-item
 * and derived fetcher reads from that list to stay within the CMS read limit.
 */

async function fetchProducts(): Promise<Product[]> {
  try {
    const { products } = await hygraphRead().request<{ products: RawProduct[] }>(
      PRODUCTS_QUERY,
    );
    return products.map(mapProduct);
  } catch (error) {
    console.error("getProducts failed:", error);
    return [];
  }
}

export const getProducts: () => Promise<Product[]> = unstable_cache(
  fetchProducts,
  ["products"],
  { revalidate: 300, tags: ["products"] },
);

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

async function fetchProductDetail(slug: string): Promise<ProductDetail | null> {
  try {
    const { products } = await hygraphRead().request<{
      products: RawProductDetail[];
    }>(PRODUCT_BY_SLUG_QUERY, { slug });
    const raw = products[0];
    return raw ? mapProductDetail(raw) : null;
  } catch (error) {
    console.error("getProductDetailBySlug failed:", error);
    return null;
  }
}

/**
 * Full product detail (option definitions + variants) for the product page.
 * Fetched per-slug and cached separately from the lean catalog list.
 */
export async function getProductDetailBySlug(
  slug: string,
): Promise<ProductDetail | null> {
  const cached = unstable_cache(
    () => fetchProductDetail(slug),
    ["product-detail", slug],
    { revalidate: 300, tags: ["products"] },
  );
  return cached();
}

export async function getProductSlugs(): Promise<string[]> {
  const products = await getProducts();
  return products.map((p) => p.slug);
}

export async function getProductsByCategory(
  categorySlug: string,
): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.categorySlug === categorySlug);
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const products = await getProducts();
  return sortProducts(products, "popular").slice(0, limit);
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const products = await getProducts();
  const sameCategory = products.filter(
    (p) => p.categorySlug === product.categorySlug && p.sku !== product.sku,
  );
  const others = products.filter(
    (p) => p.categorySlug !== product.categorySlug && p.sku !== product.sku,
  );
  return [...sameCategory, ...others].slice(0, limit);
}
