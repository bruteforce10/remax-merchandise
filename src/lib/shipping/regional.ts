import { unstable_cache } from "next/cache";

import { apiCoIdGet } from "./client";

import type { RegionOption } from "@/types/shipping";

/**
 * Indonesia Regional API (api.co.id) — cascading administrative regions used by
 * the checkout destination selector. Data is effectively static, so every level
 * is cached hard under the `regional` tag to conserve paid API hits. The fetcher
 * throws on transient errors so a failed call is never cached as an empty list.
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

async function fetchProvinces(): Promise<RegionOption[]> {
  const data = await apiCoIdGet<RawRegion[]>("/regional/indonesia/provinces");
  return (data ?? []).map(toOption);
}

export const getProvinces: () => Promise<RegionOption[]> = unstable_cache(
  fetchProvinces,
  ["regional-provinces"],
  { revalidate: REVALIDATE, tags: ["regional"] },
);

export async function getRegencies(
  provinceCode: string,
): Promise<RegionOption[]> {
  const cached = unstable_cache(
    async () => {
      const data = await apiCoIdGet<RawRegion[]>(
        `/regional/indonesia/provinces/${provinceCode}/regencies`,
      );
      return (data ?? []).map(toOption);
    },
    ["regional-regencies", provinceCode],
    { revalidate: REVALIDATE, tags: ["regional"] },
  );
  return cached();
}

export async function getDistricts(
  regencyCode: string,
): Promise<RegionOption[]> {
  const cached = unstable_cache(
    async () => {
      const data = await apiCoIdGet<RawRegion[]>(
        `/regional/indonesia/regencies/${regencyCode}/districts`,
      );
      return (data ?? []).map(toOption);
    },
    ["regional-districts", regencyCode],
    { revalidate: REVALIDATE, tags: ["regional"] },
  );
  return cached();
}

export async function getVillages(
  districtCode: string,
): Promise<RegionOption[]> {
  const cached = unstable_cache(
    async () => {
      const data = await apiCoIdGet<RawRegion[]>(
        `/regional/indonesia/districts/${districtCode}/villages`,
      );
      return (data ?? []).map(toOption);
    },
    ["regional-villages", districtCode],
    { revalidate: REVALIDATE, tags: ["regional"] },
  );
  return cached();
}
