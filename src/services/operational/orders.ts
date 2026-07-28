import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Order, OrderItem, OrderStatus } from "@/types/order";

/** Admin order fetchers (Supabase). Not cached — the admin needs fresh data. */

interface RawOrderItem {
  sku: string;
  product_sku: string | null;
  product_slug: string | null;
  name: string | null;
  options: unknown;
  qty: number;
  unit_price: number;
}

interface RawOrder {
  id: string;
  session_id: string | null;
  customer_email: string | null;
  status: string;
  total_qty: number;
  estimated_total: number;
  created_at: string;
  order_items: RawOrderItem[] | null;
}

function orderRef(id: string): string {
  return id.replace(/-/g, "").slice(0, 8).toUpperCase();
}

function parseOptions(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    result[k] = String(v);
  }
  return result;
}

function mapItem(i: RawOrderItem): OrderItem {
  return {
    sku: i.sku,
    productSku: i.product_sku ?? "",
    productSlug: i.product_slug ?? "",
    name: i.name ?? "",
    options: parseOptions(i.options),
    qty: i.qty,
    unitPrice: i.unit_price,
  };
}

function mapOrder(o: RawOrder): Order {
  return {
    id: o.id,
    ref: orderRef(o.id),
    sessionId: o.session_id ?? "",
    customerEmail: o.customer_email ?? "",
    status: o.status as OrderStatus,
    totalQty: o.total_qty,
    estimatedTotal: o.estimated_total,
    createdAt: o.created_at,
    items: (o.order_items ?? []).map(mapItem),
  };
}

const ORDER_SELECT =
  "id, session_id, customer_email, status, total_qty, estimated_total, created_at, order_items ( sku, product_sku, product_slug, name, options, qty, unit_price )";

export async function getOrders(): Promise<Order[]> {
  try {
    const { data, error } = await supabaseAdmin()
      .from("orders")
      .select(ORDER_SELECT)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return ((data ?? []) as RawOrder[]).map(mapOrder);
  } catch (error) {
    console.error("getOrders failed:", error);
    return [];
  }
}

/** A single customer's own orders, newest first (order-history page). */
export async function getOrdersByEmail(email: string): Promise<Order[]> {
  if (!email) return [];
  try {
    const { data, error } = await supabaseAdmin()
      .from("orders")
      .select(ORDER_SELECT)
      .eq("customer_email", email)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return ((data ?? []) as RawOrder[]).map(mapOrder);
  } catch (error) {
    console.error("getOrdersByEmail failed:", error);
    return [];
  }
}

export async function getPendingOrderCount(): Promise<number> {
  try {
    const { count, error } = await supabaseAdmin()
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending");
    if (error) throw error;
    return count ?? 0;
  } catch (error) {
    console.error("getPendingOrderCount failed:", error);
    return 0;
  }
}
