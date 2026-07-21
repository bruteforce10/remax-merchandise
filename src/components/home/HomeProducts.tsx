"use client";

import * as React from "react";

import { ProductGrid } from "@/components/product/ProductGrid";
import { productInTab, sortProducts } from "@/lib/catalog";
import { HOME_TABS } from "@/lib/data/catalog";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

export function HomeProducts({ products }: { products: Product[] }): React.JSX.Element {
  const [tab, setTab] = React.useState("all");

  const cards = React.useMemo(
    () => sortProducts(products.filter((p) => productInTab(p, tab)), "popular").slice(0, 8),
    [products, tab],
  );

  return (
    <section className="mx-auto max-w-[1280px] px-6 pt-8 pb-2">
      <h2 className="text-2xl font-extrabold tracking-tight text-ink">
        Produk Merchandise
      </h2>
      <p className="mt-1.5 mb-[18px] text-[15px] text-gray-500">
        Pilihan lengkap untuk seragam, event, dan corporate gift.
      </p>

      <div className="rmx-scrollbar mb-1.5 flex gap-2.5 overflow-x-auto pb-3.5">
        {HOME_TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                "h-10 flex-none rounded-pill border px-[18px] text-sm font-semibold transition-colors",
                active
                  ? "border-brand bg-brand text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300",
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <ProductGrid products={cards} />
    </section>
  );
}
