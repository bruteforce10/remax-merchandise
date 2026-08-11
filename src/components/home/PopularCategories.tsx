import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";

import { CategoryVisual } from "@/components/category/CategoryVisual";

export interface PopularCategoryItem {
  slug: string;
  name: string;
  icon: string;
  count: number;
}

export function PopularCategories({
  items,
}: {
  items: PopularCategoryItem[];
}): ReactElement {
  return (
    <section className="mx-auto max-w-[1280px] px-6 pt-9 pb-2">
      <div className="mb-[18px] flex items-baseline justify-between gap-3">
        <h2 className="text-[22px] font-semibold tracking-tight text-ink">
          Kategori Populer
        </h2>
        <Link
          href="/categories"
          className="inline-flex items-center gap-1.5 text-sm font-semibold"
        >
          Semua kategori
          <ArrowRight className="h-[15px] w-[15px]" />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <Link
            key={c.slug}
            href={`/categories/${c.slug}`}
            className="group flex items-center gap-3.5 rounded-card border border-gray-200 bg-white px-4 py-3 transition-[box-shadow,border-color] duration-200 ease-out-quart hover:border-border-strong hover:shadow-card"
          >
            <CategoryVisual
              slug={c.slug}
              name={c.name}
              icon={c.icon}
              sizes="48px"
              iconClassName="h-5 w-5"
              wrapClassName="flex-none rounded-card text-brand transition-transform duration-200 ease-out-quart group-hover:scale-[1.06]"
              imageWrapClassName="h-12 w-12"
              iconWrapClassName="h-10 w-10 bg-brand-subtle"
            />
            <div className="min-w-0">
              <div className="truncate text-[15.5px] font-semibold text-ink">
                {c.name}
              </div>
              <div className="mt-0.5 text-[12.5px] text-muted">
                {c.count} produk
              </div>
            </div>
            <ArrowRight className="ml-auto h-4 w-4 flex-none text-gray-300 transition-[color,transform] duration-200 ease-out-quart group-hover:translate-x-0.5 group-hover:text-brand" />
          </Link>
        ))}
      </div>
    </section>
  );
}
