import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";

import { CategoryVisual } from "@/components/category/CategoryVisual";
import type { Category } from "@/types/category";

interface CategoryCardProps {
  category: Category;
  count: number;
}

export function CategoryCard({ category, count }: CategoryCardProps): ReactElement {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group flex flex-col gap-4 rounded-card border border-gray-200 bg-white p-6 transition-[box-shadow,transform] duration-200 hover:-translate-y-[2px] hover:shadow-hover"
    >
      <div className="flex items-center justify-between">
        <CategoryVisual
          slug={category.slug}
          name={category.name}
          icon={category.icon}
          sizes="72px"
          iconClassName="h-6 w-6"
          wrapClassName="rounded-card text-brand"
          imageWrapClassName="h-[72px] w-[72px]"
          iconWrapClassName="h-13 w-13 bg-brand-subtle"
        />
        <ArrowRight className="h-5 w-5 text-gray-300 transition-colors group-hover:text-brand" />
      </div>
      <div>
        <div className="text-[17px] font-semibold text-ink">{category.name}</div>
        <div className="mt-0.5 text-[12.5px] text-muted">{count} produk</div>
      </div>
      <p className="line-clamp-2 text-sm leading-relaxed text-body">
        {category.description}
      </p>
    </Link>
  );
}
