import { unstable_cache } from "next/cache";

import { apiCoIdGet } from "./client";
import { apiCoIdKey } from "./env";

import type { RegionOption } from "@/types/shipping";

/**
 * Indonesia Regional API (api.co.id) — cascading administrative regions used by
 * the checkout destination selector. Data is effectively static, so every level
 * is cached hard under the `regional` tag to conserve paid API hits.
 *
 * Nothing derived from a missing key may enter the cache: an unset key
 * short-circuits BEFORE `unstable_cache`, and an absent/empty payload throws
 * INSIDE it. Otherwise a single lookup made before `API_CO_ID_KEY` was set
 * pins an empty list into the Data Cache for the whole revalidate window —
 * which silently empties the selector long after the key is configured.
 */

const REVALIDATE = 60 * 60 * 24 * 7; // 7 days

interface RawRegion {
  code: string;
  name: string;
  is_courier_support?: boolean;
}

function toOption(r: RawRegion): RegionOption {
  return r.is_courier_support === undefined
    ? { code: r.code, name: r.name }
    : { code: r.code, name: r.name, isCourierSupport: r.is_courier_support };
}

/**
 * One region level, cached under `keyParts`. Every level has at least one child
 * upstream (a province always has regencies, a district always has villages),
 * so an empty list means the call failed — throw so only real data is cached.
 */
function cachedRegions(
  path: string,
  keyParts: string[],
): () => Promise<RegionOption[]> {
  return unstable_cache(
    async () => {
      const data = await apiCoIdGet<RawRegion[]>(path);
      if (!data || data.length === 0) {
        throw new Error(`api.co.id ${path} → empty region list`);
      }
      return data.map(toOption);
    },
    keyParts,
    { revalidate: REVALIDATE, tags: ["regional"] },
  );
}

/** Degrades to an empty list — deliberately uncached — when the key is unset. */
function getRegions(path: string, keyParts: string[]): Promise<RegionOption[]> {
  if (!apiCoIdKey()) return Promise.resolve([]);
  return cachedRegions(path, keyParts)();
}

export function getProvinces(): Promise<RegionOption[]> {
  return getRegions("/regional/indonesia/provinces", ["regional-provinces"]);
}

export function getRegencies(provinceCode: string): Promise<RegionOption[]> {
  return getRegions(`/regional/indonesia/provinces/${provinceCode}/regencies`, [
    "regional-regencies",
    provinceCode,
  ]);
}

export function getDistricts(regencyCode: string): Promise<RegionOption[]> {
  return getRegions(`/regional/indonesia/regencies/${regencyCode}/districts`, [
    "regional-districts",
    regencyCode,
  ]);
}

export function getVillages(districtCode: string): Promise<RegionOption[]> {
  return getRegions(`/regional/indonesia/districts/${districtCode}/villages`, [
    "regional-villages",
    districtCode,
  ]);
}
