"use client";

import {
  BarChart3,
  Bell,
  ChevronRight,
  GalleryHorizontalEnd,
  Inbox,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Plus,
  Search,
  Settings,
  User,
  X,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

import { Drawer } from "@/components/ui/Drawer";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

const BOTTOM_NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/admin/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produk", icon: Package },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/analytics", label: "Analitik", icon: BarChart3 },
  { href: "/admin/profile", label: "Profil", icon: User },
];

function pageTitle(pathname: string, nav: NavItem[]): string {
  if (pathname.startsWith("/admin/products/")) return "Editor Produk";
  if (pathname.startsWith("/admin/profile")) return "Profil";
  const item = nav.find((n) => pathname.startsWith(n.href));
  return item?.label ?? "Dashboard";
}

export function AdminShell({
  children,
  newLeadsCount,
  userEmail = "",
}: {
  children: React.ReactNode;
  newLeadsCount: number;
  userEmail?: string;
}): React.JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const initials = (userEmail.split("@")[0] || "AD").slice(0, 2).toUpperCase();

  async function handleSignOut(): Promise<void> {
    await createClient().auth.signOut();
    router.push("/admin");
    router.refresh();
  }

  const nav: NavItem[] = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Produk", icon: Package },
    { href: "/admin/categories", label: "Kategori", icon: Layers },
    { href: "/admin/banners", label: "Banner", icon: GalleryHorizontalEnd },
    { href: "/admin/leads", label: "Leads", icon: Inbox, badge: newLeadsCount },
    { href: "/admin/analytics", label: "Analitik", icon: BarChart3 },
    { href: "/admin/settings", label: "Pengaturan", icon: Settings },
  ];

  const isActive = (href: string): boolean =>
    pathname === href || pathname.startsWith(`${href}/`);
  const title = pageTitle(pathname, nav);

  const sidebarBody = (
    onNavigate?: () => void,
    showLogo = true,
  ): React.JSX.Element => (
    <>
      {showLogo && (
        <div className="flex items-center gap-2.5 border-b border-gray-100 px-5 pt-5 pb-[18px]">
          <Image
            src="/assets/logo-mark.png"
            alt="RE/MAX"
            width={182}
            height={207}
            className="h-[30px] w-auto"
          />
          <div>
            <div className="text-[15px] font-extrabold tracking-tight text-ink">
              RE/MAX <span className="text-brand">Admin</span>
            </div>
            <div className="text-[11px] font-semibold text-gray-400">
              Merchandise CMS
            </div>
          </div>
        </div>
      )}
      <nav className="rmx-scrollbar flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
        {nav.map((n) => {
          const active = isActive(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-[11px] px-3 py-2.5 text-[14.5px] font-semibold transition-colors",
                active
                  ? "bg-brand-subtle text-brand"
                  : "text-gray-600 hover:bg-gray-50",
              )}
            >
              <n.icon className="h-[18px] w-[18px]" />
              <span className="flex-1">{n.label}</span>
              {n.badge ? (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-pill bg-brand-subtle px-1.5 font-mono text-[11px] font-bold text-brand">
                  {n.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
        <div className="my-2.5 h-px bg-gray-100" />
        <Link
          href="/admin/profile"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-[11px] px-3 py-2.5 text-[14.5px] font-semibold transition-colors",
            isActive("/admin/profile")
              ? "bg-brand-subtle text-brand"
              : "text-gray-600 hover:bg-gray-50",
          )}
        >
          <User className="h-[18px] w-[18px]" />
          Profil
        </Link>
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            void handleSignOut();
          }}
          className="flex items-center gap-3 rounded-[11px] px-3 py-2.5 text-left text-[14.5px] font-semibold text-danger transition-colors hover:bg-brand-subtle"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Keluar
        </button>
      </nav>
      <div className="border-t border-gray-100 p-3.5">
        <Link
          href="/admin/profile"
          onClick={onNavigate}
          className="flex items-center gap-2.5 rounded-[12px] p-2 transition-colors hover:bg-gray-50"
        >
          <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-sm font-bold text-white">
            {initials}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13.5px] font-bold text-ink">
              Admin REMAX
            </span>
            <span className="block truncate text-[11.5px] text-gray-400">
              {userEmail || "admin@remax.co.id"}
            </span>
          </span>
          <ChevronRight className="h-4 w-4 text-gray-300" />
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-admin-bg">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 flex-none flex-col border-r border-admin-border bg-white lg:flex">
        {sidebarBody()}
      </aside>

      {/* Mobile drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        side="left"
        widthClassName="w-[264px]"
        ariaLabel="Menu admin"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <Image
              src="/assets/logo-mark.png"
              alt="RE/MAX"
              width={182}
              height={207}
              className="h-7 w-auto"
            />
            <span className="text-[15px] font-extrabold">
              RE/MAX <span className="text-brand">Admin</span>
            </span>
          </div>
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={() => setDrawerOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-gray-100 bg-white"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          {sidebarBody(() => setDrawerOpen(false), false)}
        </div>
      </Drawer>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-admin-border bg-white/90 px-6 py-3 backdrop-blur-[10px]">
          <button
            type="button"
            aria-label="Buka menu"
            onClick={() => setDrawerOpen(true)}
            className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-[11px] border border-admin-border bg-white lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-[12.5px] text-gray-400">
              <span>CMS</span>
              <ChevronRight className="h-[13px] w-[13px]" />
              <span className="font-semibold text-ink">{title}</span>
            </div>
          </div>
          <Link
            href="/admin/products"
            className="hidden h-[42px] w-[280px] items-center gap-2.5 rounded-[11px] border border-admin-border bg-admin-bg px-3.5 text-sm text-gray-400 transition-colors hover:border-gray-300 lg:flex"
          >
            <Search className="h-[17px] w-[17px]" />
            <span className="flex-1 text-left">Cari produk…</span>
            <span className="rounded-md border border-gray-200 px-1.5 py-0.5 font-mono text-[11px] text-gray-300">
              ⌘K
            </span>
          </Link>
          <Link
            href="/admin/products/new"
            className="inline-flex h-[42px] flex-none items-center gap-2 rounded-[11px] bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            <Plus className="h-[17px] w-[17px]" />
            <span className="hidden sm:inline">Produk Baru</span>
          </Link>
        </header>

        <main className="rmx-scrollbar flex-1">
          <div className="mx-auto max-w-[1600px] px-5 pt-7 pb-24 sm:px-6 lg:pb-12">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed right-0 bottom-0 left-0 z-30 flex border-t border-admin-border bg-white px-1 py-1.5 lg:hidden">
        {BOTTOM_NAV.map((n) => {
          const active = isActive(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-1.5 text-[10.5px] font-semibold transition-colors",
                active ? "text-brand" : "text-gray-400",
              )}
            >
              <n.icon className="h-[21px] w-[21px]" />
              {n.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
