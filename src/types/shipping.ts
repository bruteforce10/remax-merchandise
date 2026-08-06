/** An administrative region (province/regency/district/village) for selectors. */
export interface RegionOption {
  /** Numeric code: 2-digit province, 4 regency, 6 district, 10 village. */
  code: string;
  name: string;
  /** Villages only — false when no courier serves it (unshippable destination). */
  isCourierSupport?: boolean;
}

/** A single courier rate returned by the api.co.id shipping-cost endpoint. */
export interface ShippingRate {
  courierCode: string;
  courierName: string;
  /** Price in IDR for the billed weight. */
  price: number;
  /** Billed weight in kg (rounded up by the courier). */
  weightKg: number;
  /** Free-form delivery estimate, e.g. "1 - 2 days" — "" when the courier omits it. */
  estimation: string;
}

/** Inputs to a shipping-cost lookup. */
export interface ShippingCostQuery {
  originVillageCode: string;
  destinationVillageCode: string;
  weightGrams: number;
}

/** Delivery destination captured at checkout and stored on the order. */
export interface ShippingDestination {
  recipientName: string;
  recipientPhone: string;
  addressDetail: string;
  provinceCode: string;
  provinceName: string;
  regencyCode: string;
  regencyName: string;
  districtCode: string;
  districtName: string;
  villageCode: string;
  villageName: string;
  postalCode: string;
}
