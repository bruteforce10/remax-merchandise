import type { ReactElement } from "react";

export function ProductSkeletonGrid({
  count = 8,
}: {
  count?: number;
}): ReactElement {
  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-card border border-gray-100"
        >
          <div className="shimmer aspect-square" />
          <div className="flex flex-col gap-2.5 p-4">
            <div className="h-3 w-2/5 rounded-md bg-gray-100" />
            <div className="h-3.5 w-4/5 rounded-md bg-gray-100" />
            <div className="mt-1.5 h-9 rounded-[10px] bg-gray-50" />
          </div>
        </div>
      ))}
    </div>
  );
}
