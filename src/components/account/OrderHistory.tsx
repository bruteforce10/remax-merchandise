import Link from "next/link";
import type { ReactElement } from "react";

import { Badge, type BadgeProps } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/format";
import type { Order, OrderStatus } from "@/types/order";

const STATUS_META: Record<
  OrderStatus,
  { label: string; variant: NonNullable<BadgeProps["variant"]> }
> = {
  pending: { label: "Menunggu Konfirmasi", variant: "warning" },
  confirmed: { label: "Dikonfirmasi", variant: "success" },
  rejected: { label: "Ditolak", variant: "danger" },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function OrderHistory({ orders }: { orders: Order[] }): ReactElement {
  if (orders.length === 0) {
    return (
      <div className="rounded-[20px] border border-dashed border-gray-200 px-5 py-20 text-center">
        <div className="mb-1.5 text-xl font-semibold text-ink">
          Belum ada pesanan
        </div>
        <div className="mx-auto mb-[22px] max-w-[360px] text-[14.5px] text-muted">
          Pesanan yang Anda checkout akan muncul di sini beserta statusnya.
        </div>
        <Link
          href="/search"
          className="inline-flex h-[50px] items-center rounded-btn bg-brand px-6 text-[15px] font-medium text-white hover:bg-brand-hover"
        >
          Jelajahi Produk
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => {
        const meta = STATUS_META[order.status];
        return (
          <div
            key={order.id}
            className="rounded-card border border-gray-200 bg-white p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-3.5">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[15px] font-extrabold text-ink">
                    #{order.ref}
                  </span>
                  <Badge variant={meta.variant}>{meta.label}</Badge>
                </div>
                <div className="mt-1 text-[12.5px] text-gray-400">
                  {formatDate(order.createdAt)} · {order.totalQty} pcs
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11.5px] text-gray-400">Estimasi nilai</div>
                <div className="font-mono text-[17px] font-extrabold text-brand">
                  {formatPrice(order.estimatedTotal)}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-3.5">
              {order.items.map((item) => (
                <div
                  key={item.sku}
                  className="flex items-start justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="text-[14.5px] font-semibold text-ink">
                      {item.name}
                    </div>
                    {Object.keys(item.options).length > 0 && (
                      <div className="mt-0.5 flex flex-wrap gap-1.5">
                        {Object.entries(item.options).map(([k, v]) => (
                          <span
                            key={k}
                            className="inline-flex items-center rounded-pill bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold text-gray-600"
                          >
                            {k}: {v}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-0.5 text-[12.5px] text-gray-400">
                      SKU {item.sku}
                    </div>
                  </div>
                  <div className="flex-none text-right">
                    <div className="font-mono text-[13.5px] font-bold text-ink">
                      {item.qty} pcs
                    </div>
                    <div className="text-[12px] text-gray-400">
                      {formatPrice(item.unitPrice)}/pcs
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
