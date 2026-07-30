import type { ReactElement } from "react";

import { ProductSkeletonGrid } from "@/components/search/ProductSkeletonGrid";

export default function Loading(): ReactElement {
  return (
    <div className="animate-[rmx-fade_.3s_ease]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-[#2a1114]">
        <div className="mx-auto max-w-[1280px] px-6 pt-9 pb-10">
          <div className="h-3.5 w-52 rounded-md bg-white/15" />
          <div className="mt-5 flex items-center gap-[18px]">
            <div className="h-[66px] w-[66px] flex-none rounded-card bg-white/10" />
            <div className="min-w-[240px] flex-1">
              <div className="h-9 w-64 rounded-md bg-white/15" />
              <div className="mt-3 h-4 w-full max-w-[560px] rounded-md bg-white/10" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 pt-6 pb-10">
        {/* Category chips */}
        <div className="mb-5 flex gap-2.5 overflow-hidden pb-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-10 w-28 flex-none rounded-pill bg-gray-100" />
          ))}
        </div>

        <ProductSkeletonGrid count={8} />
      </section>
    </div>
  );
}
