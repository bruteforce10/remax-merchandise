/** Operational order model (Supabase `orders` / `order_items`). */
export type OrderStatus = "pending" | "confirmed" | "rejected";

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
}

export interface Order {
  id: string;
  /** Short human reference derived from the id (shown to admin + customer). */
  ref: string;
  sessionId: string;
  customerEmail: string;
  status: OrderStatus;
  totalQty: number;
  estimatedTotal: number;
  createdAt: string;
  items: OrderItem[];
}
