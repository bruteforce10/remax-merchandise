import type { ShippingDestination } from "@/types/shipping";

/** Operational order model (Supabase `orders` / `order_items`). */
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "completed"
  | "rejected";

export interface OrderItem {
  /** Stock-keeping key = variant SKU when set, else product SKU. */
  sku: string;
  productSku: string;
  productSlug: string;
  name: string;
  /** Selected option values, keyed by dimension name (e.g. Warna, Ukuran). */
  options: Record<string, string>;
  qty: number;
  unitPrice: number;
  /** Per-unit shipping weight in grams, snapshotted at order time. */
  weightGrams: number;
}

/** One entry in an order's stage timeline (Supabase `order_status_history`). */
export interface OrderStatusEvent {
  status: OrderStatus;
  /** Optional customer-facing note the admin added at this stage. */
  note: string;
  createdAt: string;
}

export interface Order {
  id: string;
  /** Short human reference derived from the id (shown to admin + customer). */
  ref: string;
  sessionId: string;
  customerEmail: string;
  status: OrderStatus;
  totalQty: number;
  /** Items subtotal in IDR (excludes shipping). */
  estimatedTotal: number;
  /** Shipping cost (ongkir) in IDR — 0 until a destination + courier is chosen. */
  shippingCost: number;
  /** Grand total = estimatedTotal + shippingCost (derived, not stored). */
  grandTotal: number;
  /** Total shipment weight in grams. */
  totalWeightGrams: number;
  /** Courier chosen at checkout, e.g. code "JNE" / service "JNE Express" ("" if none). */
  courierCode: string;
  courierService: string;
  /** Delivery destination captured at checkout (empty strings until provided). */
  destination: ShippingDestination;
  /** Courier tracking number, set when the order is marked shipped ("" if none). */
  resi: string;
  /** Courier name, set when the order is marked shipped ("" if none). */
  courier: string;
  createdAt: string;
  items: OrderItem[];
  /** Stage timeline, oldest first. */
  history: OrderStatusEvent[];
}
