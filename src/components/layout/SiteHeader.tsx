"use client";

import {
  BadgeCheck,
  ChevronDown,
  Clock,
  LayoutGrid,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { CategoryIcon } from "@/components/ui/Icon";
import { Drawer } from "@/components/ui/Drawer";
import { useCart } from "@/providers/CartProvider";
import { COMPANY } from "@/lib/constants";
import { searchSuggestions } from "@/lib/catalog";
import type { Category } from "@/types/category";

interface SiteHeaderProps {
  categories: Category[];
}

export function SiteHeader({ categories }: SiteHeaderProps): React.JSX.Element {
  const router = useRouter();
  const { count, hydrated } = useCart();

  const [query, setQuery] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const [catMenuOpen, setCatMenuOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const catMenuRef = React.useRef<HTMLDivElement>(null);

  const suggestions = React.useMemo(() => searchSuggestions(query), [query]);
  const showSuggest = focused && query.trim().length > 0 && suggestions.length > 0;

  React.useEffect(() => {
    if (!catMenuOpen) return;
    const onDown = (e: MouseEvent): void => {
      if (catMenuRef.current && !catMenuRef.current.contains(e.target as Node)) {
        setCatMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [catMenuOpen]);

  function submitSearch(value: string): void {
    const q = value.trim();
    setMobileOpen(false);
    setFocused(false);
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  function goSuggestion(href: string): void {
    setQuery("");
    setFocused(false);
    setMobileOpen(false);
    router.push(href);
  }

  const cartBadge = hydrated && count > 0;

  return (
    <>
      {/* Top info bar */}
      <div className="bg-gray-900 text-[12.5px] text-gray-300">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-6 py-2">
          <span className="inline-flex items-center gap-[7px]">
            <BadgeCheck className="h-[15px] w-[15px] text-brand" />
            Merchandise resmi &amp; custom untuk jaringan RE/MAX Indonesia
          </span>
          <span className="hidden items-center gap-4 sm:inline-flex">
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              {COMPANY.phoneDisplay}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {COMPANY.hoursShort}
            </span>
          </span>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-[10px] backdrop-saturate-150">
        <div className="mx-auto flex max-w-[1280px] items-center gap-5 px-6 py-3.5">
          <Link href="/" className="flex flex-none items-center gap-2.5">
            <Image
              src="/assets/logo-full.png"
              alt="RE/MAX"
              width={866}
              height={238}
              priority
              className="h-[26px] w-auto"
            />
            <span className="hidden border-l border-gray-200 pl-2.5 text-[13px] font-semibold tracking-[0.02em] text-gray-400 sm:inline">
              Merchandise
            </span>
          </Link>

          {/* Desktop: categories + search */}
          <div className="hidden flex-1 items-center gap-[18px] lg:flex">
            <div className="relative" ref={catMenuRef}>
              <button
                type="button"
                onClick={() => setCatMenuOpen((v) => !v)}
                className="inline-flex h-11 items-center gap-1.5 rounded-btn border border-gray-200 bg-white px-3.5 text-[14.5px] font-semibold text-ink hover:bg-gray-50"
              >
                <LayoutGrid className="h-[17px] w-[17px]" />
                Kategori
                <ChevronDown className="h-[15px] w-[15px] text-gray-400" />
              </button>
              {catMenuOpen && (
                <div className="absolute top-13 left-0 z-[60] grid w-[520px] grid-cols-2 gap-0.5 rounded-card border border-gray-100 bg-white p-3 shadow-menu">
                  {categories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/categories/${c.slug}`}
                      onClick={() => setCatMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 hover:bg-gray-50"
                    >
                      <span className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[9px] bg-brand-subtle text-brand">
                        <CategoryIcon name={c.icon} className="h-[17px] w-[17px]" />
                      </span>
                      <span className="text-sm font-semibold text-ink">{c.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="relative flex-1">
              <div className="flex h-11 items-center gap-2.5 rounded-btn border border-gray-200 bg-gray-50 px-3.5 transition-colors focus-within:border-brand focus-within:bg-white">
                <Search className="h-[18px] w-[18px] text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => window.setTimeout(() => setFocused(false), 120)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitSearch(query);
                  }}
                  placeholder="Cari produk merchandise…"
                  className="flex-1 border-none bg-transparent text-[14.5px] text-ink outline-none placeholder:text-gray-400"
                  aria-label="Cari produk"
                />
              </div>
              {showSuggest && (
                <SuggestionList suggestions={suggestions} onSelect={goSuggestion} />
              )}
            </div>
          </div>

          <Link
            href="/contact"
            className="hidden flex-none text-[14.5px] font-semibold text-ink hover:text-brand lg:inline"
          >
            Kontak
          </Link>

          <div className="flex-1" />

          <Link
            href="/cart"
            aria-label="Keranjang penawaran"
            className="relative inline-flex h-11 w-11 flex-none items-center justify-center rounded-btn border border-gray-200 bg-white text-ink hover:bg-gray-50"
          >
            <ShoppingCart className="h-[19px] w-[19px]" />
            {cartBadge && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-pill bg-brand px-1.5 font-mono text-[11.5px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          <button
            type="button"
            aria-label="Buka menu"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-btn border border-gray-200 bg-white text-ink hover:bg-gray-50 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile menu drawer */}
      <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} ariaLabel="Menu">
        <div className="flex flex-col overflow-y-auto p-5">
          <div className="mb-4 flex items-center justify-between">
            <Image
              src="/assets/logo-full.png"
              alt="RE/MAX"
              width={866}
              height={238}
              className="h-6 w-auto"
            />
            <button
              type="button"
              aria-label="Tutup menu"
              onClick={() => setMobileOpen(false)}
              className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border border-gray-200 bg-white"
            >
              <X className="h-[18px] w-[18px]" />
            </button>
          </div>

          <div className="mb-[18px] flex h-[46px] items-center gap-2.5 rounded-btn border border-gray-200 bg-gray-50 px-3.5">
            <Search className="h-[18px] w-[18px] text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitSearch(query);
              }}
              placeholder="Cari produk…"
              className="flex-1 border-none bg-transparent text-[15px] outline-none placeholder:text-gray-400"
              aria-label="Cari produk"
            />
          </div>

          <div className="mb-2 text-xs font-bold tracking-[0.06em] text-gray-400 uppercase">
            Menu
          </div>
          {[
            { label: "Beranda", href: "/" },
            { label: "Cari Produk", href: "/search" },
            { label: "Kontak", href: "/contact" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="border-b border-gray-100 py-3 text-base font-semibold text-ink"
            >
              {l.label}
            </Link>
          ))}

          <div className="mt-[18px] mb-2 text-xs font-bold tracking-[0.06em] text-gray-400 uppercase">
            Kategori
          </div>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 rounded-[10px] border border-gray-100 p-2.5"
              >
                <CategoryIcon name={c.icon} className="h-4 w-4 text-brand" />
                <span className="text-[13px] font-semibold">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </Drawer>
    </>
  );
}

interface SuggestionListProps {
  suggestions: ReturnType<typeof searchSuggestions>;
  onSelect: (href: string) => void;
}

function SuggestionList({ suggestions, onSelect }: SuggestionListProps): React.JSX.Element {
  return (
    <div className="absolute top-[52px] right-0 left-0 z-40 rounded-[14px] border border-gray-100 bg-white p-2 shadow-menu">
      {suggestions.map((s) => (
        <button
          key={`${s.kind}-${s.href}`}
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(s.href);
          }}
          className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left hover:bg-gray-50"
        >
          <CategoryIcon name={s.icon} className="h-[17px] w-[17px] text-gray-400" />
          <span className="text-[14.5px] text-ink">{s.label}</span>
          <span className="ml-auto text-xs text-gray-300">{s.meta}</span>
        </button>
      ))}
    </div>
  );
}
