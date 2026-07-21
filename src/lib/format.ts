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

/** `"Polo Shirt Lacoste Premium"` → `"polo-shirt-lacoste-premium"`. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
