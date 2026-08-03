import type { MediaItem } from "@/types/admin";

/**
 * Static operational seed (Phase 1). Media library + the dashboard sparkline.
 * Products come from Hygraph via `services/operational`; analytics, the leads
 * funnel, and search stats are all real Supabase data (`events`,
 * `product_stats`, `search_logs`).
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
