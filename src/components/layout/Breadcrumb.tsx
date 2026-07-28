import Link from "next/link";
import { Fragment, type ReactElement } from "react";

import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: Crumb[];
  variant?: "light" | "dark";
}

export function Breadcrumb({
  items,
  variant = "light",
}: BreadcrumbProps): ReactElement {
  const sep = variant === "dark" ? "text-gray-600" : "text-gray-300";
  const link = variant === "dark" ? "text-gray-400 hover:text-white" : "text-gray-400 hover:text-brand";
  const current = variant === "dark" ? "font-semibold text-white" : "font-semibold text-ink";

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-2 text-[13px]"
    >
      {items.map((c, i) => (
        <Fragment key={`${c.label}-${i}`}>
          {i > 0 && <span className={sep}>/</span>}
          {c.href ? (
            <Link href={c.href} className={cn("transition-colors", link)}>
              {c.label}
            </Link>
          ) : (
            <span className={current} aria-current="page">
              {c.label}
            </span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
