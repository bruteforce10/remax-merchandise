import { supabaseAdmin } from "@/lib/supabase/admin";
import { getCategories } from "@/services/content/categories";
import { getAdminProducts } from "@/services/operational/products";

import type {
  AdminProduct,
  DashboardMetric,
  DashboardStats,
  ViewsPoint,
} from "@/types/admin";

/**
 * Real dashboard data. Product/category counts come from Hygraph; every
 * engagement number comes from Supabase — `events` (time-series views/WA clicks),
 * `orders` (leads), and `search_logs` — via the same RPCs the Analytics page
 * uses. Each number degrades to 0 / an empty chart when its source has no rows.
 */

const CHART_DAYS = 14;
const WINDOW_DAYS = 30;

interface DailyRow {
  day: string;
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

interface ProductStatRow {
  product_slug: string;
  views: number | string;
  wa_clicks: number | string;
}

const FLAT: DashboardMetric = { value: 0, delta: "—", trend: "flat" };

/** Percent-change delta vs. the preceding window, formatted id-ID. */
function pctMetric(cur: number, prev: number): DashboardMetric {
  if (prev <= 0) {
    return {
      value: cur,
      delta: cur > 0 ? "Baru" : "—",
      trend: cur > 0 ? "up" : "flat",
    };
  }
  const pct = ((cur - prev) / prev) * 100;
  const sign = pct >= 0 ? "+" : "−";
  return {
    value: cur,
    delta: `${sign}${Math.abs(pct).toFixed(1).replace(".", ",")}%`,
    trend: pct >= 0 ? "up" : "down",
  };
}

/** Absolute-count delta ("+18" / "−3") for day-over-day style numbers. */
function countMetric(cur: number, prev: number): DashboardMetric {
  const diff = cur - prev;
  if (diff === 0) return { value: cur, delta: "—", trend: "flat" };
  return {
    value: cur,
    delta: `${diff > 0 ? "+" : "−"}${Math.abs(diff)}`,
    trend: diff > 0 ? "up" : "down",
  };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const db = supabaseAdmin();
  const windowStart = new Date(
    Date.now() - WINDOW_DAYS * 86_400_000,
  ).toISOString();

  const [
    products,
    categories,
    dailyRes,
    totalsRes,
    searchRes,
    ordersRes,
    ordersBeforeRes,
  ] = await Promise.all([
    getAdminProducts(),
    getCategories(),
    db.rpc("event_daily", { p_days: CHART_DAYS }),
    db.rpc("event_totals", { p_days: WINDOW_DAYS }),
    db.rpc("search_totals", { p_days: WINDOW_DAYS }),
    db.from("orders").select("*", { count: "exact", head: true }),
    db
      .from("orders")
      .select("*", { count: "exact", head: true })
      .lt("created_at", windowStart),
  ]);

  const published = products.filter((p) => p.status === "published").length;

  // Daily views/WA clicks (Asia/Jakarta days) — chart + today-vs-yesterday delta.
  const daily = ((dailyRes.data as DailyRow[]) ?? []).map((r) => ({
    day: r.day,
    views: Number(r.views ?? 0),
    wa: Number(r.wa_clicks ?? 0),
  }));
  const dayFmt = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
  const chart: ViewsPoint[] = daily.map((d) => ({
    label: dayFmt.format(new Date(d.day)),
    views: d.views,
  }));
  const chartTotal = daily.reduce((sum, d) => sum + d.views, 0);

  const today = daily[daily.length - 1];
  const yesterday = daily[daily.length - 2];

  const totals = ((totalsRes.data as TotalsRow[]) ?? [])[0];
  const searchRow = ((searchRes.data as SearchTotalsRow[]) ?? [])[0];

  const totalOrders = ordersRes.count ?? 0;
  const ordersBefore = ordersBeforeRes.count ?? 0;

  return {
    totalProducts: products.length,
    totalCategories: categories.length,
    published,
    draft: products.length - published,
    // Leads = recorded orders; the delta is what came in during the last window.
    leads: countMetric(totalOrders, ordersBefore),
    waClicksToday: today ? countMetric(today.wa, yesterday?.wa ?? 0) : FLAT,
    searches: pctMetric(
      Number(searchRow?.cur ?? 0),
      Number(searchRow?.prev ?? 0),
    ),
    viewsToday: today
      ? countMetric(today.views, yesterday?.views ?? 0)
      : pctMetric(
          Number(totals?.views_cur ?? 0),
          Number(totals?.views_prev ?? 0),
        ),
    chart,
    chartTotal,
  };
}

export async function getRecentProducts(limit = 4): Promise<AdminProduct[]> {
  const products = await getAdminProducts();
  return products.slice(0, limit);
}

/**
 * Most-viewed products over the last 30 days from the `events` time-series.
 * Falls back to the Hygraph list order when no engagement is recorded yet.
 */
export async function getPopularProducts(limit = 5): Promise<AdminProduct[]> {
  const products = await getAdminProducts();
  try {
    const { data, error } = await supabaseAdmin().rpc("event_product_stats", {
      p_days: WINDOW_DAYS,
    });
    if (error) throw error;
    const rows = (data ?? []) as ProductStatRow[];
    if (rows.length === 0) return products.slice(0, limit);

    const bySlug = new Map(products.map((p) => [p.slug, p]));
    const ranked = rows.flatMap((r) => {
      const product = bySlug.get(r.product_slug);
      if (!product) return [];
      return [
        {
          ...product,
          views: Number(r.views ?? 0),
          waClicks: Number(r.wa_clicks ?? 0),
        },
      ];
    });
    return ranked.slice(0, limit);
  } catch (error) {
    console.error("getPopularProducts failed:", error);
    return products.slice(0, limit);
  }
}
