import type { ReactElement } from "react";

import { ProductSkeletonGrid } from "@/components/search/ProductSkeletonGrid";

export default function Loading(): ReactElement {
  return (
    <div className="mx-auto max-w-[1280px] animate-[rmx-fade_.3s_ease] px-6 py-8">
      <div className="h-11 w-full max-w-[520px] rounded-btn bg-gray-100" />
      <div className="mt-6 flex flex-wrap gap-2.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-24 rounded-pill bg-gray-100" />
        ))}
      </div>
      <div className="mt-8">
        <ProductSkeletonGrid count={8} />
      </div>
    </div>
  );
}
