import { PRODUCTS } from "@/lib/data/catalog";
import type {
  AdminBanner,
  AdminProduct,
  CountryStat,
  DeviceStat,
  KeywordStat,
  MediaItem,
  MetricCard,
  ProductStatus,
} from "@/types/admin";
import type { Lead } from "@/types/lead";

/**
 * Static operational seed (Phase 1). Enriches the public catalog with
 * demo stats/status and adds leads, banners, media, and analytics.
 * Replaced by Supabase (Prisma) queries in Phase 2.
 */

// ── Products enriched with stats ─────────────────────────────────────────────
export const ADMIN_PRODUCTS: AdminProduct[] = PRODUCTS.map((p, i) => {
  const base =
    p.badge === "featured"
      ? 1750
      : p.badge === "popular"
        ? 1250
        : p.badge === "new"
          ? 680
          : 420;
  const views = base + ((i * 137) % 640);
  const waClicks = Math.round(views * (0.07 + (i % 5) * 0.008));
  const status: ProductStatus = i % 7 === 3 ? "draft" : "published";
  return { ...p, views, waClicks, status };
});

// ── Leads ────────────────────────────────────────────────────────────────────
export const LEADS: Lead[] = [
  { id: "l1", date: "21 Jul, 09:42", product: "Jaket Bomber Corporate", qty: 24, session: "#a4f92c", country: "Indonesia", device: "Desktop", status: "new" },
  { id: "l2", date: "21 Jul, 08:15", product: "Polo Shirt Lacoste Premium", qty: 50, session: "#b81e03", country: "Indonesia", device: "Mobile", status: "contacted" },
  { id: "l3", date: "20 Jul, 16:30", product: "Tumbler Stainless Vacuum", qty: 100, session: "#c92d1a", country: "Indonesia", device: "Mobile", status: "completed" },
  { id: "l4", date: "20 Jul, 14:08", product: "Hoodie Fleece Premium", qty: 36, session: "#d01f44", country: "Singapura", device: "Desktop", status: "new" },
  { id: "l5", date: "20 Jul, 11:52", product: "Payung Lipat 3 Otomatis", qty: 200, session: "#e11d2e", country: "Indonesia", device: "Tablet", status: "contacted" },
  { id: "l6", date: "19 Jul, 15:21", product: "Tote Bag Kanvas Blacu", qty: 150, session: "#f30a1b", country: "Indonesia", device: "Mobile", status: "completed" },
  { id: "l7", date: "19 Jul, 10:03", product: "Backpack Laptop Corporate", qty: 24, session: "#0a91cd", country: "Malaysia", device: "Desktop", status: "new" },
  { id: "l8", date: "18 Jul, 17:45", product: "Mug Keramik Custom", qty: 100, session: "#1b7fae", country: "Indonesia", device: "Mobile", status: "contacted" },
];

// ── Banners ──────────────────────────────────────────────────────────────────
export const ADMIN_BANNERS: AdminBanner[] = [
  { id: "ab1", order: 1, title: "Premium Merchandise RE/MAX", subtitle: "Corporate merchandise & promotional gifts", buttonText: "Lihat Produk", link: "/search", date: "01 Jul 2026", status: "published", gradient: "linear-gradient(120deg,#26282e,#5a5e69)" },
  { id: "ab2", order: 2, title: "Seragam & Event Kit", subtitle: "Custom sesuai brand Anda", buttonText: "Pesan Sekarang", link: "/categories/jacket", date: "05 Jul 2026", status: "published", gradient: "linear-gradient(120deg,#1c1d21,#4c4f57)" },
  { id: "ab3", order: 3, title: "Promo Corporate Gift", subtitle: "Tumbler, payung & goodie bag", buttonText: "Chat WhatsApp", link: "/contact", date: "12 Jul 2026", status: "draft", gradient: "linear-gradient(120deg,#2a2528,#63606a)" },
];

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
