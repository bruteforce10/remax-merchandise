import type { Category } from "@/types/category";
import type { Product, ProductBadge } from "@/types/product";

/** Raw Hygraph response shapes + mappers to the app's content types. */

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
