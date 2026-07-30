import type { ReactElement } from "react";

export default function Loading(): ReactElement {
  return (
    <div className="mx-auto max-w-[1280px] animate-[rmx-fade_.3s_ease] px-6 pt-[22px] pb-16">
      <div className="h-3.5 w-40 rounded-md bg-gray-100" />
      <div className="mt-5 h-9 w-56 rounded-md bg-gray-100" />

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        {/* Items */}
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex gap-4 rounded-card border border-gray-200 p-4"
            >
              <div className="shimmer h-24 w-24 flex-none rounded-btn" />
              <div className="flex flex-1 flex-col gap-2.5 py-1">
                <div className="h-4 w-2/3 rounded-md bg-gray-100" />
                <div className="h-3 w-1/4 rounded-md bg-gray-100" />
                <div className="mt-auto h-8 w-28 rounded-btn bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
        {/* Summary */}
        <div className="h-fit rounded-card border border-gray-200 p-6">
          <div className="h-5 w-32 rounded-md bg-gray-100" />
          <div className="mt-5 flex flex-col gap-3">
            <div className="h-4 w-full rounded-md bg-gray-100" />
            <div className="h-4 w-full rounded-md bg-gray-100" />
          </div>
          <div className="mt-6 h-12 w-full rounded-btn bg-gray-100" />
        </div>
      </div>
    </div>
  );
}
