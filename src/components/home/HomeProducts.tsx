import type { ReactElement } from "react";

import { InfiniteProductGrid } from "@/components/product/InfiniteProductGrid";
import { sortProducts } from "@/lib/catalog";
import type { Product } from "@/types/product";

export function HomeProducts({ products }: { products: Product[] }): ReactElement {
  const cards = sortProducts(products, "popular");

  return (
    <section className="mx-auto max-w-[1280px] px-6 pt-8 pb-2">
      <h2 className="text-[22px] font-semibold tracking-tight text-ink">
        Produk Gifts
      </h2>
      <p className="mt-1.5 mb-[18px] text-[15px] text-muted">
        Pilihan lengkap untuk seragam, event, dan corporate gift.
      </p>

      <InfiniteProductGrid products={cards} />
    </section>
  );
}
