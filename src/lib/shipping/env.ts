/**
 * Server-only api.co.id (Indonesia Expedition Cost + Regional) env accessors.
 * The API key is privileged — NEVER import this into a Client Component. All
 * api.co.id calls are proxied through our own route handlers so the key stays
 * on the server.
 */

const DEFAULT_BASE_URL = "https://use.api.co.id";
const DEFAULT_WEIGHT_GRAMS = 1000;

/** api.co.id API key. Empty when unconfigured — callers degrade gracefully. */
export function apiCoIdKey(): string {
  return process.env.API_CO_ID_KEY ?? "";
}

/** Base URL for api.co.id, without a trailing slash. */
export function apiCoIdBaseUrl(): string {
  const raw = process.env.API_CO_ID_BASE_URL?.trim();
  return (raw ? raw.replace(/\/+$/, "") : DEFAULT_BASE_URL) || DEFAULT_BASE_URL;
}

/** 10-digit village code the store ships FROM (origin for every ongkir lookup). */
export function shipOriginVillageCode(): string {
  return process.env.SHIP_ORIGIN_VILLAGE_CODE?.trim() ?? "";
}

/** Fallback per-unit weight in grams when a product has none. */
export function shipDefaultWeightGrams(): number {
  const raw = Number(process.env.SHIP_DEFAULT_WEIGHT_GRAMS);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_WEIGHT_GRAMS;
}

/** True when both the key and a store origin are set — live ongkir is possible. */
export function isShippingConfigured(): boolean {
  return apiCoIdKey().length > 0 && shipOriginVillageCode().length > 0;
}
