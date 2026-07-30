import type { ReactElement } from "react";

export default function Loading(): ReactElement {
  return (
    <div className="animate-[rmx-fade_.3s_ease]">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-2.5">
          <div className="h-7 w-52 rounded-md bg-gray-100" />
          <div className="h-4 w-72 rounded-md bg-gray-100" />
        </div>
        <div className="h-10 w-32 flex-none rounded-btn bg-gray-100" />
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-card border border-admin-border bg-white p-5"
          >
            <div className="h-4 w-24 rounded-md bg-gray-100" />
            <div className="mt-4 h-8 w-20 rounded-md bg-gray-100" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-card border border-admin-border bg-white">
        <div className="h-12 w-full border-b border-admin-border bg-gray-50" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-admin-border px-5 py-4 last:border-b-0"
          >
            <div className="shimmer h-10 w-10 flex-none rounded-btn" />
            <div className="h-4 flex-1 rounded-md bg-gray-100" />
            <div className="hidden h-4 w-24 rounded-md bg-gray-100 sm:block" />
            <div className="h-4 w-16 rounded-md bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
