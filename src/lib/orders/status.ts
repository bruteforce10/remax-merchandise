import type { OrderStatus } from "@/types/order";

/**
 * Single source of truth for the 6-stage order workflow: labels, the linear
 * progress track, allowed next stage, courier list, and the tracking URL.
 * Shared by the admin panel, the customer account page, and the /lacak page.
 */

export type StatusTone = "pending" | "progress" | "success" | "danger";

interface StatusMeta {
  /** Full customer-facing Indonesian label. */
  label: string;
  /** Short label for badges / steppers. */
  short: string;
  /** Default keterangan shown on the timeline when the admin left no note. */
  description: string;
  tone: StatusTone;
}

export const ORDER_STATUS_META: Record<OrderStatus, StatusMeta> = {
  pending: {
    label: "Menunggu Konfirmasi",
    short: "Menunggu",
    description: "Pesanan diterima dan menunggu konfirmasi dari tim kami.",
    tone: "pending",
  },
  confirmed: {
    label: "Dikonfirmasi",
    short: "Dikonfirmasi",
    description: "Pesanan dikonfirmasi dan sedang kami siapkan.",
    tone: "progress",
  },
  processing: {
    label: "Sedang Diproses",
    short: "Diproses",
    description: "Barang sedang diproduksi / disiapkan.",
    tone: "progress",
  },
  shipped: {
    label: "Dikirim",
    short: "Dikirim",
    description: "Pesanan sedang dalam perjalanan menuju alamat Anda.",
    tone: "progress",
  },
  completed: {
    label: "Selesai",
    short: "Selesai",
    description: "Pesanan telah selesai. Terima kasih!",
    tone: "success",
  },
  rejected: {
    label: "Ditolak",
    short: "Ditolak",
    description: "Pesanan tidak dapat kami proses.",
    tone: "danger",
  },
};

/** Ordered stages that form the linear progress track (excludes `rejected`). */
export const ORDER_STAGES: readonly OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "completed",
];

/** Position of a status on the progress track (`rejected` -> -1). */
export function stageIndex(status: OrderStatus): number {
  return ORDER_STAGES.indexOf(status);
}

/** The stage an admin can advance this order to next (null = terminal). */
export const NEXT_STAGE: Partial<Record<OrderStatus, OrderStatus>> = {
  confirmed: "processing",
  processing: "shipped",
  shipped: "completed",
};

/** Couriers offered when marking an order shipped. */
export const COURIERS = [
  "JNE",
  "TIKI",
  "J&T Express",
  "SiCepat",
  "AnterAja",
  "POS Indonesia",
  "Gojek",
  "Grab",
  "Lainnya",
] as const;

/**
 * Public tracking URL for a resi. Uses cekresi.com — a multi-courier aggregator
 * that auto-detects the courier — so the link is always valid. Returns null when
 * there is no resi yet.
 */
export function trackingUrl(resi: string): string | null {
  const r = resi.trim();
  if (!r) return null;
  return `https://cekresi.com/?noresi=${encodeURIComponent(r)}`;
}
