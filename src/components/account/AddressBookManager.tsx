"use client";

import { MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import {
  deleteCustomerAddress,
  saveCustomerAddress,
  setDefaultCustomerAddress,
} from "@/actions/addresses";
import { ShippingDestinationForm } from "@/components/cart/ShippingDestinationForm";
import { useShipping } from "@/hooks/useShipping";
import { cn } from "@/lib/utils";

import type { CustomerAddress } from "@/types/address";
import type { RegionOption } from "@/types/shipping";

interface AddressBookManagerProps {
  addresses: CustomerAddress[];
  provinces: RegionOption[];
}

/** Customer address book on /account/profile — marketplace-style saved addresses. */
export function AddressBookManager({
  addresses,
  provinces,
}: AddressBookManagerProps): React.JSX.Element {
  const router = useRouter();
  const [editing, setEditing] = React.useState<CustomerAddress | null>(null);
  const [adding, setAdding] = React.useState(addresses.length === 0);
  const [label, setLabel] = React.useState("Alamat");
  const [makeDefault, setMakeDefault] = React.useState(addresses.length === 0);
  const [pending, setPending] = React.useState(false);
  const initial = adding ? null : editing;
  const shipping = useShipping(provinces, [], initial);

  function beginAdd(): void {
    setEditing(null);
    setAdding(true);
    setLabel("Alamat");
    setMakeDefault(addresses.length === 0);
    shipping.resetDestination();
  }

  function beginEdit(address: CustomerAddress): void {
    setEditing(address);
    setAdding(false);
    setLabel(address.label);
    setMakeDefault(address.isDefault);
    shipping.applyDestination(address);
  }

  async function save(): Promise<void> {
    if (!shipping.destination) {
      toast.error("Lengkapi alamat pengiriman");
      return;
    }
    setPending(true);
    const res = await saveCustomerAddress({
      ...shipping.destination,
      id: editing?.id,
      label,
      isDefault: makeDefault,
    });
    setPending(false);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    toast.success(res.message);
    setEditing(null);
    setAdding(false);
    router.refresh();
  }

  async function setDefault(id: string): Promise<void> {
    const res = await setDefaultCustomerAddress(id);
    if (!res.success) toast.error(res.message);
    else {
      toast.success(res.message);
      router.refresh();
    }
  }

  async function removeAddress(id: string): Promise<void> {
    const res = await deleteCustomerAddress(id);
    if (!res.success) toast.error(res.message);
    else {
      toast.success(res.message);
      router.refresh();
    }
  }

  const showForm = adding || editing;

  return (
    <section className="mt-8 border-t border-hairline pt-7">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-ink">Alamat Saya</h2>
          <p className="mt-1 text-[14px] text-muted">
            Simpan alamat untuk checkout berikutnya, seperti address book marketplace.
          </p>
        </div>
        <button
          type="button"
          onClick={beginAdd}
          className="inline-flex h-11 items-center gap-2 rounded-btn border border-hairline bg-white px-4 text-[14px] font-semibold text-ink hover:border-border-strong"
        >
          <Plus className="h-4 w-4" />
          Tambah Alamat
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="rounded-card border border-dashed border-hairline bg-surface-soft px-4 py-6 text-center text-[14px] text-muted">
          <MapPin className="mx-auto mb-2 h-6 w-6 text-muted-soft" />
          Belum ada alamat tersimpan.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="rounded-card border border-hairline bg-white p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="font-semibold text-ink">{address.label}</div>
                    {address.isDefault ? (
                      <span className="inline-flex items-center gap-1 rounded-pill bg-brand-subtle px-2 py-0.5 text-[11px] font-semibold text-brand">
                        <Star className="h-3 w-3" />
                        Utama
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-1 text-[13.5px] font-semibold text-body">
                    {address.recipientName} · {address.recipientPhone}
                  </div>
                  <div className="mt-1 max-w-[62ch] text-[13px] leading-relaxed text-muted">
                    {address.addressDetail}, {address.villageName}, {address.districtName}, {address.regencyName}, {address.provinceName}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {!address.isDefault ? (
                    <SmallButton onClick={() => void setDefault(address.id)}>
                      Jadikan Utama
                    </SmallButton>
                  ) : null}
                  <SmallButton onClick={() => beginEdit(address)}>
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </SmallButton>
                  <SmallButton
                    danger
                    onClick={() => void removeAddress(address.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Hapus
                  </SmallButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm ? (
        <div className="mt-5 rounded-card border border-hairline bg-white p-4">
          <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold text-body">Label alamat</span>
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Rumah / Kantor / Gudang"
                className="h-12 rounded-btn border border-hairline bg-white px-3.5 text-[14.5px] text-ink outline-none focus:border-brand"
              />
            </label>
            <label className="flex items-center gap-2 self-end rounded-btn bg-surface-soft px-3.5 py-3 text-[13px] font-semibold text-body">
              <input
                type="checkbox"
                checked={makeDefault}
                onChange={(e) => setMakeDefault(e.target.checked)}
                className="h-4 w-4 accent-brand"
              />
              Jadikan utama
            </label>
          </div>
          <ShippingDestinationForm shipping={shipping} compact />
          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setAdding(false);
                setEditing(null);
              }}
              className="h-11 rounded-btn border border-hairline bg-white px-4 text-[14px] font-semibold text-ink hover:border-border-strong"
            >
              Batal
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => void save()}
              className="h-11 rounded-btn bg-brand px-5 text-[14px] font-semibold text-white hover:bg-brand-hover disabled:opacity-60"
            >
              {pending ? "Menyimpan…" : "Simpan Alamat"}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function SmallButton({
  children,
  onClick,
  danger = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-btn border border-hairline bg-white px-3 text-[12.5px] font-semibold hover:border-border-strong",
        danger ? "text-danger" : "text-ink",
      )}
    >
      {children}
    </button>
  );
}
