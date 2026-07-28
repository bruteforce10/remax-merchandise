import type {
  Product,
  ProductCustomVariant,
  ProductVariant,
} from "@/types/product";

/** Operational/admin models (map to Supabase `ProductStats`, `Setting`, etc.). */

// Re-exported so existing admin-side importers keep a single source.
export type { ProductCustomVariant, ProductVariant };

export type ProductStatus = "published" | "draft";

export interface AdminProduct extends Product {
  status: ProductStatus;
  views: number;
  waClicks: number;
}

/** A published Hygraph asset reference (id + delivery URL). */
export interface AssetImage {
  id: string;
  url: string;
}

/** Full product shape for the editor (edit mode) — all editable fields. */
export interface AdminProductDetail extends AdminProduct {
  description: string;
  sizes: string[];
  colors: string[];
  material: string;
  branding: string;
  customVariants: ProductCustomVariant[];
  variants: ProductVariant[];
  images: AssetImage[];
  seoTitle: string;
  seoDescription: string;
  keywords: string;
}

export type MediaType = "image" | "pdf" | "icon" | "video";

export interface MediaItem {
  id: string;
  name: string;
  type: MediaType;
  size: string;
}

export interface AdminBanner {
  id: string;
  order: number;
  alt: string;
  link: string;
  date: string;
  status: ProductStatus;
  gradient: string;
  imageId: string | null;
  imageUrl: string | null;
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  published: number;
  draft: number;
  totalLeads: number;
  waClicksToday: number;
  searches: number;
  viewsToday: number;
}

export interface MetricCard {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "flat";
}

export interface KeywordStat {
  label: string;
  count: number;
}

export interface CountryStat {
  name: string;
  pct: string;
}

export interface DeviceStat {
  label: string;
  pct: number;
}

export interface Analytics {
  metrics: MetricCard[];
  daily: [number, number][];
  devices: DeviceStat[];
  keywords: KeywordStat[];
  countries: CountryStat[];
  topProducts: { name: string; views: number }[];
}
