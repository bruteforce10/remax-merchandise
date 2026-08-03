import { CATEGORIES } from "@/lib/data/catalog";
import { formatNumber } from "@/lib/format";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAdminProducts } from "@/services/operational/products";
import { getPopularKeywords, getTotalSearches } from "@/services/operational/search";
import type {
  Analytics,
  CountryStat,
  DeviceStat,
  MetricCard,
} from "@/types/admin";

/** Rolling windows: breakdowns over 30 days, the trend chart over 14. */
const WINDOW_DAYS = 30;
const DAILY_DAYS = 14;
const KEYWORD_LIMIT = 12;

/** Per-product cumulative funnel (same source as the Leads page). */
interface StatRow {
  product_slug: string;
  views: number | string;
  cart_count: number | string;
  checkout_count: number | string;
}
interface DailyRow {
  day: string;
  views: number | string;
  wa_clicks: number | string;
}
interface DeviceRow {
  device: string;
  sessions: number | string;
}
interface CountryRow {
  country: string;
  count: number | string;
}
interface TotalsRow {
  views_cur: number | string;
  views_prev: number | string;
  wa_cur: number | string;
  wa_prev: number | string;
}
interface SearchTotalsRow {
  cur: number | string;
  prev: number | string;
}

const DEVICE_LABELS: Record<string, string> = {
  mobile: "Mobile",
  desktop: "Desktop",
  tablet: "Tablet",
};

/** ISO country code → Indonesian display name (common markets; else the code). */
const COUNTRY_NAMES: Record<string, string> = {
  ID: "Indonesia",
  SG: "Singapura",
  MY: "Malaysia",
  US: "Amerika Serikat",
  AU: "Australia",
  GB: "Inggris",
  NL: "Belanda",
  JP: "Jepang",
  CN: "Tiongkok",
  KR: "Korea Selatan",
  IN: "India",
  TH: "Thailand",
  PH: "Filipina",
  VN: "Vietnam",
  XX: "Tidak diketahui",
};

/** Percent-change delta vs. the preceding window, formatted id-ID. */
function pctDelta(
  cur: number,
  prev: number,
): { delta: string; trend: MetricCard["trend"] } {
  if (prev <= 0) {
    return cur > 0
      ? { delta: "Baru", trend: "up" }
      : { delta: "Sepanjang waktu", trend: "flat" };
  }
  const pct = ((cur - prev) / prev) * 100;
  const sign = pct >= 0 ? "+" : "−";
  const value = Math.abs(pct).toFixed(1).replace(".", ",");
  return { delta: `${sign}${value}%`, trend: pct >= 0 ? "up" : "down" };
}

function countryName(code: string): string {
  return COUNTRY_NAMES[code] ?? code;
}

/** Top devices as display rows, ordered by session share (drops empty data). */
function toDeviceStats(rows: DeviceRow[]): DeviceStat[] {
  const total = rows.reduce((sum, r) => sum + Number(r.sessions), 0);
  if (total === 0) return [];
  return rows.map((r) => ({
    label: DEVICE_LABELS[r.device] ?? r.device,
    pct: Math.round((Number(r.sessions) / total) * 100),
  }));
}

/** Top 3 countries by share + an aggregated "Lainnya" for the remainder. */
function toCountryStats(rows: CountryRow[]): CountryStat[] {
  const total = rows.reduce((sum, r) => sum + Number(r.count), 0);
  if (total === 0) return [];
  const pct = (n: number): string => `${Math.round((n / total) * 100)}%`;
  const top = rows.slice(0, 3);
  const restTotal = rows.slice(3).reduce((sum, r) => sum + Number(r.count), 0);
  const stats: CountryStat[] = top.map((r) => ({
    name: countryName(r.country),
    pct: pct(Number(r.count)),
  }));
  if (restTotal > 0) stats.push({ name: "Lainnya", pct: pct(restTotal) });
  return stats;
}

/**
 * Real analytics for the admin dashboard. Totals, top products, and popular
 * category come from `product_stats` (the accumulated funnel data the Leads
 * page also uses) plus `search_logs` — so they are populated immediately. The
 * daily trend, device and country breakdowns, and WhatsApp-click totals come
 * from the `events` time-series (recorded from now on; no historical backfill
 * is possible, so those panels fill in as traffic arrives). Every panel
 * degrades to an empty state when its data source is not yet available.
 */
export async function getAnalytics(): Promise<Analytics> {
  const db = supabaseAdmin();
  const [
    products,
    keywordRows,
    totalSearches,
    statsRes,
    waCountRes,
    dailyRes,
    deviceRes,
    countryRes,
    totalsRes,
    searchTotalsRes,
  ] = await Promise.all([
    getAdminProducts(),
    getPopularKeywords(KEYWORD_LIMIT),
    getTotalSearches(),
    db.from("product_stats").select("product_slug, views, cart_count, checkout_count"),
    db.from("events").select("*", { count: "exact", head: true }).eq("type", "wa"),
    db.rpc("event_daily", { p_days: DAILY_DAYS }),
    db.rpc("event_devices", { p_days: WINDOW_DAYS }),
    db.rpc("event_countries", { p_days: WINDOW_DAYS }),
    db.rpc("event_totals", { p_days: WINDOW_DAYS }),
    db.rpc("search_totals", { p_days: WINDOW_DAYS }),
  ]);

  const nameBySlug = new Map(products.map((p) => [p.slug, p.name]));
  const categoryBySlug = new Map(products.map((p) => [p.slug, p.categorySlug]));
  const categoryNameBySlug = new Map(CATEGORIES.map((c) => [c.slug, c.name]));

  // Per-product views from product_stats — real, accumulated data (most first).
  const byViews = ((statsRes.data as StatRow[]) ?? [])
    .map((r) => ({ slug: r.product_slug, views: Number(r.views ?? 0) }))
    .filter((r) => r.views > 0)
    .sort((a, b) => b.views - a.views);

  const totalViews = byViews.reduce((sum, r) => sum + r.views, 0);
  const topProducts = byViews.slice(0, 5).map((r) => ({
    name: nameBySlug.get(r.slug) ?? r.slug,
    views: r.views,
  }));
  const topProduct = byViews[0] ?? null;

  // Most-viewed category, aggregated across all tracked products.
  const viewsByCategory = new Map<string, number>();
  for (const r of byViews) {
    const cat = categoryBySlug.get(r.slug);
    if (!cat) continue;
    viewsByCategory.set(cat, (viewsByCategory.get(cat) ?? 0) + r.views);
  }
  let topCategory: { slug: string; views: number } | null = null;
  for (const [slug, views] of viewsByCategory) {
    if (!topCategory || views > topCategory.views) topCategory = { slug, views };
  }

  const waTotal = waCountRes.count ?? 0;

  // Time-series panels from `events` (fill in from now on).
  const daily: [number, number][] = ((dailyRes.data as DailyRow[]) ?? []).map(
    (r) => [Number(r.views), Number(r.wa_clicks)],
  );
  const devices = toDeviceStats((deviceRes.data as DeviceRow[]) ?? []);
  const countries = toCountryStats((countryRes.data as CountryRow[]) ?? []);

  // 30-day momentum deltas (real once the `events`/RPCs exist and see traffic).
  const totals = ((totalsRes.data as TotalsRow[]) ?? [])[0];
  const viewsDelta = pctDelta(
    Number(totals?.views_cur ?? 0),
    Number(totals?.views_prev ?? 0),
  );
  const waDelta = pctDelta(
    Number(totals?.wa_cur ?? 0),
    Number(totals?.wa_prev ?? 0),
  );
  const searchRow = ((searchTotalsRes.data as SearchTotalsRow[]) ?? [])[0];
  const searchDelta = pctDelta(
    Number(searchRow?.cur ?? 0),
    Number(searchRow?.prev ?? 0),
  );

  const metrics: MetricCard[] = [
    { label: "Total Views", value: formatNumber(totalViews), ...viewsDelta },
    { label: "Klik WhatsApp", value: formatNumber(waTotal), ...waDelta },
    {
      label: "Produk Populer",
      value: topProduct
        ? (nameBySlug.get(topProduct.slug) ?? topProduct.slug)
        : "—",
      delta: topProduct ? `${formatNumber(topProduct.views)} views` : "Belum ada view",
      trend: "flat",
    },
    {
      label: "Kategori Populer",
      value: topCategory
        ? (categoryNameBySlug.get(topCategory.slug) ?? topCategory.slug)
        : "—",
      delta: topCategory ? `${formatNumber(topCategory.views)} views` : "Belum ada view",
      trend: "flat",
    },
    { label: "Total Pencarian", value: formatNumber(totalSearches), ...searchDelta },
  ];

  const keywords = keywordRows.map((k) => ({ label: k.keyword, count: k.count }));

  return { metrics, daily, devices, keywords, countries, topProducts };
}
