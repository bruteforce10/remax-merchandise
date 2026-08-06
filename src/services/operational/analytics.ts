import { CATEGORIES } from "@/lib/data/catalog";
import { formatNumber } from "@/lib/format";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAdminProducts } from "@/services/operational/products";
import { getPopularKeywords, getTotalSearches } from "@/services/operational/search";
import type { Analytics, MetricCard } from "@/types/admin";

/** Rolling windows: momentum deltas over 30 days, the trend chart over 12 weeks. */
const WINDOW_DAYS = 30;
const WEEKLY_WEEKS = 12;
const KEYWORD_LIMIT = 12;

/** Per-product cumulative funnel (same source as the Leads page). */
interface StatRow {
  product_slug: string;
  views: number | string;
  cart_count: number | string;
  checkout_count: number | string;
}
interface WeeklyRow {
  week_start: string;
  views: number | string;
  wa_clicks: number | string;
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

/**
 * Real analytics for the admin dashboard. Totals, top products, and popular
 * category come from `product_stats` (the accumulated funnel data the Leads
 * page also uses) plus `search_logs` — so they are populated immediately. The
 * weekly trend and WhatsApp-click totals come from the `events` time-series
 * (recorded from now on; no historical backfill is possible, so the chart fills
 * in as traffic arrives). Every panel degrades to an empty state when its data
 * source is not yet available.
 */
export async function getAnalytics(): Promise<Analytics> {
  const db = supabaseAdmin();
  const [
    products,
    keywordRows,
    totalSearches,
    statsRes,
    waCountRes,
    weeklyRes,
    totalsRes,
    searchTotalsRes,
  ] = await Promise.all([
    getAdminProducts(),
    getPopularKeywords(KEYWORD_LIMIT),
    getTotalSearches(),
    db.from("product_stats").select("product_slug, views, cart_count, checkout_count"),
    db.from("events").select("*", { count: "exact", head: true }).eq("type", "wa"),
    db.rpc("event_weekly", { p_weeks: WEEKLY_WEEKS }),
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

  // Weekly trend from `events` (fills in from now on). Label each bar by its
  // week-start date, formatted in UTC so the day shown matches week_start.
  const weekFmt = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
  const weekly = ((weeklyRes.data as WeeklyRow[]) ?? []).map((r) => ({
    label: weekFmt.format(new Date(r.week_start)),
    views: Number(r.views),
    wa: Number(r.wa_clicks),
  }));

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

  const keywords = keywordRows.map((k) => ({
    label: k.keyword,
    count: k.count,
    weekCount: k.weekCount,
    lastSearched: k.lastSearched,
  }));

  return { metrics, weekly, keywords, topProducts };
}
