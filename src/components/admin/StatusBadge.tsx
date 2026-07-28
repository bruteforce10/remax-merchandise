import type { ReactElement } from "react";

import { cn } from "@/lib/utils";
import type { ProductStatus } from "@/types/admin";
import type { LeadStatus } from "@/types/lead";
import type { OrderStatus } from "@/types/order";

type StatusKey = ProductStatus | LeadStatus | OrderStatus;

const MAP: Record<StatusKey, { label: string; cls: string }> = {
  published: { label: "Published", cls: "bg-success-subtle text-success-fg" },
  draft: { label: "Draft", cls: "bg-gray-100 text-gray-500" },
  new: { label: "Baru", cls: "bg-brand-subtle text-brand-dark" },
  contacted: { label: "Dihubungi", cls: "bg-warning-subtle text-warning-fg" },
  completed: { label: "Selesai", cls: "bg-success-subtle text-success-fg" },
  pending: { label: "Menunggu", cls: "bg-warning-subtle text-warning-fg" },
  confirmed: { label: "Dikonfirmasi", cls: "bg-success-subtle text-success-fg" },
  rejected: { label: "Ditolak", cls: "bg-gray-100 text-gray-500" },
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
        "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-[11px] font-semibold",
        s.cls,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {s.label}
    </span>
  );
}
