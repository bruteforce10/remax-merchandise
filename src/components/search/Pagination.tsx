import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactElement } from "react";

import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  pageCount: number;
  onPage: (page: number) => void;
}

export function Pagination({
  page,
  pageCount,
  onPage,
}: PaginationProps): ReactElement | null {
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        type="button"
        aria-label="Halaman sebelumnya"
        onClick={() => onPage(Math.max(1, page - 1))}
        className="flex h-[42px] w-[42px] items-center justify-center rounded-pill border border-gray-200 bg-white text-ink hover:border-border-strong"
      >
        <ChevronLeft className="h-[18px] w-[18px]" />
      </button>
      {pages.map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`Halaman ${n}`}
          aria-current={n === page ? "page" : undefined}
          onClick={() => onPage(n)}
          className={cn(
            "h-[42px] min-w-[42px] rounded-pill border px-2 font-mono text-[15px] font-bold",
            n === page
              ? "border-brand bg-brand text-white"
              : "border-gray-200 bg-white text-ink hover:border-border-strong",
          )}
        >
          {n}
        </button>
      ))}
      <button
        type="button"
        aria-label="Halaman berikutnya"
        onClick={() => onPage(Math.min(pageCount, page + 1))}
        className="flex h-[42px] w-[42px] items-center justify-center rounded-pill border border-gray-200 bg-white text-ink hover:border-border-strong"
      >
        <ChevronRight className="h-[18px] w-[18px]" />
      </button>
    </div>
  );
}
