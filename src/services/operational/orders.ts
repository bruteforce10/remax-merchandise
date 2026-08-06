import { supabaseAdmin } from "@/lib/supabase/admin";
import type {
  Order,
  OrderItem,
  OrderStatus,
  OrderStatusEvent,
} from "@/types/order";

/** Admin order fetchers (Supabase). Not cached — the admin needs fresh data. */

interface RawOrderItem {
  sku: string;
  product_sku: string | null;
  product_slug: string | null;
  name: string | null;
  options: unknown;
  qty: number;
  unit_price: number;
  weight_grams: number | null;
}

interface RawStatusEvent {
  status: string;
  note: string | null;
  created_at: string;
}

interface RawOrder {
  id: string;
  session_id: string | null;
  customer_email: string | null;
  status: string;
  total_qty: number;
  estimated_total: number;
  shipping_cost: number | null;
  total_weight_grams: number | null;
  courier_code: string | null;
  courier_service: string | null;
  recipient_name: string | null;
  recipient_phone: string | null;
  address_detail: string | null;
  province_code: string | null;
  province_name: string | null;
  regency_code: string | null;
  regency_name: string | null;
  district_code: string | null;
  district_name: string | null;
  village_code: string | null;
  village_name: string | null;
  postal_code: string | null;
  resi: string | null;
  courier: string | null;
  created_at: string;
  order_items: RawOrderItem[] | null;
  order_status_history: RawStatusEvent[] | null;
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
    weightGrams: i.weight_grams ?? 0,
  };
}

function mapEvent(e: RawStatusEvent): OrderStatusEvent {
  return {
    status: e.status as OrderStatus,
    note: e.note ?? "",
    createdAt: e.created_at,
  };
}

function mapOrder(o: RawOrder): Order {
  const estimatedTotal = o.estimated_total;
  const shippingCost = o.shipping_cost ?? 0;
  return {
    id: o.id,
    ref: orderRef(o.id),
    sessionId: o.session_id ?? "",
    customerEmail: o.customer_email ?? "",
    status: o.status as OrderStatus,
    totalQty: o.total_qty,
    estimatedTotal,
    shippingCost,
    grandTotal: estimatedTotal + shippingCost,
    totalWeightGrams: o.total_weight_grams ?? 0,
    courierCode: o.courier_code ?? "",
    courierService: o.courier_service ?? "",
    destination: {
      recipientName: o.recipient_name ?? "",
      recipientPhone: o.recipient_phone ?? "",
      addressDetail: o.address_detail ?? "",
      provinceCode: o.province_code ?? "",
      provinceName: o.province_name ?? "",
      regencyCode: o.regency_code ?? "",
      regencyName: o.regency_name ?? "",
      districtCode: o.district_code ?? "",
      districtName: o.district_name ?? "",
      villageCode: o.village_code ?? "",
      villageName: o.village_name ?? "",
      postalCode: o.postal_code ?? "",
    },
    resi: o.resi ?? "",
    courier: o.courier ?? "",
    createdAt: o.created_at,
    items: (o.order_items ?? []).map(mapItem),
    history: (o.order_status_history ?? [])
      .map(mapEvent)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
  };
}

const ORDER_SELECT =
  "id, session_id, customer_email, status, total_qty, estimated_total, shipping_cost, total_weight_grams, courier_code, courier_service, recipient_name, recipient_phone, address_detail, province_code, province_name, regency_code, regency_name, district_code, district_name, village_code, village_name, postal_code, resi, courier, created_at, order_items ( sku, product_sku, product_slug, name, options, qty, unit_price, weight_grams ), order_status_history ( status, note, created_at )";

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

/** A single order by full id (admin PDF route). */
export async function getOrderById(id: string): Promise<Order | null> {
  if (!id) return null;
  try {
    const { data, error } = await supabaseAdmin()
      .from("orders")
      .select(ORDER_SELECT)
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? mapOrder(data as RawOrder) : null;
  } catch (error) {
    console.error("getOrderById failed:", error);
    return null;
  }
}

/** A single order by its short human ref (public /lacak/<ref> tracking page). */
export async function getOrderByRef(ref: string): Promise<Order | null> {
  const clean = ref.trim();
  if (!clean) return null;
  try {
    const db = supabaseAdmin();
    const { data: id, error } = await db.rpc("order_id_by_ref", {
      p_ref: clean,
    });
    if (error) throw error;
    if (!id) return null;
    return await getOrderById(id as string);
  } catch (error) {
    console.error("getOrderByRef failed:", error);
    return null;
  }
}
