import { unstable_cache } from "next/cache";

import { apiCoIdGet } from "./client";
import { apiCoIdKey, shipDefaultWeightGrams } from "./env";

import type { ShippingCostQuery, ShippingRate } from "@/types/shipping";

const JNE_COURIER_CODE = "JNE";
const REVALIDATE = 60 * 60 * 24; // 24 hours

/**
 * Courier rates (ongkir) from api.co.id, cached per (origin, destination,
 * billed-kg). A tariff is a pure function of those three, so repeat checkouts to
 * the same address — or simply reopening /cart — are served from the Data Cache
 * instead of burning a paid API call. Tariffs move a few times a year, so a day
 * of staleness is cheap; admins can still override ongkir per order.
 *
 * Returns [] when the API is unconfigured or unreachable so checkout falls back
 * to a manual-ongkir flow rather than failing hard.
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

/**
 * One (origin, destination, kg) tariff, cached under those three values.
 *
 * Nothing derived from a failure may enter the cache, or a single hiccup pins
 * "no ongkir" onto that route for the whole window. `apiCoIdGet` throws on
 * network/non-2xx/`is_success:false`, and an absent or courier-less payload
 * throws here — so only a real quote is ever stored. An empty result AFTER the
 * JNE filter is a genuine "JNE doesn't serve this route" and is cached as such.
 */
function cachedRates(
  origin: string,
  destination: string,
  kg: number,
): () => Promise<ShippingRate[]> {
  return unstable_cache(
    async () => {
      const data = await apiCoIdGet<RawCostData>("/expedition/shipping-cost", {
        origin_village_code: origin,
        destination_village_code: destination,
        weight: kg,
      });
      if (!data || data.couriers.length === 0) {
        throw new Error("api.co.id /expedition/shipping-cost → empty couriers");
      }
      return data.couriers
        .filter((c) => c.courier_code === JNE_COURIER_CODE)
        .map((c) => ({
          courierCode: c.courier_code,
          courierName: c.courier_name || "JNE Express",
          price: c.price,
          weightKg: c.weight,
          estimation: c.estimation ?? "",
        }));
    },
    ["shipping-cost", origin, destination, String(kg)],
    { revalidate: REVALIDATE, tags: ["shipping-cost"] },
  );
}

export async function getShippingRates(
  query: ShippingCostQuery,
): Promise<ShippingRate[]> {
  if (!query.originVillageCode || !query.destinationVillageCode) return [];
  // Degrade to manual ongkir — deliberately uncached — when the key is unset.
  if (!apiCoIdKey()) return [];
  try {
    return await cachedRates(
      query.originVillageCode,
      query.destinationVillageCode,
      billableKg(query.weightGrams),
    )();
  } catch (error) {
    console.error("getShippingRates failed:", error);
    return [];
  }
}
