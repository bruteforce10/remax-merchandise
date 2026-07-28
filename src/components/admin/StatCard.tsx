import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import type { ReactElement } from "react";

import { cn } from "@/lib/utils";

export type Tone = "brand" | "info" | "success" | "warning" | "neutral";

const TONES: Record<Tone, string> = {
  brand: "bg-brand-subtle text-brand",
  info: "bg-info-subtle text-info",
  success: "bg-success-subtle text-success",
  warning: "bg-warning-subtle text-warning",
  neutral: "bg-gray-100 text-gray-600",
};

interface StatCardProps {
  icon: LucideIcon;
  tone: Tone;
  value: string;
  label: string;
  delta: string;
  trend: "up" | "down";
}

export function StatCard({
  icon: Icon,
  tone,
  value,
  label,
  delta,
  trend,
}: StatCardProps): ReactElement {
  return (
    <div className="rounded-card border border-admin-border bg-white p-5 transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-hover">
      <div className="mb-3.5 flex items-center justify-between">
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-btn",
            TONES[tone],
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-0.5 text-xs font-bold",
            trend === "up" ? "text-success-fg" : "text-danger",
          )}
        >
          {trend === "up" ? (
            <TrendingUp className="h-[13px] w-[13px]" />
          ) : (
            <TrendingDown className="h-[13px] w-[13px]" />
          )}
          {delta}
        </span>
      </div>
      <div className="font-mono text-[28px] font-bold tracking-tight text-ink">
        {value}
      </div>
      <div className="mt-0.5 text-[13.5px] text-gray-500">{label}</div>
    </div>
  );
}
