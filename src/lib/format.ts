/** Formatting helpers — Indonesian locale, Rupiah currency. */

const idNumber = new Intl.NumberFormat("id-ID");

/** `95000` → `"Rp 95.000"`. */
export function formatPrice(value: number): string {
  return `Rp ${idNumber.format(value)}`;
}

/** `18240` → `"18.240"`. */
export function formatNumber(value: number): string {
  return idNumber.format(value);
}

const idKg = new Intl.NumberFormat("id-ID", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** `2350` → `"2,35 kg"` — shipment weight in grams rendered as kilograms. */
export function formatKg(grams: number): string {
  return `${idKg.format(grams / 1000)} kg`;
}

/**
 * Courier delivery estimates arrive in mixed casing and language
 * (`"1 - 2 days"`, `"2-4 Day"`, `"4 HARI"`). Normalise to Indonesian:
 * `"1 - 2 hari"`. Returns `""` when the courier omits an estimate.
 */
export function formatEstimation(raw: string): string {
  const text = raw.replace(/\s+/g, " ").trim();
  if (!text) return "";
  const normalized = text
    .replace(/\bdays?\b/gi, "hari")
    .replace(/\bhari\b/gi, "hari");
  return /hari/.test(normalized) ? normalized : `${normalized} hari`;
}

/** `"Polo Shirt Lacoste Premium"` → `"polo-shirt-lacoste-premium"`. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
