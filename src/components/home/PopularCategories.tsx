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
      <div className="rmx-scrollbar flex gap-4 overflow-x-auto pb-2 [scroll-snap-type:x_mandatory]">
        {items.map((c) => (
          <Link
            key={c.slug}
            href={`/categories/${c.slug}`}
            className="flex w-[172px] flex-none flex-col gap-3.5 rounded-card border border-gray-200 bg-white px-[18px] py-[22px] transition-[box-shadow,transform,border-color] duration-200 [scroll-snap-align:start] hover:-translate-y-[3px] hover:border-[#F6C9CE] hover:shadow-hover"
          >
            <CategoryVisual
              slug={c.slug}
              name={c.name}
              icon={c.icon}
              sizes="72px"
              iconClassName="h-6 w-6"
              wrapClassName="rounded-card text-brand"
              imageWrapClassName="h-[72px] w-[72px]"
              iconWrapClassName="h-13 w-13 bg-gradient-to-br from-brand-subtle to-[#FBD8DC]"
            />
            <div>
              <div className="text-[15.5px] font-semibold text-ink">{c.name}</div>
              <div className="mt-0.5 text-[12.5px] text-muted">
                {c.count} produk
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
