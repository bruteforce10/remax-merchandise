import type { ReactElement } from "react";

import { cn } from "@/lib/utils";
import type { ProductStatus } from "@/types/admin";
import type { LeadStatus } from "@/types/lead";

type StatusKey = ProductStatus | LeadStatus;

const MAP: Record<StatusKey, { label: string; cls: string }> = {
  published: { label: "Published", cls: "bg-success-subtle text-success-fg" },
  draft: { label: "Draft", cls: "bg-gray-100 text-gray-500" },
  new: { label: "Baru", cls: "bg-brand-subtle text-brand-dark" },
  contacted: { label: "Dihubungi", cls: "bg-warning-subtle text-warning-fg" },
  completed: { label: "Selesai", cls: "bg-success-subtle text-success-fg" },
};

export function StatusBadge({
  status,
  dot = true,
}: {
  status: StatusKey;
  dot?: boolean;
}): ReactElement {
  const s = MAP[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-[11.5px] font-bold",
        s.cls,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {s.label}
    </span>
  );
}
