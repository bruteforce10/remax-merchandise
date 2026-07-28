import { unstable_cache } from "next/cache";

import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Live stock (source of truth) from Supabase `inventory`, keyed by SKU (variant
 * SKU, or product SKU for a simple product). Cached under the `inventory` tag —
 * busted on order confirmation and on product save.
 */

export interface StockRow {
  sku: string;
  productSku: string;
  stock: number;
}

async function fetchStockRows(): Promise<StockRow[]> {
  try {
    const { data, error } = await supabaseAdmin()
      .from("inventory")
      .select("sku, product_sku, stock");
    if (error) throw error;
    return (data ?? []).map((r) => ({
      sku: r.sku as string,
      productSku: r.product_sku as string,
      stock: r.stock as number,
    }));
  } catch (error) {
    console.error("getStockRows failed:", error);
    return [];
  }
}

export const getStockRows: () => Promise<StockRow[]> = unstable_cache(
  fetchStockRows,
  ["inventory-rows"],
  { revalidate: 60, tags: ["inventory"] },
);

/** Sum of live stock per product SKU (variable products roll up their variants). */
export function productStockTotals(rows: StockRow[]): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const row of rows) {
    totals[row.productSku] = (totals[row.productSku] ?? 0) + row.stock;
  }
  return totals;
}

async function fetchStockByProduct(
  productSku: string,
): Promise<Record<string, number>> {
  try {
    const { data, error } = await supabaseAdmin()
      .from("inventory")
      .select("sku, stock")
      .eq("product_sku", productSku);
    if (error) throw error;
    const map: Record<string, number> = {};
    for (const row of data ?? []) {
      map[row.sku as string] = row.stock as number;
    }
    return map;
  } catch (error) {
    console.error(`getStockByProduct(${productSku}) failed:`, error);
    return {};
  }
}

/** Live stock for one product's SKUs (its variant SKUs + the product SKU). */
export async function getStockByProduct(
  productSku: string,
): Promise<Record<string, number>> {
  const cached = unstable_cache(
    () => fetchStockByProduct(productSku),
    ["inventory-product", productSku],
    { revalidate: 60, tags: ["inventory"] },
  );
  return cached();
}
