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
  TriangleAlert,
  Upload,
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
  getRecentLeads,
  getRecentProducts,
  getViewsChart,
} from "@/services/operational/dashboard";

export const metadata: Metadata = { title: "Dashboard" };

const PANEL = "rounded-card border border-admin-border bg-white";

const QUICK_ACTIONS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/admin/products/new", label: "Tambah Produk", icon: Plus },
  { href: "/admin/categories", label: "Tambah Kategori", icon: Layers },
  { href: "/admin/banners", label: "Upload Banner", icon: ImageIcon },
  { href: "/admin/media", label: "Upload Media", icon: Upload },
];

export default async function DashboardPage(): Promise<ReactNode> {
  const [stats, recentProducts, recentLeads, popular, chart] = await Promise.all(
    [
      getDashboardStats(),
      getRecentProducts(4),
      getRecentLeads(4),
      getPopularProducts(5),
      getViewsChart(),
    ],
  );
  const maxChart = Math.max(...chart);

  const statCards: {
    icon: LucideIcon;
    tone: Tone;
    value: string;
    label: string;
    delta: string;
    trend: "up" | "down";
  }[] = [
    { icon: Package, tone: "brand", value: String(stats.totalProducts), label: "Total Produk", delta: "+3", trend: "up" },
    { icon: Layers, tone: "info", value: String(stats.totalCategories), label: "Total Kategori", delta: "+1", trend: "up" },
    { icon: CheckCircle2, tone: "success", value: String(stats.published), label: "Produk Published", delta: "+2", trend: "up" },
    { icon: FilePen, tone: "warning", value: String(stats.draft), label: "Produk Draft", delta: "-1", trend: "down" },
    { icon: Inbox, tone: "brand", value: formatNumber(stats.totalLeads), label: "Total Leads", delta: "+18", trend: "up" },
    { icon: MessageCircle, tone: "success", value: String(stats.waClicksToday), label: "Klik WA Hari Ini", delta: "+12", trend: "up" },
    { icon: Search, tone: "info", value: formatNumber(stats.searches), label: "Pencarian", delta: "+9%", trend: "up" },
    { icon: Eye, tone: "neutral", value: formatNumber(stats.viewsToday), label: "Dilihat Hari Ini", delta: "+7%", trend: "up" },
  ];

  return (
    <div className="animate-[rmx-fade_.3s_ease]">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-tight text-ink">
            Selamat datang, Admin
          </h1>
          <p className="mt-0.5 text-[15px] text-gray-500">
            Ringkasan performa katalog merchandise hari ini.
          </p>
        </div>
        <span className="inline-flex h-[38px] items-center gap-2 rounded-btn border border-admin-border bg-white px-4 text-sm font-semibold text-gray-600">
          <CalendarDays className="h-4 w-4 text-gray-400" />7 hari terakhir
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
              <h3 className="text-base font-extrabold text-ink">
                Tampilan Produk (14 hari)
              </h3>
              <span className="text-[13px] text-gray-400">
                Total <strong className="text-ink">18.240</strong>
              </span>
            </div>
            <div className="mt-4 flex h-[150px] items-end gap-1.5">
              {chart.map((v, i) => (
                <div
                  key={i}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
                >
                  <div
                    className={`w-full max-w-[26px] rounded-t-md ${i === chart.length - 1 ? "bg-brand" : "bg-brand/35"}`}
                    style={{ height: `${(v / maxChart) * 100}%` }}
                  />
                  <span className="text-[10px] text-gray-300">{i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent products */}
          <div className={`${PANEL} overflow-hidden`}>
            <div className="flex items-center justify-between border-b border-gray-100 px-5.5 py-4.5">
              <h3 className="text-base font-extrabold text-ink">Produk Terbaru</h3>
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
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-[10px] bg-gradient-to-br from-[#f1f2f4] to-[#e6e7ea] text-gray-400">
                    <CategoryIcon name={cat?.icon ?? "package"} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14.5px] font-bold text-ink">{p.name}</div>
                    <div className="text-[12.5px] text-gray-400">
                      {cat?.name} · {formatPrice(p.price)}
                    </div>
                  </div>
                  <StatusBadge status={p.status} dot={false} />
                </Link>
              );
            })}
          </div>

          {/* Recent leads */}
          <div className={`${PANEL} overflow-hidden`}>
            <div className="flex items-center justify-between border-b border-gray-100 px-5.5 py-4.5">
              <h3 className="text-base font-extrabold text-ink">Leads Terbaru</h3>
              <Link href="/admin/leads" className="text-[13px] font-semibold">
                Lihat semua
              </Link>
            </div>
            {recentLeads.map((l) => (
              <div
                key={l.id}
                className="flex items-center gap-3.5 border-b border-gray-50 px-5.5 py-3.5 last:border-b-0"
              >
                <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[10px] bg-success-subtle text-success">
                  <MessageCircle className="h-[18px] w-[18px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-ink">{l.product}</div>
                  <div className="text-[12.5px] text-gray-400">
                    {l.qty} pcs · {l.device} · {l.date}
                  </div>
                </div>
                <StatusBadge status={l.status} dot={false} />
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Quick actions */}
          <div className={`${PANEL} p-5`}>
            <h3 className="mb-3.5 text-[15px] font-extrabold text-ink">Aksi Cepat</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {QUICK_ACTIONS.map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className="flex flex-col items-start gap-2.5 rounded-[13px] border border-admin-border p-3.5 transition-colors hover:border-[#F6C9CE] hover:bg-brand-subtle-2"
                >
                  <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-brand-subtle text-brand">
                    <a.icon className="h-[17px] w-[17px]" />
                  </span>
                  <span className="text-[13px] font-bold text-ink">{a.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Popular */}
          <div className={`${PANEL} p-5`}>
            <h3 className="mb-3.5 text-[15px] font-extrabold text-ink">Paling Populer</h3>
            {popular.map((p, i) => (
              <div
                key={p.sku}
                className="flex items-center gap-3 border-b border-gray-50 py-2.5 last:border-b-0"
              >
                <span className="w-6 font-mono text-sm font-extrabold text-gray-300">
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

          {/* Image quality alert */}
          <div className="rounded-card border border-[#F8D2D7] bg-brand-subtle-2 p-5">
            <div className="mb-2.5 flex items-center gap-2.5">
              <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-brand-subtle text-brand">
                <TriangleAlert className="h-[18px] w-[18px]" />
              </span>
              <h3 className="text-[15px] font-extrabold text-ink">
                Peringatan Kualitas Gambar
              </h3>
            </div>
            <p className="mb-3 text-[13px] leading-relaxed text-[#8A5560]">
              <strong>4 produk</strong> memiliki gambar beresolusi rendah. Perbarui
              untuk tampilan katalog yang lebih premium.
            </p>
            <Link
              href="/admin/media"
              className="inline-flex h-[38px] items-center rounded-[10px] bg-brand px-3.5 text-[13px] font-semibold text-white hover:bg-brand-hover"
            >
              Perbaiki Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
