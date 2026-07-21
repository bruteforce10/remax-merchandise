import type { ReactElement } from "react";

import { ProductCard } from "@/components/product/ProductCard";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface ProductGridProps {
  products: Product[];
  className?: string;
}

/** Responsive product grid — 2 cols mobile · 3 tablet · 4 desktop (PRD §9.3). */
export function ProductGrid({ products, className }: ProductGridProps): ReactElement {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4",
        className,
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.sku} product={product} />
      ))}
    </div>
  );
}
