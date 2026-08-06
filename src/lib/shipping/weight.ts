import { supabaseAdmin } from "@/lib/supabase/admin";

import { shipDefaultWeightGrams } from "./env";

/**
 * Resolve shipment weight server-side from Supabase `inventory` (mirrored from
 * each product's Hygraph weight on save). Weight is NEVER taken from the client —
 * it drives the ongkir price, so it must come from a trusted source. SKUs with no
 * inventory row, or a zero weight, fall back to the global default so checkout
 * always has a shippable weight.
 */

export interface ResolvedWeights {
  /** Total shipment weight in grams (Σ unit × qty). */
  totalGrams: number;
  /** Per-SKU unit weight in grams (for order_items snapshots). */
  unitGrams: Record<string, number>;
}

export async function resolveItemWeights(
  items: { sku: string; qty: number }[],
): Promise<ResolvedWeights> {
  const fallback = shipDefaultWeightGrams();
  const skus = [...new Set(items.map((i) => i.sku))];
  const unitGrams: Record<string, number> = {};

  if (skus.length > 0) {
    const { data, error } = await supabaseAdmin()
      .from("inventory")
      .select("sku, weight_grams")
      .in("sku", skus);
    if (error) throw error;
    for (const row of data ?? []) {
      const w = row.weight_grams as number | null;
      unitGrams[row.sku as string] = w && w > 0 ? w : fallback;
    }
  }

  let totalGrams = 0;
  for (const item of items) {
    const unit = unitGrams[item.sku] ?? fallback;
    unitGrams[item.sku] = unit;
    totalGrams += unit * item.qty;
  }
  return { totalGrams, unitGrams };
}
