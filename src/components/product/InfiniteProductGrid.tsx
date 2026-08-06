"use client";

import { Loader2 } from "lucide-react";
import { type ReactElement, useEffect, useRef, useState } from "react";

import { ProductGrid } from "@/components/product/ProductGrid";
import type { Product } from "@/types/product";

interface InfiniteProductGridProps {
  /** Full, already-sorted product list — cards are revealed progressively. */
  products: Product[];
  /** Cards rendered on first paint (and restored whenever the list changes). */
  initialCount?: number;
  /** Cards revealed each time the sentinel scrolls into view. */
  batchSize?: number;
  className?: string;
}

/**
 * Client-side infinite scroll over an in-memory product list. The whole catalog
 * is fetched once server-side (see services/content/products) and cached, so
 * there is no per-batch network request — an IntersectionObserver simply widens
 * the visible slice as the user scrolls, keeping the initial payload light while
 * still letting the visitor reach every product.
 */
export function InfiniteProductGrid({
  products,
  initialCount = 12,
  batchSize = 12,
  className,
}: InfiniteProductGridProps): ReactElement {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const [prevProducts, setPrevProducts] = useState(products);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Reset the window to the top whenever the product set changes (e.g. the
  // parent re-sorts). Adjusting during render avoids a flash of the old,
  // wider slice before an effect could correct it.
  if (products !== prevProducts) {
    setPrevProducts(products);
    setVisibleCount(initialCount);
  }

  const hasMore = visibleCount < products.length;

  useEffect(() => {
    if (!hasMore) return;
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisibleCount((count) =>
            Math.min(count + batchSize, products.length),
          );
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, batchSize, products.length, visibleCount]);

  return (
    <>
      <ProductGrid
        products={products.slice(0, visibleCount)}
        className={className}
      />
      {hasMore && (
        <div
          ref={sentinelRef}
          role="status"
          aria-live="polite"
          className="flex items-center justify-center gap-2.5 py-10 text-muted"
        >
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
          <span className="text-[14px] font-medium">Memuat produk lainnya…</span>
        </div>
      )}
    </>
  );
}
