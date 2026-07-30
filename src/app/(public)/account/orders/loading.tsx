import type { ReactElement } from "react";

export default function Loading(): ReactElement {
  return (
    <div className="mx-auto max-w-[1280px] animate-[rmx-fade_.3s_ease] px-6 pt-[22px] pb-16">
      <div className="h-9 w-56 rounded-md bg-gray-100" />
      <div className="mt-8 flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-card border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div className="h-4 w-40 rounded-md bg-gray-100" />
              <div className="h-6 w-24 rounded-pill bg-gray-100" />
            </div>
            <div className="mt-4 flex gap-4">
              <div className="shimmer h-16 w-16 flex-none rounded-btn" />
              <div className="flex flex-1 flex-col gap-2.5 py-1">
                <div className="h-4 w-1/2 rounded-md bg-gray-100" />
                <div className="h-3 w-1/4 rounded-md bg-gray-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
