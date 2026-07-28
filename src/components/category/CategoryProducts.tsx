"use client";

import * as React from "react";

import { ProductGrid } from "@/components/product/ProductGrid";
import { Pagination } from "@/components/search/Pagination";
import { SortSelect } from "@/components/search/SortSelect";
import { paginate, sortProducts } from "@/lib/catalog";
import { PAGE_SIZE } from "@/lib/data/catalog";
import type { Product, SortOption } from "@/types/product";

export function CategoryProducts({
  products,
}: {
  products: Product[];
}): React.JSX.Element {
  const [sort, setSort] = React.useState<SortOption>("popular");
  const [page, setPage] = React.useState(1);

  const sorted = React.useMemo(() => sortProducts(products, sort), [products, sort]);
  const { items, page: current, pageCount } = paginate(sorted, page, PAGE_SIZE);

  return (
    <>
      <div className="mb-[18px] flex flex-wrap items-center justify-between gap-3">
        <div className="text-[15px] text-muted">
          <strong className="text-ink">{products.length}</strong> produk
        </div>
        <SortSelect
          value={sort}
          onChange={(v) => {
            setSort(v);
            setPage(1);
          }}
        />
      </div>
      <ProductGrid products={items} />
      <Pagination page={current} pageCount={pageCount} onPage={setPage} />
    </>
  );
}
