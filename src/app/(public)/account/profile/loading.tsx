import type { ReactElement } from "react";

export default function Loading(): ReactElement {
  return (
    <div className="mx-auto max-w-[720px] animate-[rmx-fade_.3s_ease] px-6 pt-[22px] pb-16">
      <div className="h-9 w-48 rounded-md bg-gray-100" />
      <div className="mt-8 rounded-card border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 flex-none rounded-full bg-gray-100" />
          <div className="flex flex-col gap-2">
            <div className="h-4 w-40 rounded-md bg-gray-100" />
            <div className="h-3 w-52 rounded-md bg-gray-100" />
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-3.5 w-24 rounded-md bg-gray-100" />
              <div className="h-11 w-full rounded-btn bg-gray-100" />
            </div>
          ))}
          <div className="mt-2 h-12 w-36 rounded-btn bg-gray-100" />
        </div>
      </div>
    </div>
  );
}
