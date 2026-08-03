import type {
  CountryStat,
  DeviceStat,
  KeywordStat,
  MediaItem,
  MetricCard,
} from "@/types/admin";

/**
 * Static operational seed (Phase 1). Media, banners, and analytics demo data.
 * Products come from Hygraph via `services/operational`; the leads funnel and
 * search stats come from Supabase (`product_stats` / `search_logs`).
 */

// ── Media library ────────────────────────────────────────────────────────────
export const MEDIA_ITEMS: MediaItem[] = [
  { id: "m1", name: "polo-lacoste-01.jpg", type: "image", size: "1.2 MB" },
  { id: "m2", name: "jaket-bomber.jpg", type: "image", size: "980 KB" },
  { id: "m3", name: "katalog-2026.pdf", type: "pdf", size: "4.5 MB" },
  { id: "m4", name: "tumbler-hero.jpg", type: "image", size: "1.8 MB" },
  { id: "m5", name: "icon-whatsapp.svg", type: "icon", size: "12 KB" },
  { id: "m6", name: "hoodie-promo.jpg", type: "image", size: "1.1 MB" },
  { id: "m7", name: "company-profile.mp4", type: "video", size: "18 MB" },
  { id: "m8", name: "banner-desktop.jpg", type: "image", size: "2.2 MB" },
  { id: "m9", name: "mug-custom.jpg", type: "image", size: "860 KB" },
  { id: "m10", name: "icon-cart.svg", type: "icon", size: "8 KB" },
  { id: "m11", name: "tote-bag-02.jpg", type: "image", size: "1.4 MB" },
  { id: "m12", name: "spec-sheet.pdf", type: "pdf", size: "2.1 MB" },
];

// ── Analytics ────────────────────────────────────────────────────────────────
export const DASHBOARD_VIEWS_CHART: number[] = [
  42, 55, 48, 62, 70, 58, 75, 80, 68, 88, 95, 82, 90, 100,
];

export const ANALYTICS_METRICS: MetricCard[] = [
  { label: "Total Views", value: "18.240", delta: "+12,4%", trend: "up" },
  { label: "Klik WhatsApp", value: "1.982", delta: "+8,1%", trend: "up" },
  { label: "Produk Populer", value: "Jaket Bomber", delta: "203 klik", trend: "flat" },
  { label: "Kategori Populer", value: "Polo Shirt", delta: "2.140 views", trend: "flat" },
  { label: "Total Pencarian", value: "4.620", delta: "+15,2%", trend: "up" },
];

export const ANALYTICS_DAILY: [number, number][] = [
  [60, 20], [72, 28], [55, 18], [80, 30], [92, 38], [70, 25], [100, 42],
  [88, 34], [76, 26], [95, 40], [110, 45], [84, 32], [98, 41], [120, 50],
];

export const ANALYTICS_DEVICES: DeviceStat[] = [
  { label: "Mobile", pct: 58 },
  { label: "Desktop", pct: 34 },
  { label: "Tablet", pct: 8 },
];

export const ANALYTICS_KEYWORDS: KeywordStat[] = [
  { label: "polo shirt", count: 420 },
  { label: "jaket", count: 356 },
  { label: "tumbler", count: 298 },
  { label: "payung", count: 245 },
  { label: "tote bag", count: 210 },
  { label: "hoodie", count: 188 },
  { label: "mug", count: 154 },
  { label: "lanyard", count: 132 },
];

export const ANALYTICS_COUNTRIES: CountryStat[] = [
  { name: "Indonesia", pct: "86%" },
  { name: "Singapura", pct: "7%" },
  { name: "Malaysia", pct: "4%" },
  { name: "Lainnya", pct: "3%" },
];
