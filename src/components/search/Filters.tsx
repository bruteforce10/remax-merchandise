"use client";

import { Check } from "lucide-react";
import type { ReactElement } from "react";

import { COLOR_HEX, COLOR_PALETTE, PRICE_MAX, PRICE_MIN } from "@/lib/data/catalog";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface FilterValue {
  categories: string[];
  priceMax: number;
  colors: string[];
}

export interface CategoryCount {
  slug: string;
  name: string;
  count: number;
}

interface FiltersProps {
  value: FilterValue;
  onChange: (patch: Partial<FilterValue>) => void;
  onReset: () => void;
  categories: CategoryCount[];
  activeCount: number;
}

const SECTION_LABEL =
  "mb-3 text-[12.5px] font-bold tracking-[0.04em] text-gray-400 uppercase";

export function Filters({
  value,
  onChange,
  onReset,
  categories,
  activeCount,
}: FiltersProps): ReactElement {
  function toggleCategory(slug: string): void {
    onChange({
      categories: value.categories.includes(slug)
        ? value.categories.filter((c) => c !== slug)
        : [...value.categories, slug],
    });
  }

  function toggleColor(name: string): void {
    onChange({
      colors: value.colors.includes(name)
        ? value.colors.filter((c) => c !== name)
        : [...value.colors, name],
    });
  }

  return (
    <div className="flex flex-col gap-[22px]">
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-ink">Filter</span>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="border-none bg-none text-[13px] font-semibold text-brand"
          >
            Reset ({activeCount})
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <div className={SECTION_LABEL}>Kategori</div>
        <div className="flex max-h-[230px] flex-col gap-0.5 overflow-y-auto">
          {categories.map((c) => {
            const checked = value.categories.includes(c.slug);
            return (
              <label
                key={c.slug}
                onClick={() => toggleCategory(c.slug)}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1.5 hover:bg-gray-50"
              >
                <span
                  className={cn(
                    "flex h-5 w-5 flex-none items-center justify-center rounded-md border",
                    checked
                      ? "border-brand bg-brand"
                      : "border-gray-300 bg-white",
                  )}
                >
                  {checked && <Check className="h-3 w-3 text-white" strokeWidth={3.5} />}
                </span>
                <span className="flex-1 text-sm text-gray-700">{c.name}</span>
                <span className="text-xs text-gray-300">{c.count}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price */}
      <div className="border-t border-gray-200 pt-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[12.5px] font-bold tracking-[0.04em] text-gray-400 uppercase">
            Harga Maks.
          </span>
          <span className="font-mono text-[13px] font-bold text-brand">
            {formatPrice(value.priceMax)}
          </span>
        </div>
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={5000}
          value={value.priceMax}
          onChange={(e) => onChange({ priceMax: parseInt(e.target.value, 10) })}
          aria-label="Harga maksimum"
          className="w-full cursor-pointer accent-brand"
        />
        <div className="mt-1 flex justify-between text-[11px] text-gray-300">
          <span>Rp 10rb</span>
          <span>Rp 300rb</span>
        </div>
      </div>

      {/* Colors */}
      <div className="border-t border-gray-200 pt-5">
        <div className={SECTION_LABEL}>Warna</div>
        <div className="flex flex-wrap gap-2.5">
          {COLOR_PALETTE.map((name) => {
            const checked = value.colors.includes(name);
            const ring = checked
              ? "border-brand"
              : name === "Putih"
                ? "border-gray-200"
                : "border-transparent";
            return (
              <button
                key={name}
                type="button"
                title={name}
                aria-label={name}
                aria-pressed={checked}
                onClick={() => toggleColor(name)}
                style={{ backgroundColor: COLOR_HEX[name] }}
                className={cn(
                  "h-[34px] w-[34px] rounded-[10px] border-2",
                  ring,
                  checked && "shadow-[0_0_0_3px_rgba(225,29,46,0.18)]",
                )}
              />
            );
          })}
        </div>
      </div>

    </div>
  );
}
