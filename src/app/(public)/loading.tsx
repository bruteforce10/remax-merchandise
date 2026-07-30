import type { ReactElement } from "react";

import { ProductSkeletonGrid } from "@/components/search/ProductSkeletonGrid";

export default function Loading(): ReactElement {
  return (
    <div className="animate-[rmx-fade_.3s_ease]">
      {/* Hero */}
      <div className="shimmer h-[340px] w-full sm:h-[420px] lg:h-[500px]" />

      {/* Popular categories */}
      <section className="mx-auto max-w-[1280px] px-6 pt-12">
        <div className="h-7 w-56 rounded-md bg-gray-100" />
        <div className="mt-6 flex gap-3 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 w-28 flex-none rounded-card bg-gray-100" />
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-[1280px] px-6 pt-14 pb-16">
        <div className="mb-6 h-7 w-64 rounded-md bg-gray-100" />
        <ProductSkeletonGrid count={8} />
      </section>
    </div>
  );
}
