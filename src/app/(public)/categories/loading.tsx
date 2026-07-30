import type { ReactElement } from "react";

export default function Loading(): ReactElement {
  return (
    <div className="mx-auto max-w-[1280px] animate-[rmx-fade_.3s_ease] px-6 pt-[22px] pb-14">
      <div className="h-3.5 w-40 rounded-md bg-gray-100" />
      <div className="mt-5 h-9 w-72 rounded-md bg-gray-100" />
      <div className="mt-3 h-4 w-full max-w-[560px] rounded-md bg-gray-100" />

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-card border border-gray-200"
          >
            <div className="shimmer aspect-[16/10] w-full" />
            <div className="flex flex-col gap-2.5 p-5">
              <div className="h-4 w-2/3 rounded-md bg-gray-100" />
              <div className="h-3 w-1/3 rounded-md bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
