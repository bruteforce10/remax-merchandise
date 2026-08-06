import {
  CalendarDays,
  CheckCircle2,
  Eye,
  FilePen,
  Image as ImageIcon,
  Inbox,
  Layers,
  MessageCircle,
  Package,
  Plus,
  Search,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { StatCard, type Tone } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { CategoryIcon } from "@/components/ui/Icon";
import { CATEGORY_MAP } from "@/lib/data/catalog";
import { formatNumber, formatPrice } from "@/lib/format";
import {
  getDashboardStats,
  getPopularProducts,
  getRecentProducts,
} from "@/services/operational/dashboard";
import { getLeadFunnel } from "@/services/operational/leads";

export const metadata: Metadata = { title: "Dashboard" };

// Engagement counters change constantly — always render against live data.
export const dynamic = "force-dynamic";
export const revalidate = 0;

const PANEL = "rounded-card border border-admin-border bg-white";

const QUICK_ACTIONS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/admin/products/new", label: "Tambah Produk", icon: Plus },
  { href: "/admin/categories", label: "Tambah Kategori", icon: Layers },
  { href: "/admin/banners", label: "Upload Banner", icon: ImageIcon },
  { href: "/admin/leads", label: "Lihat Leads", icon: Inbox },
];

export default async function DashboardPage(): Promise<ReactNode> {
  const [stats, recentProducts, topFunnel, popular] = await Promise.all([
    getDashboardStats(),
    getRecentProducts(4),
    getLeadFunnel(),
    getPopularProducts(5),
  ]);
  const chart = stats.chart;
  const maxChart = Math.max(1, ...chart.map((c) => c.views));

  const statCards: {
    icon: LucideIcon;
    tone: Tone;
    value: string;
    label: string;
    delta: string;
    trend: "up" | "down" | "flat";
  }[] = [
    { icon: Package, tone: "brand", value: String(stats.totalProducts), label: "Total Produk", delta: "Total", trend: "flat" },
    { icon: Layers, tone: "info", value: String(stats.totalCategories), label: "Total Kategori", delta: "Total", trend: "flat" },
    { icon: CheckCircle2, tone: "success", value: String(stats.published), label: "Produk Published", delta: "Tayang", trend: "flat" },
    { icon: FilePen, tone: "warning", value: String(stats.draft), label: "Produk Draft", delta: "Belum tayang", trend: "flat" },
    { icon: Inbox, tone: "brand", value: formatNumber(stats.leads.value), label: "Total Leads", delta: stats.leads.delta, trend: stats.leads.trend },
    { icon: MessageCircle, tone: "success", value: formatNumber(stats.waClicksToday.value), label: "Klik WA Hari Ini", delta: stats.waClicksToday.delta, trend: stats.waClicksToday.trend },
    { icon: Search, tone: "info", value: formatNumber(stats.searches.value), label: "Pencarian (30 hari)", delta: stats.searches.delta, trend: stats.searches.trend },
    { icon: Eye, tone: "neutral", value: formatNumber(stats.viewsToday.value), label: "Dilihat Hari Ini", delta: stats.viewsToday.delta, trend: stats.viewsToday.trend },
  ];

  return (
    <div className="animate-[rmx-fade_.3s_ease]">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-semibold tracking-tight text-ink">
            Selamat datang, Admin
          </h1>
          <p className="mt-0.5 text-[15px] text-gray-500">
            Ringkasan performa katalog merchandise hari ini.
          </p>
        </div>
        <span className="inline-flex h-[38px] items-center gap-2 rounded-btn border border-admin-border bg-white px-4 text-sm font-semibold text-gray-600">
          <CalendarDays className="h-4 w-4 text-gray-400" />
          Data real-time
        </span>
      </div>

      {/* Stat cards */}
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3">
        {/* Left column */}
        <div className="flex min-w-0 flex-col gap-5 lg:col-span-2">
          {/* Views chart */}
          <div className={`${PANEL} p-5.5`}>
            <div className="mb-1.5 flex items-center justify-between">
              <h3 className="text-base font-semibold text-ink">
                Tampilan Produk (14 hari)
              </h3>
              <span className="text-[13px] text-gray-400">
                Total{" "}
                <strong className="text-ink">
                  {formatNumber(stats.chartTotal)}
                </strong>
              </span>
            </div>
            {stats.chartTotal === 0 ? (
              <p className="py-12 text-center text-[13.5px] text-gray-400">
                Belum ada tampilan produk pada 14 hari terakhir.
              </p>
            ) : (
              <div className="mt-4 flex h-[150px] items-end gap-1.5">
                {chart.map((point, i) => (
                  <div
                    key={point.label}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
                    title={`${point.label}: ${formatNumber(point.views)} tampilan`}
                  >
                    <div
                      className={`w-full max-w-[26px] rounded-t-md ${i === chart.length - 1 ? "bg-brand" : "bg-brand/35"}`}
                      style={{ height: `${(point.views / maxChart) * 100}%` }}
                    />
                    <span className="text-[10px] text-gray-300">
                      {point.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent products */}
          <div className={`${PANEL} overflow-hidden`}>
            <div className="flex items-center justify-between border-b border-gray-200 px-5.5 py-4.5">
              <h3 className="text-base font-semibold text-ink">Produk Terbaru</h3>
              <Link href="/admin/products" className="text-[13px] font-semibold">
                Lihat semua
              </Link>
            </div>
            {recentProducts.map((p) => {
              const cat = CATEGORY_MAP[p.categorySlug];
              return (
                <Link
                  key={p.sku}
                  href={`/admin/products/${p.sku}`}
                  className="flex items-center gap-3.5 border-b border-gray-50 px-5.5 py-3.5 transition-colors last:border-b-0 hover:bg-[#FAFBFC]"
                >
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-btn bg-gradient-to-br from-[#f1f2f4] to-[#e6e7ea] text-gray-400">
                    <CategoryIcon name={cat?.icon ?? "package"} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14.5px] font-semibold text-ink">{p.name}</div>
                    <div className="text-[12.5px] text-gray-400">
                      {cat?.name} · {formatPrice(p.price)}
                    </div>
                  </div>
                  <StatusBadge status={p.status} dot={false} />
                </Link>
              );
            })}
          </div>

          {/* Top funnel products */}
          <div className={`${PANEL} overflow-hidden`}>
            <div className="flex items-center justify-between border-b border-gray-200 px-5.5 py-4.5">
              <h3 className="text-base font-semibold text-ink">
                Produk Teratas (Funnel)
              </h3>
              <Link href="/admin/leads" className="text-[13px] font-semibold">
                Lihat semua
              </Link>
            </div>
            {topFunnel.length === 0 ? (
              <p className="px-5.5 py-8 text-center text-[13.5px] text-gray-400">
                Belum ada data engagement.
              </p>
            ) : (
              topFunnel.slice(0, 4).map((r) => (
                <div
                  key={r.slug}
                  className="flex items-center gap-3.5 border-b border-gray-50 px-5.5 py-3.5 last:border-b-0"
                >
                  <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-btn bg-info-subtle text-info">
                    <Eye className="h-[18px] w-[18px]" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-ink">{r.name}</div>
                    <div className="text-[12.5px] text-gray-400">
                      {formatNumber(r.views)} lihat · {formatNumber(r.checkoutCount)} checkout
                    </div>
                  </div>
                  <span className="font-mono text-[12.5px] font-semibold text-success">
                    {(r.conversion * 100).toFixed(1)}%
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Quick actions */}
          <div className={`${PANEL} p-5`}>
            <h3 className="mb-3.5 text-[15px] font-semibold text-ink">Aksi Cepat</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {QUICK_ACTIONS.map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className="flex flex-col items-start gap-2.5 rounded-card border border-admin-border p-3.5 transition-colors hover:border-[#F6C9CE] hover:bg-brand-subtle-2"
                >
                  <span className="flex h-[34px] w-[34px] items-center justify-center rounded-btn bg-brand-subtle text-brand">
                    <a.icon className="h-[17px] w-[17px]" />
                  </span>
                  <span className="text-[13px] font-semibold text-ink">{a.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Popular */}
          <div className={`${PANEL} p-5`}>
            <h3 className="mb-3.5 text-[15px] font-semibold text-ink">Paling Populer</h3>
            {popular.map((p, i) => (
              <div
                key={p.sku}
                className="flex items-center gap-3 border-b border-gray-50 py-2.5 last:border-b-0"
              >
                <span className="w-6 font-mono text-sm font-semibold text-gray-300">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13.5px] font-semibold text-ink">{p.name}</div>
                  <div className="text-[11.5px] text-gray-400">
                    {formatNumber(p.views)} views · {p.waClicks} klik WA
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
