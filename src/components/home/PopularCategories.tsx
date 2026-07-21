import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";

import { CategoryIcon } from "@/components/ui/Icon";

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
        <h2 className="text-2xl font-extrabold tracking-tight text-ink">
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
            className="flex w-[172px] flex-none flex-col gap-3.5 rounded-card border border-gray-100 bg-white px-[18px] py-[22px] transition-[box-shadow,transform,border-color] duration-200 [scroll-snap-align:start] hover:-translate-y-[3px] hover:border-[#F6C9CE] hover:shadow-hover"
          >
            <span className="flex h-13 w-13 items-center justify-center rounded-[14px] bg-gradient-to-br from-brand-subtle to-[#FBD8DC] text-brand">
              <CategoryIcon name={c.icon} className="h-6 w-6" />
            </span>
            <div>
              <div className="text-[15.5px] font-bold text-ink">{c.name}</div>
              <div className="mt-0.5 text-[12.5px] text-gray-400">
                {c.count} produk
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
