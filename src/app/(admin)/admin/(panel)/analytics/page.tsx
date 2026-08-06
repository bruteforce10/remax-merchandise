import {
  Eye,
  Flame,
  Layers,
  MessageCircle,
  Search,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { formatNumber } from "@/lib/format";
import { getAnalytics } from "@/services/operational/analytics";
import type { MetricCard } from "@/types/admin";

export const metadata: Metadata = { title: "Analitik" };

const PANEL = "rounded-card border border-admin-border bg-white p-5.5";
const METRIC_ICONS: LucideIcon[] = [Eye, MessageCircle, Flame, Layers, Search];
const EMPTY = "py-8 text-center text-[13.5px] text-gray-400";

/** Absolute id-ID date for the keyword "last searched" column (Jakarta time). */
const DATE_FMT = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

function trendClass(trend: MetricCard["trend"]): string {
  if (trend === "up") return "text-success-fg";
  if (trend === "down") return "text-brand";
  return "text-gray-400";
}

export default async function AdminAnalyticsPage(): Promise<ReactNode> {
  const { metrics, weekly, keywords, topProducts } = await getAnalytics();

  // Scale bars to the busiest week so real (often small) data stays visible.
  const maxWeekly = Math.max(1, ...weekly.flatMap((p) => [p.views, p.wa]));
  const hasWeekly = weekly.some((p) => p.views + p.wa > 0);
  const maxViews = Math.max(1, ...topProducts.map((p) => p.views));

  return (
    <div className="animate-[rmx-fade_.3s_ease]">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Analitik</h1>
        <p className="mt-0.5 text-[14.5px] text-gray-500">
          Ringkasan performa katalog · tren 12 minggu terakhir
        </p>
      </div>

      {/* Metric cards */}
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {metrics.map((m, i) => {
          const Icon = METRIC_ICONS[i] ?? Eye;
          return (
            <div key={m.label} className="rounded-card border border-admin-border bg-white p-5">
              <div className="mb-2.5 flex items-center gap-2 text-gray-400">
                <Icon className="h-[17px] w-[17px]" />
                <span className="text-[13px] font-semibold">{m.label}</span>
              </div>
              <div className="truncate font-mono text-[26px] font-semibold text-ink">
                {m.value}
              </div>
              <div className={`mt-1 text-[12.5px] font-bold ${trendClass(m.trend)}`}>
                {m.delta}
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly trend chart */}
      <div className={`${PANEL} mb-5`}>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-base font-semibold text-ink">Tampilan Mingguan</h3>
          <div className="flex gap-3.5 text-[12.5px]">
            <span className="inline-flex items-center gap-1.5 text-gray-500">
              <span className="h-2.5 w-2.5 rounded-sm bg-brand" />
              Views
            </span>
            <span className="inline-flex items-center gap-1.5 text-gray-500">
              <span className="h-2.5 w-2.5 rounded-sm bg-[#F8C4CA]" />
              Klik WA
            </span>
          </div>
        </div>
        <div className="relative mt-4 flex h-[200px] items-end gap-[7px]">
          {weekly.map((p, i) => (
            <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
              <div className="flex h-full w-full flex-col justify-end gap-0.5">
                <div
                  className="w-full rounded-t-[5px] bg-brand"
                  style={{ height: `${(p.views / maxWeekly) * 100}%` }}
                />
                <div
                  className="w-full rounded-b-[5px] bg-[#F8C4CA]"
                  style={{ height: `${(p.wa / maxWeekly) * 100}%` }}
                />
              </div>
              <span className="whitespace-nowrap text-[9.5px] text-gray-400">{p.label}</span>
            </div>
          ))}
          {!hasWeekly && (
            <div className="absolute inset-0 flex items-center justify-center text-[13.5px] text-gray-400">
              Belum ada aktivitas pada rentang ini
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Top products */}
        <div className={PANEL}>
          <h3 className="mb-4 text-[15px] font-semibold text-ink">Produk Terpopuler</h3>
          {topProducts.length > 0 ? (
            topProducts.map((p) => (
              <div key={p.name} className="mb-3.5 last:mb-0">
                <div className="mb-1.5 flex justify-between text-[13px]">
                  <span className="font-semibold text-ink">{p.name}</span>
                  <span className="font-mono text-gray-400">{formatNumber(p.views)}</span>
                </div>
                <div className="h-[7px] overflow-hidden rounded-pill bg-gray-100">
                  <div
                    className="h-full rounded-pill bg-brand"
                    style={{ width: `${(p.views / maxViews) * 100}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className={EMPTY}>Belum ada view produk pada rentang ini</div>
          )}
        </div>

        {/* Popular keywords detail table */}
        <div className={`${PANEL} lg:col-span-2`}>
          <h3 className="mb-4 text-[15px] font-semibold text-ink">Kata Kunci Populer</h3>
          {keywords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13.5px]">
                <thead>
                  <tr className="border-b border-gray-100 text-[12px] font-semibold text-gray-400">
                    <th className="py-2 pr-3 font-semibold">#</th>
                    <th className="py-2 pr-3 font-semibold">Kata Kunci</th>
                    <th className="py-2 pr-3 text-right font-semibold">Minggu Ini</th>
                    <th className="py-2 pr-3 text-right font-semibold">Total</th>
                    <th className="py-2 text-right font-semibold">Terakhir Dicari</th>
                  </tr>
                </thead>
                <tbody>
                  {keywords.map((k, i) => (
                    <tr key={k.label} className="border-b border-gray-50 last:border-b-0">
                      <td className="py-2.5 pr-3 font-mono text-gray-400">{i + 1}</td>
                      <td className="py-2.5 pr-3 font-semibold text-ink">{k.label}</td>
                      <td className="py-2.5 pr-3 text-right font-mono text-gray-600">
                        {formatNumber(k.weekCount)}
                      </td>
                      <td className="py-2.5 pr-3 text-right font-mono text-gray-600">
                        {formatNumber(k.count)}
                      </td>
                      <td className="py-2.5 text-right font-mono text-gray-400">
                        {k.lastSearched ? DATE_FMT.format(new Date(k.lastSearched)) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={EMPTY}>Belum ada pencarian tercatat</div>
          )}
        </div>
      </div>
    </div>
  );
}
