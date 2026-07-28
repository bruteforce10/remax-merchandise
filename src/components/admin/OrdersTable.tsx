"use client";

import { Check, Package, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { confirmOrder, rejectOrder } from "@/actions/orders";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types/order";

const STATUS_FILTERS: { value: "all" | OrderStatus; label: string; dot: string }[] =
  [
    { value: "all", label: "Semua", dot: "bg-gray-400" },
    { value: "pending", label: "Menunggu", dot: "bg-warning" },
    { value: "confirmed", label: "Dikonfirmasi", dot: "bg-success" },
    { value: "rejected", label: "Ditolak", dot: "bg-gray-400" },
  ];

const TH =
  "px-4 py-3.5 text-left text-[12px] font-bold tracking-[0.04em] text-gray-400 uppercase";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function optionsLabel(options: Record<string, string>): string {
  const vals = Object.values(options);
  return vals.length ? ` (${vals.join(" / ")})` : "";
}

export function OrdersTable({ orders }: { orders: Order[] }): React.JSX.Element {
  const [items, setItems] = React.useState<Order[]>(orders);
  const [statusFilter, setStatusFilter] = React.useState<"all" | OrderStatus>(
    "all",
  );
  const [busyId, setBusyId] = React.useState<string | null>(null);

  const filtered =
    statusFilter === "all"
      ? items
      : items.filter((o) => o.status === statusFilter);

  async function onConfirm(id: string): Promise<void> {
    setBusyId(id);
    const res = await confirmOrder(id);
    if (res.success) {
      setItems((list) =>
        list.map((o) => (o.id === id ? { ...o, status: "confirmed" } : o)),
      );
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setBusyId(null);
  }

  async function onReject(id: string): Promise<void> {
    setBusyId(id);
    const res = await rejectOrder(id);
    if (res.success) {
      setItems((list) =>
        list.map((o) => (o.id === id ? { ...o, status: "rejected" } : o)),
      );
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setBusyId(null);
  }

  return (
    <div className="animate-[rmx-fade_.3s_ease]">
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">
          Pesanan
        </h1>
        <p className="mt-0.5 text-[14.5px] text-gray-500">
          Konfirmasi pesanan untuk mengurangi stok
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => {
          const active = statusFilter === f.value;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatusFilter(f.value)}
              className={cn(
                "inline-flex h-[38px] items-center gap-2 rounded-[10px] border px-3.5 text-[13px] font-semibold",
                active
                  ? "border-brand bg-brand-subtle text-brand"
                  : "border-admin-border bg-white text-gray-600 hover:bg-gray-50",
              )}
            >
              <span className={cn("h-[7px] w-[7px] rounded-full", f.dot)} />
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-card border border-admin-border bg-white">
        <div className="rmx-scrollbar overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-[#FAFBFC]">
                <th className={TH}>Order</th>
                <th className={TH}>Tanggal</th>
                <th className={TH}>Customer</th>
                <th className={TH}>Item</th>
                <th className={TH}>Total</th>
                <th className={TH}>Status</th>
                <th className={cn(TH, "text-right")}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-14 text-center text-[14px] text-gray-400"
                  >
                    Belum ada pesanan.
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-gray-50 align-top hover:bg-[#FAFBFC]"
                  >
                    <td className="px-4 py-3.5 font-mono text-[12.5px] font-bold text-ink">
                      {o.ref}
                    </td>
                    <td className="px-4 py-3.5 text-[13px] whitespace-nowrap text-gray-600">
                      {formatDate(o.createdAt)}
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-gray-600">
                      {o.customerEmail}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col gap-1">
                        {o.items.map((it, idx) => (
                          <div
                            key={`${it.sku}-${idx}`}
                            className="flex items-center gap-2 text-[13px] text-ink"
                          >
                            <Package className="h-[14px] w-[14px] flex-none text-gray-300" />
                            <span className="font-semibold">{it.name}</span>
                            <span className="text-gray-400">
                              {optionsLabel(it.options)}
                            </span>
                            <span className="font-mono text-gray-500">
                              ×{it.qty}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[13.5px] font-bold whitespace-nowrap text-brand">
                      {formatPrice(o.estimatedTotal)}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {o.status === "pending" ? (
                        <div className="inline-flex gap-2">
                          <button
                            type="button"
                            disabled={busyId === o.id}
                            onClick={() => void onConfirm(o.id)}
                            className="inline-flex h-8 items-center gap-1.5 rounded-[9px] bg-brand px-3 text-[12.5px] font-semibold text-white hover:bg-brand-hover disabled:opacity-60"
                          >
                            <Check className="h-[14px] w-[14px]" />
                            Konfirmasi
                          </button>
                          <button
                            type="button"
                            disabled={busyId === o.id}
                            onClick={() => void onReject(o.id)}
                            className="inline-flex h-8 items-center gap-1.5 rounded-[9px] border border-admin-border bg-white px-3 text-[12.5px] font-semibold text-gray-600 hover:text-danger disabled:opacity-60"
                          >
                            <X className="h-[14px] w-[14px]" />
                            Tolak
                          </button>
                        </div>
                      ) : (
                        <span className="text-[12.5px] text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
