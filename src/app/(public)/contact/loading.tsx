import type { ReactElement } from "react";

export default function Loading(): ReactElement {
  return (
    <div className="mx-auto max-w-[1280px] animate-[rmx-fade_.3s_ease] px-6 pt-[22px] pb-16">
      <div className="h-3.5 w-40 rounded-md bg-gray-100" />
      <div className="mt-5 h-9 w-64 rounded-md bg-gray-100" />
      <div className="mt-3 h-4 w-full max-w-[520px] rounded-md bg-gray-100" />

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Form */}
        <div className="flex flex-col gap-4 rounded-card border border-gray-200 p-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-3.5 w-24 rounded-md bg-gray-100" />
              <div className="h-11 w-full rounded-btn bg-gray-100" />
            </div>
          ))}
          <div className="mt-2 h-12 w-40 rounded-btn bg-gray-100" />
        </div>
        {/* Info cards */}
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-card border border-gray-200 p-5"
            >
              <div className="h-11 w-11 flex-none rounded-card bg-gray-100" />
              <div className="flex flex-1 flex-col gap-2">
                <div className="h-3.5 w-1/3 rounded-md bg-gray-100" />
                <div className="h-4 w-2/3 rounded-md bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
