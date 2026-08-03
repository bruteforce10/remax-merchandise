"use client";

import { Clock, Search, SearchX, SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { logSearch } from "@/actions/tracking";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Filters, type FilterValue } from "@/components/search/Filters";
import { Pagination } from "@/components/search/Pagination";
import { ProductSkeletonGrid } from "@/components/search/ProductSkeletonGrid";
import { SortSelect } from "@/components/search/SortSelect";
import { Drawer } from "@/components/ui/Drawer";
import { CategoryIcon } from "@/components/ui/Icon";
import {
  filterProducts,
  paginate,
  searchSuggestions,
  sortProducts,
} from "@/lib/catalog";
import {
  CATEGORIES,
  PAGE_SIZE,
  POPULAR_SEARCHES,
  PRICE_MAX,
} from "@/lib/data/catalog";
import { generalMessage, waLink } from "@/lib/whatsapp";
import type { Product, SortOption } from "@/types/product";

const DEFAULT_FILTERS: FilterValue = {
  categories: [],
  priceMax: PRICE_MAX,
  colors: [],
};

const RECENT_KEY = "remax_recent";

export function SearchClient({
  products,
}: {
  products: Product[];
}): React.JSX.Element {
  const router = useRouter();

  const categoryCounts = React.useMemo(
    () =>
      CATEGORIES.map((c) => ({
        slug: c.slug,
        name: c.name,
        count: products.filter((p) => p.categorySlug === c.slug).length,
      })),
    [products],
  );
  const searchParams = useSearchParams();
  const committedQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = React.useState(committedQuery);
  const [focused, setFocused] = React.useState(false);
  const [filters, setFilters] = React.useState<FilterValue>(DEFAULT_FILTERS);
  const [sort, setSort] = React.useState<SortOption>("popular");
  const [page, setPage] = React.useState(1);
  const [recent, setRecent] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // Load recent searches once.
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw) as string[]);
    } catch {
      /* ignore */
    }
  }, []);

  // Sync input + reset page + brief skeleton whenever the committed query changes.
  React.useEffect(() => {
    setQuery(committedQuery);
    setPage(1);
    if (committedQuery) {
      setLoading(true);
      const t = window.setTimeout(() => setLoading(false), 350);
      void logSearch(committedQuery);
      setRecent((prev) => {
        const next = [committedQuery, ...prev.filter((x) => x !== committedQuery)].slice(0, 6);
        try {
          localStorage.setItem(RECENT_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
      return () => window.clearTimeout(t);
    }
  }, [committedQuery]);

  function submitSearch(value: string): void {
    const q = value.trim();
    setFocused(false);
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  function updateFilters(patch: Partial<FilterValue>): void {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(1);
  }

  function resetFilters(): void {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }

  const activeCount =
    filters.categories.length +
    filters.colors.length +
    (filters.priceMax < PRICE_MAX ? 1 : 0);
  const hasActiveFilters = activeCount > 0;
  const hasActiveSearch =
    committedQuery !== "" || hasActiveFilters || sort !== "popular";
  const showDiscovery = !hasActiveSearch && query.trim() === "";

  const results = React.useMemo(() => {
    const filtered = filterProducts(products, {
      query: committedQuery,
      categories: filters.categories,
      priceMax: filters.priceMax,
      colors: filters.colors,
    });
    return sortProducts(filtered, sort);
  }, [products, committedQuery, filters, sort]);

  const { items: pageCards, page: currentPage, pageCount } = paginate(
    results,
    page,
    PAGE_SIZE,
  );

  const suggestions = React.useMemo(
    () => searchSuggestions(products, query),
    [products, query],
  );
  const showSuggest = focused && query.trim().length > 0 && suggestions.length > 0;

  return (
    <div className="mx-auto max-w-[1280px] animate-[rmx-fade_.3s_ease] px-6 pt-[22px] pb-10">
      <div className="mb-4">
        <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Cari Produk" }]} />
      </div>

      {/* Search bar */}
      <div className="relative mb-[22px]">
        <div className="flex h-15 items-center gap-3 rounded-pill border border-gray-200 bg-white px-5 shadow-card focus-within:border-border-strong">
          <Search className="h-[22px] w-[22px] text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => window.setTimeout(() => setFocused(false), 120)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitSearch(query);
            }}
            placeholder="Cari polo, jaket, payung, tumbler…"
            aria-label="Cari produk"
            className="flex-1 border-none bg-transparent text-lg text-ink outline-none placeholder:text-muted"
          />
          {query.length > 0 && (
            <button
              type="button"
              aria-label="Bersihkan"
              onClick={() => setQuery("")}
              className="flex h-[34px] w-[34px] items-center justify-center rounded-pill bg-gray-100 text-gray-500"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => submitSearch(query)}
            className="h-11 rounded-pill bg-brand px-6 text-[15px] font-medium text-white hover:bg-brand-hover"
          >
            Cari
          </button>
        </div>
        {showSuggest && (
          <div className="absolute top-[66px] right-0 left-0 z-40 rounded-card border border-gray-200 bg-white p-2 shadow-menu">
            {suggestions.map((s) => (
              <button
                key={`${s.kind}-${s.href}`}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setQuery("");
                  setFocused(false);
                  router.push(s.href);
                }}
                className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left hover:bg-gray-50"
              >
                <CategoryIcon name={s.icon} className="h-[17px] w-[17px] text-gray-400" />
                <span className="text-[14.5px] text-ink">{s.label}</span>
                <span className="ml-auto text-xs text-gray-300">{s.meta}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {showDiscovery ? (
        <Discovery
          recent={recent}
          onSearch={submitSearch}
          onClearRecent={() => {
            setRecent([]);
            try {
              localStorage.removeItem(RECENT_KEY);
            } catch {
              /* ignore */
            }
          }}
        />
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-[15px] text-muted">
              <strong className="text-ink">{results.length}</strong> produk ditemukan
              {committedQuery ? ` untuk "${committedQuery}"` : ""}
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="inline-flex h-11 items-center gap-[7px] rounded-pill border border-gray-200 bg-white px-4 text-sm font-semibold lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filter
                {activeCount > 0 && (
                  <span className="ml-0.5 rounded-pill bg-brand px-1.5 text-[11px] text-white">
                    {activeCount}
                  </span>
                )}
              </button>
              <SortSelect
                value={sort}
                onChange={(v) => {
                  setSort(v);
                  setPage(1);
                }}
              />
            </div>
          </div>

          <div className="flex items-start gap-6.5">
            <aside className="sticky top-[150px] hidden w-[250px] flex-none lg:block">
              <Filters
                value={filters}
                onChange={updateFilters}
                onReset={resetFilters}
                categories={categoryCounts}
                activeCount={activeCount}
              />
            </aside>

            <div className="min-w-0 flex-1">
              {loading ? (
                <ProductSkeletonGrid />
              ) : results.length > 0 ? (
                <>
                  <ProductGrid products={pageCards} />
                  <Pagination page={currentPage} pageCount={pageCount} onPage={setPage} />
                </>
              ) : (
                <EmptyState onReset={resetFilters} />
              )}
            </div>
          </div>
        </>
      )}

      {/* Mobile filter drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        side="left"
        widthClassName="w-[min(90vw,340px)]"
        ariaLabel="Filter produk"
      >
        <div className="flex flex-col overflow-y-auto p-[22px]">
          <div className="mb-[18px] flex items-center justify-between">
            <span className="text-lg font-semibold">Filter Produk</span>
            <button
              type="button"
              aria-label="Tutup filter"
              onClick={() => setDrawerOpen(false)}
              className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border border-gray-200 bg-white"
            >
              <X className="h-[18px] w-[18px]" />
            </button>
          </div>
          <Filters
            value={filters}
            onChange={updateFilters}
            onReset={resetFilters}
            categories={categoryCounts}
            activeCount={activeCount}
          />
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="mt-6 h-[50px] w-full rounded-btn bg-brand text-[15px] font-medium text-white"
          >
            Lihat {results.length} Produk
          </button>
        </div>
      </Drawer>
    </div>
  );
}

interface DiscoveryProps {
  recent: string[];
  onSearch: (q: string) => void;
  onClearRecent: () => void;
}

function Discovery({ recent, onSearch, onClearRecent }: DiscoveryProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-card border border-gray-200 p-5">
        <div className="mb-3 text-[13px] font-bold tracking-[0.05em] text-gray-400 uppercase">
          Pencarian Populer
        </div>
        <div className="flex flex-wrap gap-2">
          {POPULAR_SEARCHES.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => onSearch(term)}
              className="h-9 rounded-pill border border-gray-200 bg-white px-3.5 text-[13.5px] font-semibold text-ink hover:border-brand hover:text-brand"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-card border border-gray-200 p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[13px] font-bold tracking-[0.05em] text-gray-400 uppercase">
            Riwayat Pencarian
          </div>
          {recent.length > 0 && (
            <button
              type="button"
              onClick={onClearRecent}
              className="text-[12.5px] font-semibold text-brand"
            >
              Hapus
            </button>
          )}
        </div>
        {recent.length > 0 ? (
          <div className="flex flex-col gap-0.5">
            {recent.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => onSearch(term)}
                className="flex items-center gap-2.5 rounded-[9px] px-2 py-2 text-left hover:bg-gray-50"
              >
                <Clock className="h-[15px] w-[15px] text-gray-300" />
                <span className="text-sm text-gray-700">{term}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="py-1.5 text-[13.5px] text-gray-300">
            Belum ada pencarian terbaru.
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }): React.JSX.Element {
  return (
    <div className="rounded-[20px] border border-dashed border-gray-200 px-5 py-[70px] text-center">
      <div className="mx-auto mb-[18px] flex h-[74px] w-[74px] items-center justify-center rounded-[20px] bg-gray-50 text-gray-300">
        <SearchX className="h-[34px] w-[34px]" />
      </div>
      <div className="mb-1.5 text-[19px] font-semibold text-ink">Produk tidak ditemukan</div>
      <div className="mx-auto mb-5 max-w-[380px] text-[14.5px] text-muted">
        Coba kata kunci lain atau atur ulang filter. Atau tanyakan langsung ke tim kami.
      </div>
      <div className="flex flex-wrap justify-center gap-2.5">
        <button
          type="button"
          onClick={onReset}
          className="h-[46px] rounded-btn border border-gray-200 bg-white px-5 text-[14.5px] font-medium hover:border-border-strong"
        >
          Reset Filter
        </button>
        <a
          href={waLink(generalMessage())}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-[46px] items-center rounded-btn bg-brand px-5 text-[14.5px] font-medium text-white"
        >
          Tanya via WhatsApp
        </a>
      </div>
    </div>
  );
}
