import { ExternalLink, PackageSearch } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactElement } from "react";

import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { OrderStatusTimeline } from "@/components/order/OrderStatusTimeline";
import { Badge, type BadgeProps } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/format";
import {
  ORDER_STATUS_META,
  type StatusTone,
  trackingUrl,
} from "@/lib/orders/status";
import { getOrderByRef } from "@/services/operational/orders";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lacak Pesanan",
  description: "Lacak status pesanan merchandise REMAX Anda.",
  robots: { index: false, follow: false },
};

const TONE_VARIANT: Record<StatusTone, NonNullable<BadgeProps["variant"]>> = {
  pending: "warning",
  progress: "info",
  success: "success",
  danger: "danger",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function SummaryRow({ label, value }: { label: string; value: string }): ReactElement {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[13px] text-gray-500">{label}</span>
      <span className="font-mono text-[13.5px] font-bold text-ink">{value}</span>
    </div>
  );
}

export default async function TrackOrderPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}): Promise<ReactElement> {
  const { ref } = await params;
  const order = await getOrderByRef(ref);

  if (!order) {
    return (
      <div className="mx-auto max-w-[720px] px-6 pt-6 pb-16">
        <Breadcrumb
          items={[{ label: "Beranda", href: "/" }, { label: "Lacak Pesanan" }]}
        />
        <div className="mt-6 rounded-[20px] border border-dashed border-gray-200 px-5 py-20 text-center">
          <PackageSearch className="mx-auto mb-3 h-9 w-9 text-gray-300" />
          <div className="mb-1.5 text-xl font-semibold text-ink">
            Pesanan tidak ditemukan
          </div>
          <div className="mx-auto mb-6 max-w-[380px] text-[14.5px] text-muted">
            Nomor pesanan{" "}
            <span className="font-mono font-semibold">
              {ref.toUpperCase()}
            </span>{" "}
            tidak dikenali. Periksa kembali tautan dari email Anda.
          </div>
          <Link
            href="/"
            className="inline-flex h-[50px] items-center rounded-btn bg-brand px-6 text-[15px] font-medium text-white hover:bg-brand-hover"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const meta = ORDER_STATUS_META[order.status];
  const track = trackingUrl(order.resi);

  return (
    <div className="mx-auto max-w-[720px] animate-[rmx-fade_.3s_ease] px-6 pt-6 pb-16">
      <Breadcrumb
        items={[{ label: "Beranda", href: "/" }, { label: "Lacak Pesanan" }]}
      />

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <h1 className="text-[26px] font-semibold tracking-tight text-ink sm:text-[30px]">
          Pesanan #{order.ref}
        </h1>
        <Badge variant={TONE_VARIANT[meta.tone]} size="md">
          {meta.label}
        </Badge>
      </div>
      <p className="mt-1 text-[14.5px] text-muted">
        Dibuat {formatDate(order.createdAt)} · {order.totalQty} pcs
      </p>

      {order.resi && (
        <div className="mt-6 rounded-card border border-gray-200 bg-white p-5">
          <div className="text-[12.5px] font-semibold tracking-wide text-gray-400 uppercase">
            Info Pengiriman
          </div>
          <div className="mt-2.5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-[13px] text-gray-500">
                {order.courier || "Kurir"}
              </div>
              <div className="font-mono text-[19px] font-extrabold tracking-wide text-brand">
                {order.resi}
              </div>
            </div>
            {track && (
              <a
                href={track}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-[46px] items-center gap-2 rounded-btn bg-brand px-5 text-[14.5px] font-medium text-white hover:bg-brand-hover"
              >
                Lacak di {order.courier || "Kurir"}
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 rounded-card border border-gray-200 bg-white p-5">
        <div className="mb-4 text-[12.5px] font-semibold tracking-wide text-gray-400 uppercase">
          Status Pesanan
        </div>
        <OrderStatusTimeline order={order} />
      </div>

      <div className="mt-6 rounded-card border border-gray-200 bg-white p-5">
        <div className="mb-3.5 text-[12.5px] font-semibold tracking-wide text-gray-400 uppercase">
          Rincian Pesanan
        </div>
        <div className="flex flex-col gap-2.5">
          {order.items.map((item, idx) => (
            <div
              key={`${item.sku}-${idx}`}
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
              </div>
              <div className="flex-none font-mono text-[13.5px] font-bold text-ink">
                {item.qty} pcs
              </div>
            </div>
          ))}
        </div>
        {order.destination.recipientName ? (
          <div className="mt-4 rounded-[14px] bg-gray-50 px-3.5 py-3 text-[13px] text-gray-600">
            <div className="mb-1 font-semibold text-ink">Alamat Pengiriman</div>
            <div>
              {order.destination.recipientName} · {order.destination.recipientPhone}
            </div>
            <div className="mt-0.5 leading-relaxed">
              {order.destination.addressDetail}, {order.destination.villageName}, {order.destination.districtName}, {order.destination.regencyName}, {order.destination.provinceName}
            </div>
          </div>
        ) : null}
        <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-3.5">
          <SummaryRow label="Subtotal produk" value={formatPrice(order.estimatedTotal)} />
          <SummaryRow
            label={order.courierService ? `Ongkir (${order.courierService})` : "Ongkir"}
            value={formatPrice(order.shippingCost)}
          />
          <div className="flex items-center justify-between pt-1">
            <span className="text-[14px] font-semibold text-ink">Total</span>
            <span className="font-mono text-[17px] font-extrabold text-brand">
              {formatPrice(order.grandTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
