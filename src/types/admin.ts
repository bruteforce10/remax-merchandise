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
  /** Shipping weight per unit in grams (0 = unset → uses the global fallback). */
  weight: number;
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

/** A dashboard number plus its real momentum vs. the preceding window. */
export interface DashboardMetric {
  value: number;
  /** Formatted change label ("+12,5%", "Baru", "—"). */
  delta: string;
  trend: "up" | "down" | "flat";
}

/** One bar in the dashboard views chart (day label + view count). */
export interface ViewsPoint {
  label: string;
  views: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  published: number;
  draft: number;
  leads: DashboardMetric;
  waClicksToday: DashboardMetric;
  searches: DashboardMetric;
  viewsToday: DashboardMetric;
  /** Daily product views for the chart, oldest first. */
  chart: ViewsPoint[];
  chartTotal: number;
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
  weekCount: number;
  lastSearched: string | null;
}

/** One bar in the weekly trend chart (week label + view/WA counts). */
export interface WeeklyPoint {
  label: string;
  views: number;
  wa: number;
}

export interface Analytics {
  metrics: MetricCard[];
  weekly: WeeklyPoint[];
  keywords: KeywordStat[];
  topProducts: { name: string; views: number }[];
}
