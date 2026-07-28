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
import {
  getStockByProduct,
  getStockRows,
  productStockTotals,
} from "@/services/operational/inventory";
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
    const mapped = products.map(mapAdminProduct);
    // Override the Hygraph seed with live Supabase stock (source of truth).
    const totals = productStockTotals(await getStockRows());
    return mapped.map((p) =>
      p.sku in totals ? { ...p, stock: totals[p.sku] } : p,
    );
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
    if (!product) return null;
    const detail = mapAdminProductDetail(product);
    // Override the Hygraph seed with live Supabase stock (source of truth).
    const stock = await getStockByProduct(detail.sku);
    return {
      ...detail,
      stock: detail.sku in stock ? stock[detail.sku] : detail.stock,
      variants: detail.variants.map((v) =>
        v.sku in stock ? { ...v, stock: stock[v.sku] } : v,
      ),
    };
  } catch (error) {
    console.error(`getAdminProductBySku(${sku}) failed:`, error);
    return null;
  }
}

export async function getAdminProductSkus(): Promise<string[]> {
  const products = await getAdminProducts();
  return products.map((p) => p.sku);
}
