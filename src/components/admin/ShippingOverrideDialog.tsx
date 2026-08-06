"use client";

import * as React from "react";
import { toast } from "sonner";

import { updateOrderShipping } from "@/actions/orders";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { formatPrice } from "@/lib/format";

import type { Order } from "@/types/order";

const FIELD =
  "w-full rounded-btn border border-admin-border bg-white px-3 py-2 text-[14px] text-ink focus:border-brand focus:outline-none";

interface ShippingOverrideDialogProps {
  order: Order | null;
  onClose: () => void;
  onDone: (orderId: string, patch: Partial<Order>) => void;
}

/** Admin override for checkout-selected ongkir/courier before order completion. */
export function ShippingOverrideDialog({
  order,
  onClose,
  onDone,
}: ShippingOverrideDialogProps): React.ReactNode {
  const [shippingCost, setShippingCost] = React.useState("");
  const [note, setNote] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (!order) return;
    setShippingCost(String(order.shippingCost));
    setNote("");
    setBusy(false);
  }, [order]);

  async function submit(): Promise<void> {
    if (!order || busy) return;
    const value = parseInt(shippingCost, 10) || 0;
    setBusy(true);
    const res = await updateOrderShipping(order.id, {
      shippingCost: value,
      courierCode: "JNE",
      courierService: "JNE Express",
      note,
    });
    if (!res.success) {
      toast.error(res.message);
      setBusy(false);
      return;
    }
    onDone(order.id, {
      shippingCost: value,
      grandTotal: order.estimatedTotal + value,
      courierCode: "JNE",
      courierService: "JNE Express",
    });
    toast.success(res.message);
    onClose();
  }

  return (
    <Drawer
      open={Boolean(order)}
      onClose={onClose}
      ariaLabel="Ubah Ongkir"
      widthClassName="w-[min(92vw,420px)]"
    >
      {order ? (
        <>
          <div className="border-b border-admin-border px-5 py-4">
            <div className="font-mono text-[11px] font-bold text-gray-400">
              #{order.ref}
            </div>
            <h2 className="mt-0.5 text-[17px] font-semibold text-ink">
              Ubah Ongkir
            </h2>
            <p className="mt-1 text-[13px] text-gray-500">
              Subtotal {formatPrice(order.estimatedTotal)} · current total {formatPrice(order.grandTotal)}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            <div className="flex flex-col gap-3">
              <label className="block">
                <span className="mb-1 block text-[12.5px] font-semibold text-gray-600">
                  Ongkir (Rp)
                </span>
                <input
                  className={`${FIELD} font-mono`}
                  value={shippingCost}
                  onChange={(e) => setShippingCost(e.target.value.replace(/\D/g, ""))}
                  inputMode="numeric"
                  placeholder="0"
                />
              </label>
              <div className="rounded-btn bg-admin-bg px-3 py-2 text-[13px] text-gray-600">
                Kurir dikunci ke <span className="font-semibold text-ink">JNE Express</span>.
              </div>
              <label className="block">
                <span className="mb-1 block text-[12.5px] font-semibold text-gray-600">
                  Catatan update (opsional)
                </span>
                <textarea
                  className={`${FIELD} min-h-[90px] resize-y`}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Catatan yang dilihat customer di timeline…"
                />
              </label>
            </div>
          </div>

          <div className="flex gap-2 border-t border-admin-border px-5 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={busy}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              variant="brand"
              size="sm"
              onClick={() => void submit()}
              disabled={busy}
              className="flex-1"
            >
              {busy ? "Menyimpan…" : "Simpan Ongkir"}
            </Button>
          </div>
        </>
      ) : null}
    </Drawer>
  );
}
