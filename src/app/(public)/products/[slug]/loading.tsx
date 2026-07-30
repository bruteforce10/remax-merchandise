import type { ReactElement } from "react";

export default function Loading(): ReactElement {
  return (
    <div className="mx-auto max-w-[1280px] animate-[rmx-fade_.3s_ease] px-6 pt-[22px] pb-16">
      <div className="h-3.5 w-64 rounded-md bg-gray-100" />

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div className="flex flex-col gap-4">
          <div className="shimmer aspect-square w-full rounded-card" />
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="shimmer h-20 w-20 rounded-btn" />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4 pt-2">
          <div className="h-4 w-24 rounded-md bg-gray-100" />
          <div className="h-9 w-4/5 rounded-md bg-gray-100" />
          <div className="h-8 w-40 rounded-md bg-gray-100" />
          <div className="h-px w-full bg-gray-100" />
          <div className="h-4 w-full rounded-md bg-gray-100" />
          <div className="h-4 w-11/12 rounded-md bg-gray-100" />
          <div className="h-4 w-3/4 rounded-md bg-gray-100" />
          <div className="mt-2 flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-11 w-16 rounded-btn bg-gray-100" />
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            <div className="h-12 flex-1 rounded-btn bg-gray-100" />
            <div className="h-12 w-14 rounded-btn bg-gray-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
