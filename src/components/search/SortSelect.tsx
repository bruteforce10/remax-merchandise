import type { ReactElement } from "react";

import { SORT_OPTIONS } from "@/lib/catalog";
import type { SortOption } from "@/types/product";

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps): ReactElement {
  return (
    <div className="inline-flex h-11 items-center gap-2 rounded-pill border border-gray-200 bg-white pr-4 pl-4">
      <span className="text-[13px] text-muted">Urutkan</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        aria-label="Urutkan produk"
        className="cursor-pointer border-none bg-transparent text-sm font-semibold text-ink outline-none"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
