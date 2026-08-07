"use client";

import { Loader2, RefreshCw, Truck } from "lucide-react";
import * as React from "react";

import { formatEstimation, formatKg, formatPrice } from "@/lib/format";

import type { UseShippingResult } from "@/hooks/useShipping";

interface ShippingRateCardProps {
  shipping: UseShippingResult;
}

/**
 * Ongkir readout for checkout. There is nothing to pick — JNE Express is the
 * only service, so the rate is quoted automatically when the destination (or the
 * cart) changes and this card just breaks down how the number was reached.
 */
export function ShippingRateCard({
  shipping,
}: ShippingRateCardProps): React.JSX.Element {
  const {
    rate,
    ratesStatus,
    weightGrams,
    canQuote,
    selected,
    quote,
    error,
  } = shipping;
  // The village is the last cascade level and the only one the rate API needs,
  // so it — not a partially-filled address — is what gates the quote display.
  const hasDestination = !!selected.village;
  const billedKg = rate?.weightKg ?? 0;
  const perKg = rate && billedKg > 0 ? Math.round(rate.price / billedKg) : 0;
  const estimation = rate ? formatEstimation(rate.estimation) : "";

  return (
    <div className="rounded-card border border-hairline bg-white p-6">
      <div className="mb-4 flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-[10px] bg-brand-subtle text-brand">
          <Truck className="h-[18px] w-[18px]" />
        </span>
        <div>
          <h3 className="text-lg font-semibold text-ink">Pengiriman JNE Express</h3>
          <p className="mt-1 text-[13px] text-muted">
            Ongkir dihitung otomatis dari alamat tujuan dan berat pesanan.
          </p>
        </div>
      </div>

      {!canQuote ? (
        <Notice icon="truck">
          Login dulu — ongkir JNE dihitung otomatis setelah Anda masuk.
        </Notice>
      ) : !hasDestination ? (
        <Notice icon="truck">
          Lengkapi alamat pengiriman — ongkir akan terisi otomatis.
        </Notice>
      ) : ratesStatus === "loading" || ratesStatus === "idle" ? (
        // "idle" with a destination means a quote is queued (cart still
        // hydrating) — show progress rather than a premature "not served".
        <Notice icon="loading">Menghitung ongkir JNE Express…</Notice>
      ) : ratesStatus === "error" ? (
        <Warning onRetry={quote}>
          {error || "Ongkir belum bisa dihitung otomatis. Tim akan konfirmasi manual via WhatsApp."}
        </Warning>
      ) : ratesStatus === "empty" || !rate ? (
        <Warning>
          JNE Express belum melayani tujuan ini secara otomatis. Tim akan
          konfirmasi ongkir manual via WhatsApp.
        </Warning>
      ) : (
        <dl className="rounded-btn border border-hairline bg-surface-soft px-4 py-3.5">
          <DetailRow label="Layanan" value={rate.courierName} />
          <DetailRow
            label="Estimasi tiba"
            value={estimation || "Mengikuti jadwal kurir"}
          />
          <DetailRow
            label="Berat kiriman"
            value={
              weightGrams > 0
                ? `${formatKg(weightGrams)} · tertagih ${billedKg} kg`
                : `${billedKg} kg`
            }
          />
          {perKg > 0 && (
            <DetailRow label="Tarif" value={`${formatPrice(perKg)} / kg`} />
          )}
          <div className="mt-2 flex items-center justify-between border-t border-hairline pt-3">
            <dt className="text-[14px] font-semibold text-ink">Ongkir</dt>
            <dd className="font-mono text-[16px] font-extrabold text-brand">
              {formatPrice(rate.price)}
            </dd>
          </div>
        </dl>
      )}
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}): React.JSX.Element {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5">
      <dt className="text-[13px] text-muted">{label}</dt>
      <dd className="text-right text-[13.5px] font-semibold text-ink">{value}</dd>
    </div>
  );
}

function Notice({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: "truck" | "loading";
}): React.JSX.Element {
  return (
    <div className="flex items-center gap-2.5 rounded-btn bg-surface-soft px-3.5 py-3 text-[13px] text-muted">
      {icon === "loading" ? (
        <Loader2 className="h-4 w-4 flex-none animate-spin" />
      ) : (
        <Truck className="h-4 w-4 flex-none" />
      )}
      {children}
    </div>
  );
}

function Warning({
  children,
  onRetry,
}: {
  children: React.ReactNode;
  onRetry?: () => void;
}): React.JSX.Element {
  return (
    <div className="rounded-btn border border-warning-subtle bg-warning-subtle px-3.5 py-3">
      <p className="text-[13px] font-semibold text-warning-fg">{children}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2.5 inline-flex h-9 items-center gap-1.5 rounded-btn border border-hairline bg-white px-3 text-[12.5px] font-semibold text-ink hover:border-border-strong"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Coba hitung lagi
        </button>
      )}
    </div>
  );
}
