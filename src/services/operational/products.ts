import { hygraphWrite } from "@/lib/hygraph/client";
import {
  mapAdminProduct,
  mapAdminProductDetail,
  type RawAdminProduct,
} from "@/lib/hygraph/map";
import {
  ADMIN_PRODUCT_BY_SKU_QUERY,
  ADMIN_PRODUCTS_QUERY,
} from "@/lib/hygraph/queries";
import type { AdminProduct, AdminProductDetail } from "@/types/admin";

/**
 * Admin product fetchers — read the DRAFT stage via the authenticated client so
 * unpublished products are visible. Not cached: the admin needs fresh data.
 */

export async function getAdminProducts(): Promise<AdminProduct[]> {
  try {
    const { products } = await hygraphWrite().request<{
      products: RawAdminProduct[];
    }>(ADMIN_PRODUCTS_QUERY);
    return products.map(mapAdminProduct);
  } catch (error) {
    console.error("getAdminProducts failed:", error);
    return [];
  }
}

export async function getAdminProductBySku(
  sku: string,
): Promise<AdminProductDetail | null> {
  try {
    const { products } = await hygraphWrite().request<{
      products: RawAdminProduct[];
    }>(ADMIN_PRODUCT_BY_SKU_QUERY, { sku });
    const product = products[0];
    return product ? mapAdminProductDetail(product) : null;
  } catch (error) {
    console.error(`getAdminProductBySku(${sku}) failed:`, error);
    return null;
  }
}

export async function getAdminProductSkus(): Promise<string[]> {
  const products = await getAdminProducts();
  return products.map((p) => p.sku);
}
