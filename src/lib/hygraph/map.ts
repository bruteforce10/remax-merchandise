import type {
  AdminBanner,
  AdminProduct,
  AdminProductDetail,
  ProductCustomVariant,
  ProductStatus,
} from "@/types/admin";
import type { Banner } from "@/types/banner";
import type { Category } from "@/types/category";
import type { Product, ProductBadge } from "@/types/product";

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
}

export interface RawProduct {
  sku: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  price: number | null;
  stock: number | null;
  badge: string | null;
  category: { slug: string } | null;
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
  };
}

export interface RawBanner {
  id: string;
  alt: string;
  link: string | null;
  order: number | null;
  publishStatus?: string | null;
  createdAt?: string;
  image: { url: string } | null;
}

export function mapPublicBanner(b: RawBanner): Banner {
  const order = b.order ?? 1;
  return {
    id: b.id,
    alt: b.alt,
    link: b.link ?? "",
    imageUrl: b.image?.url ?? null,
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
}

function parseCustomVariants(value: unknown): ProductCustomVariant[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item, i) => {
    if (item && typeof item === "object" && "name" in item && "values" in item) {
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
    status: p.publishStatus?.toLowerCase() === "published" ? "published" : "draft",
    views: 0,
    waClicks: 0,
  };
}

export function mapAdminProductDetail(p: RawAdminProduct): AdminProductDetail {
  return {
    ...mapAdminProduct(p),
    description: p.description ?? "",
    sizes: p.sizes ?? [],
    colors: p.colors ?? [],
    material: p.material ?? "",
    branding: p.branding ?? "",
    customVariants: parseCustomVariants(p.customVariants),
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
  };
}
