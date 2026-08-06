"use client";

import * as React from "react";
import { toast } from "sonner";

import { advanceOrder } from "@/actions/orders";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types/order";

export type AdvanceTarget = "processing" | "shipped" | "completed" | "rejected";

interface TargetMeta {
  title: string;
  subtitle: string;
  cta: string;
  variant: "brand" | "danger";
  ship?: boolean;
}

const TARGET_META: Record<AdvanceTarget, TargetMeta> = {
  processing: {
    title: "Proses Pesanan",
    subtitle: "Tandai pesanan mulai diproses / diproduksi.",
    cta: "Tandai Diproses",
    variant: "brand",
  },
  shipped: {
    title: "Kirim Pesanan",
    subtitle: "Masukkan kurir & nomor resi. Customer otomatis dikirimi email.",
    cta: "Tandai Dikirim",
    variant: "brand",
    ship: true,
  },
  completed: {
    title: "Selesaikan Pesanan",
    subtitle: "Tandai pesanan telah diterima customer.",
    cta: "Tandai Selesai",
    variant: "brand",
  },
  rejected: {
    title: "Tolak Pesanan",
    subtitle: "Pesanan akan ditolak. Stok tidak berubah.",
    cta: "Tolak Pesanan",
    variant: "danger",
  },
};

const FIELD =
  "w-full rounded-btn border border-admin-border bg-white px-3 py-2 text-[14px] text-ink focus:border-brand focus:outline-none";

interface AdvanceOrderDialogProps {
  order: Order | null;
  target: AdvanceTarget | null;
  onClose: () => void;
  onDone: (
    orderId: string,
    patch: { status: OrderStatus; resi: string; courier: string },
  ) => void;
}

export function AdvanceOrderDialog({
  order,
  target,
  onClose,
  onDone,
}: AdvanceOrderDialogProps): React.ReactNode {
  const [note, setNote] = React.useState("");
  const [resi, setResi] = React.useState("");
  const [courier, setCourier] = React.useState<string>("JNE Express");
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (order && target) {
      setNote("");
      setResi(order.resi ?? "");
      setCourier("JNE Express");
      setBusy(false);
    }
  }, [order, target]);

  const meta = target ? TARGET_META[target] : null;
  const shipInvalid = meta?.ship
    ? resi.trim().length === 0 || courier.trim().length === 0
    : false;

  async function submit(): Promise<void> {
    if (!order || !target || busy) return;
    setBusy(true);
    const res = await advanceOrder(order.id, target, {
      note,
      resi: meta?.ship ? resi : "",
      courier: meta?.ship ? courier : "",
    });
    if (res.success) {
      onDone(order.id, {
        status: target,
        resi: meta?.ship ? resi.trim() : order.resi,
        courier: meta?.ship ? courier.trim() : order.courier,
      });
      toast.success(res.message);
      onClose();
    } else {
      toast.error(res.message);
      setBusy(false);
    }
  }

  return (
    <Drawer
      open={Boolean(order && target)}
      onClose={onClose}
      ariaLabel={meta?.title}
      widthClassName="w-[min(92vw,420px)]"
    >
      {order && meta ? (
        <>
          <div className="border-b border-admin-border px-5 py-4">
            <div className="font-mono text-[11px] font-bold text-gray-400">
              #{order.ref}
            </div>
            <h2 className="mt-0.5 text-[17px] font-semibold text-ink">
              {meta.title}
            </h2>
            <p className="mt-1 text-[13px] text-gray-500">{meta.subtitle}</p>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {meta.ship && (
              <div className="mb-4 flex flex-col gap-3">
                <div className="rounded-btn bg-admin-bg px-3 py-2 text-[13px] text-gray-600">
                  Kurir pengiriman: <span className="font-semibold text-ink">JNE Express</span>
                </div>
                <label className="block">
                  <span className="mb-1 block text-[12.5px] font-semibold text-gray-600">
                    Nomor Resi
                  </span>
                  <input
                    className={FIELD}
                    value={resi}
                    onChange={(e) => setResi(e.target.value)}
                    placeholder="mis. JP1234567890"
                  />
                </label>
              </div>
            )}
            <label className="block">
              <span className="mb-1 block text-[12.5px] font-semibold text-gray-600">
                Keterangan {meta.ship ? "" : "(opsional)"}
              </span>
              <textarea
                className={cn(FIELD, "min-h-[90px] resize-y")}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Catatan yang akan dilihat customer di halaman lacak…"
              />
            </label>
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
              variant={meta.variant}
              size="sm"
              onClick={() => void submit()}
              disabled={busy || shipInvalid}
              className="flex-1"
            >
              {busy ? "Menyimpan…" : meta.cta}
            </Button>
          </div>
        </>
      ) : null}
    </Drawer>
  );
}
