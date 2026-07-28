import type { ProductCustomVariant, ProductVariant } from "@/types/product";

/** Option/variant helpers shared by the admin editor, storefront, and mappers. */

export interface OptionDimension {
  /** Dimension name — used as the key in a variant's `options` map. */
  name: string;
  values: string[];
  /** Render hint: color swatches vs. text chips. */
  kind: "color" | "text";
}

export const COLOR_DIMENSION = "Warna";
export const SIZE_DIMENSION = "Ukuran";

/**
 * Assemble a product's option dimensions from its colors, sizes, and custom
 * variant groups. Empty dimensions are skipped so the matrix stays meaningful.
 */
export function productOptions(
  colors: string[],
  sizes: string[],
  customVariants: ProductCustomVariant[],
): OptionDimension[] {
  const dims: OptionDimension[] = [];
  if (colors.length > 0) {
    dims.push({ name: COLOR_DIMENSION, values: colors, kind: "color" });
  }
  if (sizes.length > 0) {
    dims.push({ name: SIZE_DIMENSION, values: sizes, kind: "text" });
  }
  for (const group of customVariants) {
    const name = group.name.trim();
    if (name && group.values.length > 0) {
      dims.push({ name, values: group.values, kind: "text" });
    }
  }
  return dims;
}

/** Cartesian product of every dimension → one options map per combination. */
export function buildMatrix(
  dimensions: OptionDimension[],
): Record<string, string>[] {
  if (dimensions.length === 0) return [];
  return dimensions.reduce<Record<string, string>[]>(
    (acc, dim) =>
      acc.flatMap((combo) =>
        dim.values.map((value) => ({ ...combo, [dim.name]: value })),
      ),
    [{}],
  );
}

/** Stable key for an options map — order-independent, for row matching. */
export function optionsKey(options: Record<string, string>): string {
  return Object.entries(options)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("|");
}

function skuPart(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]+/g, "");
}

/** Deterministic per-variant SKU, e.g. PL001-HITAM-M-COTTON. */
export function makeVariantSku(
  baseSku: string,
  options: Record<string, string>,
): string {
  const parts = Object.values(options).map(skuPart).filter(Boolean);
  return [baseSku, ...parts].join("-");
}

/** Human label, e.g. "Hitam / M / Cotton". */
export function variantTitle(options: Record<string, string>): string {
  return Object.values(options).join(" / ");
}

/** Find the variant matching a selection, or undefined. */
export function findVariant(
  variants: ProductVariant[],
  selected: Record<string, string>,
): ProductVariant | undefined {
  const key = optionsKey(selected);
  return variants.find((v) => optionsKey(v.options) === key);
}

/** Effective unit price of a variant (falls back to the product base price). */
export function variantPrice(variant: ProductVariant, basePrice: number): number {
  return variant.price ?? basePrice;
}

/** Lowest sellable price across variants, or the base price when none. */
export function priceFrom(variants: ProductVariant[], basePrice: number): number {
  if (variants.length === 0) return basePrice;
  return variants.reduce(
    (min, v) => Math.min(min, v.price ?? basePrice),
    Number.POSITIVE_INFINITY,
  );
}

/** Total stock across variants (null stock counts as 0). */
export function totalStock(variants: ProductVariant[]): number {
  return variants.reduce((sum, v) => sum + (v.stock ?? 0), 0);
}
