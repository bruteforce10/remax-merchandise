"use client";

import * as React from "react";

import { InfiniteProductGrid } from "@/components/product/InfiniteProductGrid";
import { SortSelect } from "@/components/search/SortSelect";
import { sortProducts } from "@/lib/catalog";
import type { Product, SortOption } from "@/types/product";

export function CategoryProducts({
  products,
}: {
  products: Product[];
}): React.JSX.Element {
  const [sort, setSort] = React.useState<SortOption>("popular");

  const sorted = React.useMemo(
    () => sortProducts(products, sort),
    [products, sort],
  );

  return (
    <>
      <div className="mb-[18px] flex flex-wrap items-center justify-between gap-3">
        <div className="text-[15px] text-muted">
          <strong className="text-ink">{products.length}</strong> produk
        </div>
        <SortSelect value={sort} onChange={setSort} />
      </div>
      <InfiniteProductGrid products={sorted} />
    </>
  );
}
