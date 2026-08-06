import type {
  AdminBanner,
  AdminProduct,
  AdminProductDetail,
  ProductCustomVariant,
  ProductStatus,
} from "@/types/admin";
import type { Banner } from "@/types/banner";
import type { Category } from "@/types/category";
import { productOptions } from "@/lib/variants";
import type {
  Product,
  ProductBadge,
  ProductDetail,
  ProductVariant,
} from "@/types/product";

/** Raw Hygraph response shapes + mappers to the app's content types. */

/** Gradient fallbacks used for banners without an attached image. */
export const BANNER_GRADIENTS = [
  "linear-gradient(120deg,#26282e,#5a5e69)",
  "linear-gradient(120deg,#1c1d21,#4c4f57)",
  "linear-gradient(120deg,#2a2528,#63606a)",
];

function gradientForOrder(order: number): string {
  const index = Math.max(0, order - 1) % BANNER_GRADIENTS.length;
  return BANNER_GRADIENTS[index];
}

export interface RawCategory {
  slug: string;
  name: string;
  icon: string | null;
  material: string | null;
  branding: string | null;
  colors: string[] | null;
  sizes: string[] | null;
  description: string | null;
  featured: boolean | null;
}

export interface RawProduct {
  sku: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  price: number | null;
  stock: number | null;
  badge: string | null;
  keywords: string | null;
  colors: string[] | null;
  sizes: string[] | null;
  customVariants: unknown;
  category: { slug: string } | null;
  images: { url: string }[] | null;
}

export function mapCategory(c: RawCategory): Category {
  return {
    slug: c.slug,
    name: c.name,
    icon: c.icon ?? "package",
    material: c.material ?? "",
    branding: c.branding ?? "",
    colors: c.colors ?? [],
    sizes: c.sizes ?? [],
    description: c.description ?? "",
    featured: c.featured ?? false,
  };
}

function mapBadge(badge: string | null): ProductBadge | null {
  if (!badge) return null;
  const value = badge.toLowerCase();
  if (value === "new" || value === "popular" || value === "featured") {
    return value;
  }
  return null;
}

/**
 * Whether a product exposes any selectable option dimension (color / size /
 * custom group). Mirrors the storefront's `productOptions` so the card's
 * quick-add decision matches what the detail page renders.
 */
function computeHasOptions(p: {
  colors: string[] | null;
  sizes: string[] | null;
  customVariants: unknown;
}): boolean {
  return (
    productOptions(
      p.colors ?? [],
      p.sizes ?? [],
      parseCustomVariants(p.customVariants),
    ).length > 0
  );
}

export function mapProduct(p: RawProduct): Product {
  return {
    sku: p.sku,
    slug: p.slug,
    name: p.name,
    short: p.shortDescription ?? "",
    categorySlug: p.category?.slug ?? "",
    price: p.price ?? 0,
    stock: p.stock ?? null,
    badge: mapBadge(p.badge),
    imageUrl: p.images?.[0]?.url ?? null,
    keywords: p.keywords ?? "",
    hasOptions: computeHasOptions(p),
  };
}

export interface RawProductVariant {
  id: string;
  sku: string;
  title: string | null;
  price: number | null;
  stock: number | null;
  options: unknown;
}

function parseOptions(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    result[k] = String(v);
  }
  return result;
}

export function mapVariant(v: RawProductVariant): ProductVariant {
  return {
    id: v.id,
    sku: v.sku,
    title: v.title ?? "",
    price: v.price ?? null,
    stock: v.stock ?? null,
    options: parseOptions(v.options),
  };
}

export interface RawProductDetail extends RawProduct {
  description: string | null;
  colors: string[] | null;
  sizes: string[] | null;
  customVariants: unknown;
  variants: RawProductVariant[] | null;
}

export function mapProductDetail(p: RawProductDetail): ProductDetail {
  return {
    ...mapProduct(p),
    description: p.description ?? "",
    images: (p.images ?? []).map((img) => img.url),
    colors: p.colors ?? [],
    sizes: p.sizes ?? [],
    customVariants: parseCustomVariants(p.customVariants),
    variants: (p.variants ?? []).map(mapVariant),
  };
}

export interface RawBanner {
  id: string;
  alt: string;
  link: string | null;
  order: number | null;
  publishStatus?: string | null;
  createdAt?: string;
  image: {
    id: string;
    url: string;
    width?: number | null;
    height?: number | null;
  } | null;
}

export function mapPublicBanner(b: RawBanner): Banner {
  const order = b.order ?? 1;
  const width = b.image?.width ?? 0;
  const height = b.image?.height ?? 0;
  return {
    id: b.id,
    alt: b.alt,
    link: b.link ?? "",
    imageUrl: b.image?.url ?? null,
    imageAspectRatio: width > 0 && height > 0 ? width / height : null,
    gradient: gradientForOrder(order),
    order,
  };
}

export interface RawAdminProduct {
  sku: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  description: string | null;
  price: number | null;
  stock: number | null;
  weight: number | null;
  sizes: string[] | null;
  colors: string[] | null;
  material: string | null;
  branding: string | null;
  customVariants: unknown;
  seoTitle: string | null;
  seoDescription: string | null;
  keywords: string | null;
  badge: string | null;
  publishStatus: string | null;
  category: { slug: string } | null;
  images: { id: string; url: string }[] | null;
  variants: RawProductVariant[] | null;
}

function parseCustomVariants(value: unknown): ProductCustomVariant[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item, i) => {
    if (
      item &&
      typeof item === "object" &&
      "name" in item &&
      "values" in item
    ) {
      const raw = item as { name: unknown; values: unknown };
      const values = Array.isArray(raw.values)
        ? raw.values.map((v) => String(v))
        : [];
      return [{ id: `v${i}`, name: String(raw.name ?? ""), values }];
    }
    return [];
  });
}

export function mapAdminProduct(p: RawAdminProduct): AdminProduct {
  return {
    sku: p.sku,
    slug: p.slug,
    name: p.name,
    short: p.shortDescription ?? "",
    categorySlug: p.category?.slug ?? "",
    price: p.price ?? 0,
    stock: p.stock ?? null,
    badge: mapBadge(p.badge),
    imageUrl: p.images?.[0]?.url ?? null,
    keywords: p.keywords ?? "",
    hasOptions: computeHasOptions(p),
    status:
      p.publishStatus?.toLowerCase() === "published" ? "published" : "draft",
    views: 0,
    waClicks: 0,
  };
}

export function mapAdminProductDetail(p: RawAdminProduct): AdminProductDetail {
  return {
    ...mapAdminProduct(p),
    weight: p.weight ?? 0,
    description: p.description ?? "",
    sizes: p.sizes ?? [],
    colors: p.colors ?? [],
    material: p.material ?? "",
    branding: p.branding ?? "",
    customVariants: parseCustomVariants(p.customVariants),
    variants: (p.variants ?? []).map(mapVariant),
    images: p.images ?? [],
    seoTitle: p.seoTitle ?? "",
    seoDescription: p.seoDescription ?? "",
    keywords: p.keywords ?? "",
  };
}

export function mapAdminBanner(b: RawBanner): AdminBanner {
  const order = b.order ?? 1;
  const status: ProductStatus =
    b.publishStatus?.toLowerCase() === "published" ? "published" : "draft";
  const date = b.createdAt
    ? new Date(b.createdAt).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";
  return {
    id: b.id,
    order,
    alt: b.alt,
    link: b.link ?? "",
    date,
    status,
    gradient: gradientForOrder(order),
    imageId: b.image?.id ?? null,
    imageUrl: b.image?.url ?? null,
  };
}
