import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";

import { CategoryIcon } from "@/components/ui/Icon";
import type { Category } from "@/types/category";

interface CategoryCardProps {
  category: Category;
  count: number;
}

export function CategoryCard({ category, count }: CategoryCardProps): ReactElement {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group flex flex-col gap-4 rounded-card border border-gray-100 bg-white p-6 transition-[box-shadow,transform] duration-200 hover:-translate-y-[2px] hover:shadow-hover"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-13 w-13 items-center justify-center rounded-[14px] bg-brand-subtle text-brand">
          <CategoryIcon name={category.icon} className="h-6 w-6" />
        </span>
        <ArrowRight className="h-5 w-5 text-gray-300 transition-colors group-hover:text-brand" />
      </div>
      <div>
        <div className="text-[17px] font-bold text-ink">{category.name}</div>
        <div className="mt-0.5 text-[12.5px] text-gray-400">{count} produk</div>
      </div>
      <p className="line-clamp-2 text-sm leading-relaxed text-gray-500">
        {category.description}
      </p>
    </Link>
  );
}
