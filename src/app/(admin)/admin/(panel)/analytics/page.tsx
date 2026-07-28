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

export const metadata: Metadata = { title: "Analitik" };

const PANEL = "rounded-card border border-admin-border bg-white p-5.5";
const METRIC_ICONS: LucideIcon[] = [Eye, MessageCircle, Flame, Layers, Search];
const DEVICE_COLORS = ["#E11D2E", "#F4B8BF", "#FBDDE1"];
const MAX_DAILY = 170;

export default async function AdminAnalyticsPage(): Promise<ReactNode> {
  const { metrics, daily, devices, keywords, countries, topProducts } =
    await getAnalytics();

  let acc = 0;
  const segments = devices.map((d, i) => {
    const seg = `${DEVICE_COLORS[i]} ${acc}% ${acc + d.pct}%`;
    acc += d.pct;
    return seg;
  });
  const donut = `conic-gradient(${segments.join(",")})`;
  const maxViews = Math.max(...topProducts.map((p) => p.views));

  return (
    <div className="animate-[rmx-fade_.3s_ease]">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Analitik</h1>
        <p className="mt-0.5 text-[14.5px] text-gray-500">
          Performa katalog 30 hari terakhir
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
              <div className="font-mono text-[26px] font-semibold text-ink">{m.value}</div>
              <div
                className={`mt-1 text-[12.5px] font-bold ${m.trend === "up" ? "text-success-fg" : "text-gray-400"}`}
              >
                {m.delta}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-5 grid grid-cols-1 items-start gap-5 lg:grid-cols-3">
        {/* Daily chart */}
        <div className={`${PANEL} lg:col-span-2`}>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-base font-semibold text-ink">Tampilan Harian</h3>
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
          <div className="mt-4 flex h-[180px] items-end gap-[5px]">
            {daily.map(([views, wa], i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <div className="flex h-full w-full flex-col justify-end gap-0.5">
                  <div
                    className="w-full rounded-t-[5px] bg-brand"
                    style={{ height: `${(views / MAX_DAILY) * 100}%` }}
                  />
                  <div
                    className="w-full rounded-b-[5px] bg-[#F8C4CA]"
                    style={{ height: `${(wa / MAX_DAILY) * 100}%` }}
                  />
                </div>
                <span className="text-[9.5px] text-gray-300">{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Device donut */}
        <div className={PANEL}>
          <h3 className="mb-[18px] text-base font-semibold text-ink">Perangkat</h3>
          <div className="mb-[18px] flex items-center justify-center">
            <div
              className="flex h-[150px] w-[150px] items-center justify-center rounded-full"
              style={{ background: donut }}
            >
              <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white">
                <span className="font-mono text-[22px] font-semibold text-ink">100%</span>
                <span className="text-[11px] text-gray-400">Sesi</span>
              </div>
            </div>
          </div>
          {devices.map((d, i) => (
            <div key={d.label} className="flex items-center gap-2.5 py-[7px]">
              <span
                className="h-2.5 w-2.5 rounded-sm"
                style={{ background: DEVICE_COLORS[i] }}
              />
              <span className="flex-1 text-[13.5px] font-semibold text-ink">{d.label}</span>
              <span className="font-mono text-[13.5px] font-bold text-gray-600">{d.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Top products */}
        <div className={PANEL}>
          <h3 className="mb-4 text-[15px] font-semibold text-ink">Produk Terpopuler</h3>
          {topProducts.map((p) => (
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
          ))}
        </div>

        {/* Keywords + countries */}
        <div className={PANEL}>
          <h3 className="mb-4 text-[15px] font-semibold text-ink">Kata Kunci Populer</h3>
          <div className="flex flex-wrap gap-2.5">
            {keywords.map((k) => (
              <span
                key={k.label}
                className="inline-flex items-center gap-1.5 rounded-pill bg-gray-50 px-3.5 py-1.5 text-[13px] font-semibold text-gray-700"
              >
                {k.label}
                <span className="font-mono text-[11px] text-gray-400">{k.count}</span>
              </span>
            ))}
          </div>
          <h3 className="mt-5.5 mb-3.5 text-[15px] font-semibold text-ink">Negara Teratas</h3>
          {countries.map((c) => (
            <div
              key={c.name}
              className="flex items-center justify-between border-b border-gray-50 py-[7px] last:border-b-0"
            >
              <span className="text-[13.5px] font-semibold text-ink">{c.name}</span>
              <span className="font-mono text-[13px] text-gray-400">{c.pct}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
