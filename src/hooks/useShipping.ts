"use client";

import * as React from "react";

import type { ActionResult } from "@/types/action";
import type {
  RegionOption,
  ShippingDestination,
  ShippingRate,
} from "@/types/shipping";

/**
 * Checkout shipping state: the cascading destination selector (province → regency
 * → district → village) plus live courier rates (ongkir). Provinces are fetched
 * server-side and passed in; deeper levels + rates load on demand from our proxy
 * routes inside event handlers (never useEffect, per the data-fetching rules).
 */

export type RegionLevel = "province" | "regency" | "district" | "village";
export type RatesStatus = "idle" | "loading" | "ready" | "empty" | "error";

export interface CartItemRef {
  sku: string;
  qty: number;
}

export interface UseShippingResult {
  provinces: RegionOption[];
  regencies: RegionOption[];
  districts: RegionOption[];
  villages: RegionOption[];
  loading: Record<RegionLevel, boolean>;
  selected: Record<RegionLevel, RegionOption | null>;
  selectRegion: (level: RegionLevel, option: RegionOption | null) => void;
  applyDestination: (destination: ShippingDestination) => void;
  resetDestination: () => void;
  recipientName: string;
  recipientPhone: string;
  addressDetail: string;
  setRecipientName: (v: string) => void;
  setRecipientPhone: (v: string) => void;
  setAddressDetail: (v: string) => void;
  rates: ShippingRate[];
  ratesStatus: RatesStatus;
  weightGrams: number;
  selectedCourier: ShippingRate | null;
  selectCourier: (rate: ShippingRate) => void;
  /** Re-fetch rates for the currently selected village (e.g. after a cart edit). */
  quote: () => void;
  /** Full destination once every level + recipient field is set, else null. */
  destination: ShippingDestination | null;
  /** "Kelurahan, Kecamatan, Kota, Provinsi" label for summaries/messages. */
  destinationLabel: string;
  error: string;
}

async function getRegions(url: string): Promise<RegionOption[]> {
  const res = await fetch(url);
  const body = (await res.json()) as ActionResult<RegionOption[]>;
  if (!body.success || !body.data) {
    throw new Error(body.message || "Gagal memuat wilayah");
  }
  return body.data;
}

const NO_LOADING: Record<RegionLevel, boolean> = {
  province: false,
  regency: false,
  district: false,
  village: false,
};

export function useShipping(
  initialProvinces: RegionOption[],
  items: CartItemRef[],
  initialDestination?: ShippingDestination | null,
): UseShippingResult {
  const initialProvince = initialDestination
    ? { code: initialDestination.provinceCode, name: initialDestination.provinceName }
    : null;
  const initialRegency = initialDestination
    ? { code: initialDestination.regencyCode, name: initialDestination.regencyName }
    : null;
  const initialDistrict = initialDestination
    ? { code: initialDestination.districtCode, name: initialDestination.districtName }
    : null;
  const initialVillage = initialDestination
    ? { code: initialDestination.villageCode, name: initialDestination.villageName }
    : null;
  const [regencies, setRegencies] = React.useState<RegionOption[]>(
    initialRegency ? [initialRegency] : [],
  );
  const [districts, setDistricts] = React.useState<RegionOption[]>(
    initialDistrict ? [initialDistrict] : [],
  );
  const [villages, setVillages] = React.useState<RegionOption[]>(
    initialVillage ? [initialVillage] : [],
  );
  const [selected, setSelected] = React.useState<
    Record<RegionLevel, RegionOption | null>
  >({
    province: initialProvince,
    regency: initialRegency,
    district: initialDistrict,
    village: initialVillage,
  });
  const [loading, setLoading] = React.useState<Record<RegionLevel, boolean>>(
    NO_LOADING,
  );
  const [recipientName, setRecipientName] = React.useState(
    initialDestination?.recipientName ?? "",
  );
  const [recipientPhone, setRecipientPhone] = React.useState(
    initialDestination?.recipientPhone ?? "",
  );
  const [addressDetail, setAddressDetail] = React.useState(
    initialDestination?.addressDetail ?? "",
  );
  const [rates, setRates] = React.useState<ShippingRate[]>([]);
  const [ratesStatus, setRatesStatus] = React.useState<RatesStatus>("idle");
  const [weightGrams, setWeightGrams] = React.useState(0);
  const [selectedCourier, setSelectedCourier] =
    React.useState<ShippingRate | null>(null);
  const [error, setError] = React.useState("");

  // Latest cart contents / selected village kept in refs so the memoized handlers
  // always read fresh values without being re-created on every render.
  const itemsRef = React.useRef(items);
  itemsRef.current = items;
  const villageRef = React.useRef<RegionOption | null>(null);
  villageRef.current = selected.village;

  const fetchRates = React.useCallback(
    async (villageCode: string): Promise<void> => {
      const current = itemsRef.current;
      if (!villageCode) return;
      if (current.length === 0) {
        setRatesStatus("idle");
        return;
      }
      setRatesStatus("loading");
      setError("");
      try {
        const res = await fetch("/api/shipping/cost", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            destinationVillageCode: villageCode,
            items: current,
          }),
        });
        const body = (await res.json()) as ActionResult<{
          rates: ShippingRate[];
          weightGrams: number;
        }>;
        if (!body.success || !body.data) {
          setRates([]);
          setWeightGrams(0);
          setRatesStatus("error");
          setError(body.message || "Gagal menghitung ongkir");
          return;
        }
        setRates(body.data.rates);
        setWeightGrams(body.data.weightGrams);
        setRatesStatus(body.data.rates.length > 0 ? "ready" : "empty");
      } catch {
        setRates([]);
        setRatesStatus("error");
        setError("Gagal menghitung ongkir. Coba lagi.");
      }
    },
    [],
  );

  const selectRegion = React.useCallback(
    (level: RegionLevel, option: RegionOption | null): void => {
      setSelectedCourier(null);
      setError("");
      if (level === "province") {
        setSelected({ province: option, regency: null, district: null, village: null });
        setRegencies([]);
        setDistricts([]);
        setVillages([]);
        setRates([]);
        setRatesStatus("idle");
        if (option) {
          setLoading((l) => ({ ...l, regency: true }));
          getRegions(`/api/regional/regencies?province=${option.code}`)
            .then(setRegencies)
            .catch(() => setError("Gagal memuat kota/kabupaten"))
            .finally(() => setLoading((l) => ({ ...l, regency: false })));
        }
      } else if (level === "regency") {
        setSelected((s) => ({ ...s, regency: option, district: null, village: null }));
        setDistricts([]);
        setVillages([]);
        setRates([]);
        setRatesStatus("idle");
        if (option) {
          setLoading((l) => ({ ...l, district: true }));
          getRegions(`/api/regional/districts?regency=${option.code}`)
            .then(setDistricts)
            .catch(() => setError("Gagal memuat kecamatan"))
            .finally(() => setLoading((l) => ({ ...l, district: false })));
        }
      } else if (level === "district") {
        setSelected((s) => ({ ...s, district: option, village: null }));
        setVillages([]);
        setRates([]);
        setRatesStatus("idle");
        if (option) {
          setLoading((l) => ({ ...l, village: true }));
          getRegions(`/api/regional/villages?district=${option.code}`)
            .then(setVillages)
            .catch(() => setError("Gagal memuat desa/kelurahan"))
            .finally(() => setLoading((l) => ({ ...l, village: false })));
        }
      } else {
        setSelected((s) => ({ ...s, village: option }));
        setRates([]);
        setRatesStatus(option ? "loading" : "idle");
        if (option) void fetchRates(option.code);
      }
    },
    [fetchRates],
  );

  const applyDestination = React.useCallback(
    (destination: ShippingDestination): void => {
      const province = { code: destination.provinceCode, name: destination.provinceName };
      const regency = { code: destination.regencyCode, name: destination.regencyName };
      const district = { code: destination.districtCode, name: destination.districtName };
      const village = { code: destination.villageCode, name: destination.villageName };
      setSelected({ province, regency, district, village });
      setRegencies([regency]);
      setDistricts([district]);
      setVillages([village]);
      setRecipientName(destination.recipientName);
      setRecipientPhone(destination.recipientPhone);
      setAddressDetail(destination.addressDetail);
      setSelectedCourier(null);
      setRates([]);
      setRatesStatus("loading");
      void fetchRates(destination.villageCode);
    },
    [fetchRates],
  );

  const resetDestination = React.useCallback((): void => {
    setSelected({ province: null, regency: null, district: null, village: null });
    setRegencies([]);
    setDistricts([]);
    setVillages([]);
    setRecipientName("");
    setRecipientPhone("");
    setAddressDetail("");
    setSelectedCourier(null);
    setRates([]);
    setRatesStatus("idle");
    setError("");
  }, []);

  const quote = React.useCallback((): void => {
    if (villageRef.current) void fetchRates(villageRef.current.code);
  }, [fetchRates]);

  const selectCourier = React.useCallback((rate: ShippingRate): void => {
    setSelectedCourier(rate);
  }, []);

  // A cart edit (add/remove/qty) makes any quoted ongkir stale — clear it so the
  // customer re-quotes. State reset only (no fetch), guarded so it never fires on
  // the initial render.
  const itemsSig = items.map((i) => `${i.sku}:${i.qty}`).join(",");
  const prevSig = React.useRef(itemsSig);
  React.useEffect(() => {
    if (prevSig.current === itemsSig) return;
    prevSig.current = itemsSig;
    setRates([]);
    setRatesStatus("idle");
    setSelectedCourier(null);
  }, [itemsSig]);

  const destination = React.useMemo<ShippingDestination | null>(() => {
    const { province, regency, district, village } = selected;
    if (!province || !regency || !district || !village) return null;
    if (!recipientName.trim() || !recipientPhone.trim() || !addressDetail.trim()) {
      return null;
    }
    return {
      recipientName: recipientName.trim(),
      recipientPhone: recipientPhone.trim(),
      addressDetail: addressDetail.trim(),
      provinceCode: province.code,
      provinceName: province.name,
      regencyCode: regency.code,
      regencyName: regency.name,
      districtCode: district.code,
      districtName: district.name,
      villageCode: village.code,
      villageName: village.name,
      postalCode: "",
    };
  }, [selected, recipientName, recipientPhone, addressDetail]);

  const destinationLabel = React.useMemo<string>(
    () =>
      [
        selected.village?.name,
        selected.district?.name,
        selected.regency?.name,
        selected.province?.name,
      ]
        .filter(Boolean)
        .join(", "),
    [selected],
  );

  return {
    provinces: initialProvinces,
    regencies,
    districts,
    villages,
    loading,
    selected,
    selectRegion,
    applyDestination,
    resetDestination,
    recipientName,
    recipientPhone,
    addressDetail,
    setRecipientName,
    setRecipientPhone,
    setAddressDetail,
    rates,
    ratesStatus,
    weightGrams,
    selectedCourier,
    selectCourier,
    quote,
    destination,
    destinationLabel,
    error,
  };
}
