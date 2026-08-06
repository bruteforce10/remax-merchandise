"use client";

import { Loader2, RefreshCw, Truck } from "lucide-react";
import * as React from "react";

import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

import type { UseShippingResult } from "@/hooks/useShipping";

interface CourierSelectorProps {
  shipping: UseShippingResult;
  disabled: boolean;
}

/** Courier-rate picker shown after the customer chooses a shippable village. */
export function CourierSelector({
  shipping,
  disabled,
}: CourierSelectorProps): React.JSX.Element {
  const {
    rates,
    ratesStatus,
    selectedCourier,
    selectCourier,
    quote,
    weightGrams,
    destinationLabel,
    error,
  } = shipping;

  return (
    <div className="rounded-card border border-hairline bg-white p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-ink">Pengiriman JNE Express</h3>
          <p className="mt-1 text-[13px] text-muted">
            Ongkir JNE dihitung otomatis berdasarkan alamat tujuan dan total berat.
          </p>
        </div>
        <button
          type="button"
          onClick={quote}
          disabled={disabled || ratesStatus === "loading"}
          className="inline-flex h-10 items-center gap-2 rounded-btn border border-hairline bg-white px-3.5 text-[13px] font-semibold text-ink hover:border-border-strong disabled:cursor-not-allowed disabled:opacity-50"
        >
          {ratesStatus === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Hitung ulang
        </button>
      </div>

      {!destinationLabel ? (
        <EmptyState text="Lengkapi alamat pengiriman untuk melihat ongkir." />
      ) : ratesStatus === "loading" ? (
        <EmptyState
          icon="loading"
          text="Menghitung ongkir JNE Express…"
        />
      ) : ratesStatus === "error" ? (
        <div className="rounded-btn border border-warning-subtle bg-warning-subtle px-3.5 py-3 text-[13px] font-semibold text-warning-fg">
          {error || "Ongkir belum bisa dihitung otomatis. Tim akan konfirmasi manual via WhatsApp."}
        </div>
      ) : ratesStatus === "empty" ? (
        <div className="rounded-btn border border-warning-subtle bg-warning-subtle px-3.5 py-3 text-[13px] font-semibold text-warning-fg">
          JNE Express belum tersedia otomatis untuk tujuan ini. Tim akan konfirmasi ongkir manual via WhatsApp.
        </div>
      ) : rates.length === 0 ? (
        <EmptyState text="Pilih kelurahan/desa tujuan untuk memuat ongkir JNE Express." />
      ) : (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {rates.map((rate) => {
            const active = selectedCourier?.courierCode === rate.courierCode;
            return (
              <button
                key={rate.courierCode}
                type="button"
                onClick={() => selectCourier(rate)}
                className={cn(
                  "rounded-btn border p-3.5 text-left transition-colors",
                  active
                    ? "border-brand bg-brand-subtle-2"
                    : "border-hairline bg-white hover:border-border-strong",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[14px] font-semibold text-ink">
                      {rate.courierName}
                    </div>
                    <div className="mt-1 text-[12.5px] text-muted">
                      {rate.estimation ? `Estimasi ${rate.estimation}` : "Estimasi mengikuti kurir"}
                    </div>
                  </div>
                  <div className="font-mono text-[15px] font-extrabold text-brand">
                    {formatPrice(rate.price)}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {weightGrams > 0 && (
        <p className="mt-3 text-[12px] text-muted-soft">
          Berat kiriman dihitung sistem: {(weightGrams / 1000).toFixed(2)} kg.
        </p>
      )}
    </div>
  );
}

function EmptyState({
  text,
  icon = "truck",
}: {
  text: string;
  icon?: "truck" | "loading";
}): React.JSX.Element {
  return (
    <div className="flex items-center gap-2.5 rounded-btn bg-surface-soft px-3.5 py-3 text-[13px] text-muted">
      {icon === "loading" ? (
        <Loader2 className="h-4 w-4 flex-none animate-spin" />
      ) : (
        <Truck className="h-4 w-4 flex-none" />
      )}
      {text}
    </div>
  );
}
