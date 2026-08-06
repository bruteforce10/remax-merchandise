"use client";

import { MapPin, Plus, Star } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

import type { UseShippingResult } from "@/hooks/useShipping";
import type { CustomerAddress } from "@/types/address";

interface CheckoutAddressBookProps {
  addresses: CustomerAddress[];
  selectedId: string;
  mode: "saved" | "new";
  shipping: UseShippingResult;
  onSelect: (id: string) => void;
  onNew: () => void;
}

/** Shopee-like address chooser: saved/default address first, new-address form on demand. */
export function CheckoutAddressBook({
  addresses,
  selectedId,
  mode,
  shipping,
  onSelect,
  onNew,
}: CheckoutAddressBookProps): React.JSX.Element {
  return (
    <div className="rounded-card border border-hairline bg-white p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-ink">Alamat Pengiriman</h3>
          <p className="mt-1 text-[13px] text-muted">
            Pilih alamat tersimpan atau tambah alamat baru.
          </p>
        </div>
        <button
          type="button"
          onClick={onNew}
          className={cn(
            "inline-flex h-10 items-center gap-2 rounded-btn border px-3.5 text-[13px] font-semibold",
            mode === "new"
              ? "border-brand bg-brand-subtle text-brand"
              : "border-hairline bg-white text-ink hover:border-border-strong",
          )}
        >
          <Plus className="h-4 w-4" />
          Alamat Baru
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="flex items-start gap-3 rounded-btn bg-surface-soft px-3.5 py-3 text-[13px] text-muted">
          <MapPin className="mt-0.5 h-4 w-4 flex-none" />
          Belum ada alamat tersimpan. Alamat baru akan otomatis disimpan setelah checkout.
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {addresses.map((address) => {
            const active = mode === "saved" && selectedId === address.id;
            return (
              <button
                key={address.id}
                type="button"
                onClick={() => {
                  shipping.applyDestination(address);
                  onSelect(address.id);
                }}
                className={cn(
                  "rounded-btn border p-3.5 text-left transition-colors",
                  active
                    ? "border-brand bg-brand-subtle-2"
                    : "border-hairline bg-white hover:border-border-strong",
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[14px] font-semibold text-ink">
                    {address.label}
                  </span>
                  {address.isDefault ? (
                    <span className="inline-flex items-center gap-1 rounded-pill bg-brand-subtle px-2 py-0.5 text-[11px] font-semibold text-brand">
                      <Star className="h-3 w-3" />
                      Utama
                    </span>
                  ) : null}
                </div>
                <div className="mt-1 text-[13px] font-semibold text-body">
                  {address.recipientName} · {address.recipientPhone}
                </div>
                <div className="mt-1 text-[12.5px] leading-relaxed text-muted">
                  {address.addressDetail}, {address.villageName}, {address.districtName}, {address.regencyName}, {address.provinceName}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
