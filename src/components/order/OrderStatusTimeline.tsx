import type { ReactElement } from "react";

import {
  ORDER_STAGES,
  ORDER_STATUS_META,
  stageIndex,
} from "@/lib/orders/status";
import { cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types/order";

interface TimelineNode {
  status: OrderStatus;
  state: "done" | "current" | "upcoming";
  note: string;
  date: string;
}

function lastEventOf(order: Order, status: OrderStatus): { note: string; date: string } {
  const ev = [...order.history].reverse().find((h) => h.status === status);
  return { note: ev?.note ?? "", date: ev?.createdAt ?? "" };
}

function buildNodes(order: Order): TimelineNode[] {
  if (order.status === "rejected") {
    const pending = lastEventOf(order, "pending");
    const rejected = lastEventOf(order, "rejected");
    return [
      {
        status: "pending",
        state: "done",
        note: pending.note,
        date: pending.date || order.createdAt,
      },
      { status: "rejected", state: "current", note: rejected.note, date: rejected.date },
    ];
  }

  const currentIdx = stageIndex(order.status);
  return ORDER_STAGES.map((status, idx) => {
    const ev = lastEventOf(order, status);
    return {
      status,
      state: idx < currentIdx ? "done" : idx === currentIdx ? "current" : "upcoming",
      note: ev.note,
      date: ev.date,
    };
  });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function dotClass(node: TimelineNode): string {
  if (node.state === "upcoming") return "border-2 border-gray-200 bg-white";
  const tone = ORDER_STATUS_META[node.status].tone;
  const base = tone === "success" ? "bg-success" : tone === "danger" ? "bg-brand" : "bg-brand";
  return cn(base, node.state === "current" && "ring-4 ring-brand/15");
}

export function OrderStatusTimeline({ order }: { order: Order }): ReactElement {
  const nodes = buildNodes(order);

  return (
    <ol className="relative">
      {nodes.map((node, i) => {
        const meta = ORDER_STATUS_META[node.status];
        const muted = node.state === "upcoming";
        const text = node.note || meta.description;
        return (
          <li key={node.status} className="relative flex gap-3.5 pb-5 last:pb-0">
            {i < nodes.length - 1 && (
              <span className="absolute top-4 left-[7px] h-full w-px bg-gray-200" />
            )}
            <span
              className={cn(
                "relative z-[1] mt-0.5 h-3.5 w-3.5 flex-none rounded-full",
                dotClass(node),
              )}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2">
                <span
                  className={cn(
                    "text-[14.5px] font-semibold",
                    muted ? "text-gray-400" : "text-ink",
                  )}
                >
                  {meta.label}
                </span>
                {node.date && (
                  <span className="text-[12px] text-gray-400">
                    {formatDateTime(node.date)}
                  </span>
                )}
              </div>
              <p
                className={cn(
                  "mt-0.5 text-[13.5px]",
                  muted ? "text-gray-300" : "text-muted",
                )}
              >
                {text}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
