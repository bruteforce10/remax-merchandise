import { apiCoIdGet } from "./client";
import { shipDefaultWeightGrams } from "./env";

import type { ShippingCostQuery, ShippingRate } from "@/types/shipping";

const JNE_COURIER_CODE = "JNE";

/**
 * Live courier rates (ongkir) from api.co.id. Unlike the regional lookups this
 * is NOT cached — rates depend on per-order weight and must be fresh. Returns []
 * when the API is unconfigured or unreachable so checkout falls back to a
 * manual-ongkir flow rather than failing hard.
 */

interface RawCourier {
  courier_code: string;
  courier_name: string;
  price: number;
  weight: number;
  estimation: string | null;
}

interface RawCostData {
  origin_village_code: string;
  destination_village_code: string;
  weight: number;
  couriers: RawCourier[];
}

/** Convert grams to billable kg — couriers round up, minimum 1kg. */
export function billableKg(weightGrams: number): number {
  const grams = weightGrams > 0 ? weightGrams : shipDefaultWeightGrams();
  return Math.max(1, Math.ceil(grams / 1000));
}

export async function getShippingRates(
  query: ShippingCostQuery,
): Promise<ShippingRate[]> {
  if (!query.originVillageCode || !query.destinationVillageCode) return [];
  try {
    const data = await apiCoIdGet<RawCostData>("/expedition/shipping-cost", {
      origin_village_code: query.originVillageCode,
      destination_village_code: query.destinationVillageCode,
      weight: billableKg(query.weightGrams),
    });
    if (!data) return [];
    return data.couriers
      .filter((c) => c.courier_code === JNE_COURIER_CODE)
      .map((c) => ({
        courierCode: c.courier_code,
        courierName: c.courier_name || "JNE Express",
        price: c.price,
        weightKg: c.weight,
        estimation: c.estimation ?? "",
      }));
  } catch (error) {
    console.error("getShippingRates failed:", error);
    return [];
  }
}
