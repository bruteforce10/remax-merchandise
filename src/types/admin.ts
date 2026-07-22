import type { Product } from "@/types/product";

/** Operational/admin models (map to Supabase `ProductStats`, `Setting`, etc.). */

export type ProductStatus = "published" | "draft";

export interface AdminProduct extends Product {
  status: ProductStatus;
  views: number;
  waClicks: number;
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
  title: string;
  subtitle: string;
  buttonText: string;
  link: string;
  date: string;
  status: ProductStatus;
  gradient: string;
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
