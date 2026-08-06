"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

import { isAdminEmail } from "@/lib/auth";
import { sendOrderStatusEmail } from "@/lib/email/orderEmails";
import { getShippingRates } from "@/lib/shipping/cost";
import {
  isShippingConfigured,
  shipDefaultWeightGrams,
  shipOriginVillageCode,
} from "@/lib/shipping/env";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getOrderById } from "@/services/operational/orders";
import type { ActionResult } from "@/types/action";
import type { OrderStatus } from "@/types/order";

const orderItemSchema = z.object({
  sku: z.string().trim().min(1),
  productSku: z.string().trim().min(1),
  productSlug: z.string().default(""),
  name: z.string().default(""),
  options: z.record(z.string(), z.string()).default({}),
  qty: z.number().int().min(1),
  unitPrice: z.number().int().min(0).default(0),
});

const destinationSchema = z.object({
  recipientName: z.string().trim().min(1, "Nama penerima wajib diisi"),
  recipientPhone: z.string().trim().min(6, "No. HP penerima wajib diisi").max(30),
  addressDetail: z.string().trim().min(1, "Alamat lengkap wajib diisi"),
  provinceCode: z.string().trim().min(1, "Provinsi wajib dipilih"),
  provinceName: z.string().trim().default(""),
  regencyCode: z.string().trim().min(1, "Kota/Kabupaten wajib dipilih"),
  regencyName: z.string().trim().default(""),
  districtCode: z.string().trim().min(1, "Kecamatan wajib dipilih"),
  districtName: z.string().trim().default(""),
  villageCode: z.string().trim().min(1, "Kelurahan/Desa wajib dipilih"),
  villageName: z.string().trim().default(""),
  postalCode: z.string().trim().default(""),
});

const createOrderSchema = z.object({
  sessionId: z.string().default(""),
  items: z.array(orderItemSchema).min(1, "Keranjang kosong"),
  destination: destinationSchema,
  /** Courier chosen at checkout (code + display service); "" = quote manually. */
  courierCode: z.string().trim().default(""),
  courierService: z.string().trim().default(""),
});

export type CreateOrderInput = z.input<typeof createOrderSchema>;

interface CreateOrderResult {
  orderId: string;
  ref: string;
  shippingCost: number;
  grandTotal: number;
  courierService: string;
}

/** Short human-friendly order reference from a UUID. */
function orderRef(id: string): string {
  return id.replace(/-/g, "").slice(0, 8).toUpperCase();
}

async function autoSaveCheckoutAddress(
  db: ReturnType<typeof supabaseAdmin>,
  userId: string,
  email: string,
  destination: z.output<typeof destinationSchema>,
): Promise<void> {
  try {
    const { data: existing, error: findError } = await db
      .from("customer_addresses")
      .select("id, is_default")
      .eq("user_id", userId)
      .eq("recipient_name", destination.recipientName)
      .eq("recipient_phone", destination.recipientPhone)
      .eq("address_detail", destination.addressDetail)
      .eq("village_code", destination.villageCode)
      .limit(1)
      .maybeSingle();
    if (findError) throw findError;

    if (existing?.id) {
      await db
        .from("customer_addresses")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", existing.id as string)
        .eq("user_id", userId);
      return;
    }

    const { count, error: countError } = await db
      .from("customer_addresses")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);
    if (countError) throw countError;

    await db.from("customer_addresses").insert({
      user_id: userId,
      customer_email: email,
      label: "Alamat Pengiriman",
      recipient_name: destination.recipientName,
      recipient_phone: destination.recipientPhone,
      address_detail: destination.addressDetail,
      province_code: destination.provinceCode,
      province_name: destination.provinceName,
      regency_code: destination.regencyCode,
      regency_name: destination.regencyName,
      district_code: destination.districtCode,
      district_name: destination.districtName,
      village_code: destination.villageCode,
      village_name: destination.villageName,
      postal_code: destination.postalCode,
      is_default: (count ?? 0) === 0,
    });
  } catch (error) {
    console.error("autoSaveCheckoutAddress failed:", error);
  }
}

/**
 * Record a pending order from the cart when a logged-in customer checks out.
 * Does NOT decrement stock — that happens on admin confirmation.
 */
export async function createOrder(
  input: CreateOrderInput,
): Promise<ActionResult<CreateOrderResult>> {
  const parsed = createOrderSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      data: null,
      message: parsed.error.issues[0]?.message ?? "Data pesanan tidak valid",
    };
  }

  // Only authenticated customers may check out (mirrors the cart login gate).
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return { success: false, data: null, message: "Silakan login untuk checkout" };
  }

  const { sessionId, items, destination, courierCode } = parsed.data;
  if (courierCode && courierCode !== "JNE") {
    return { success: false, data: null, message: "Kurir hanya tersedia JNE Express" };
  }
  const totalQty = items.reduce((sum, i) => sum + i.qty, 0);
  const estimatedTotal = items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
  const fallbackWeight = shipDefaultWeightGrams();

  try {
    const db = supabaseAdmin();

    // Pre-flight: cek stok + ambil berat per SKU (untuk ongkir) sebelum order
    // dibuat. SKU tanpa row di inventory (produk non-tracked) dibiarkan lolos.
    const skus = items.map((i) => i.sku);
    const { data: invRows, error: invErr } = await db
      .from("inventory")
      .select("sku, stock, weight_grams")
      .in("sku", skus);
    if (invErr) throw invErr;

    const invMap = Object.fromEntries(
      (invRows ?? []).map((r) => [r.sku as string, r.stock as number]),
    );
    const weightMap = Object.fromEntries(
      (invRows ?? []).map((r) => [
        r.sku as string,
        (r.weight_grams as number | null) ?? 0,
      ]),
    );
    const shortfalls = items.filter(
      (item) => item.sku in invMap && invMap[item.sku] < item.qty,
    );
    if (shortfalls.length > 0) {
      const detail = shortfalls
        .map((i) => `${i.name} (diminta ${i.qty}, tersisa ${invMap[i.sku]})`)
        .join("; ");
      return { success: false, data: null, message: `Stok tidak mencukupi: ${detail}` };
    }

    // Per-unit weight (grams), with the global fallback for missing/zero values.
    const unitWeight = (sku: string): number => weightMap[sku] || fallbackWeight;
    const totalWeightGrams = items.reduce(
      (sum, i) => sum + unitWeight(i.sku) * i.qty,
      0,
    );

    // Verify ongkir against the API for the chosen courier and store the
    // AUTHORITATIVE price — never a client-sent value. If shipping is
    // unconfigured or no courier was chosen, shipping stays 0 (team quotes it via
    // WhatsApp); a chosen-but-unverifiable courier is rejected so the customer
    // re-picks rather than being charged a stale/tampered rate.
    let shippingCost = 0;
    let courierService = parsed.data.courierService;
    if (courierCode && isShippingConfigured()) {
      const rates = await getShippingRates({
        originVillageCode: shipOriginVillageCode(),
        destinationVillageCode: destination.villageCode,
        weightGrams: totalWeightGrams,
      });
      const rate = rates.find((r) => r.courierCode === courierCode);
      if (!rate) {
        return {
          success: false,
          data: null,
          message: "Ongkir gagal diverifikasi. Silakan pilih ulang kurir pengiriman.",
        };
      }
      shippingCost = rate.price;
      courierService = rate.courierName;
    }

    const { data: order, error: orderError } = await db
      .from("orders")
      .insert({
        session_id: sessionId,
        customer_email: user.email,
        status: "pending",
        total_qty: totalQty,
        estimated_total: estimatedTotal,
        shipping_cost: shippingCost,
        total_weight_grams: totalWeightGrams,
        courier_code: courierCode || null,
        courier_service: courierService || null,
        recipient_name: destination.recipientName,
        recipient_phone: destination.recipientPhone,
        address_detail: destination.addressDetail,
        province_code: destination.provinceCode,
        province_name: destination.provinceName,
        regency_code: destination.regencyCode,
        regency_name: destination.regencyName,
        district_code: destination.districtCode,
        district_name: destination.districtName,
        village_code: destination.villageCode,
        village_name: destination.villageName,
        postal_code: destination.postalCode,
      })
      .select("id")
      .single();
    if (orderError || !order) throw orderError ?? new Error("insert failed");

    const orderId = order.id as string;
    const { error: itemsError } = await db.from("order_items").insert(
      items.map((i) => ({
        order_id: orderId,
        sku: i.sku,
        product_sku: i.productSku,
        product_slug: i.productSlug,
        name: i.name,
        options: i.options,
        qty: i.qty,
        unit_price: i.unitPrice,
        weight_grams: unitWeight(i.sku),
      })),
    );
    if (itemsError) throw itemsError;

    // Auto-save checkout address into the customer's address book (best-effort),
    // so future checkouts can pick it like a marketplace address selector.
    await autoSaveCheckoutAddress(db, user.id, user.email, destination);

    // Seed the stage timeline with the initial "pending" entry (best-effort).
    try {
      await db
        .from("order_status_history")
        .insert({ order_id: orderId, status: "pending" });
    } catch (histError) {
      console.error("order history seed failed:", histError);
    }

    // Bump the checkout funnel counter per product (best-effort — an isolated
    // try/catch so a tracking failure can never fail the order).
    try {
      const slugs = [...new Set(items.map((i) => i.productSlug).filter(Boolean))];
      await Promise.all(
        slugs.map((slug) =>
          db.rpc("bump_product_stat", { p_slug: slug, p_kind: "checkout" }),
        ),
      );
    } catch (statError) {
      console.error("checkout stat bump failed:", statError);
    }

    revalidatePath("/admin/orders");
    return {
      success: true,
      data: {
        orderId,
        ref: orderRef(orderId),
        shippingCost,
        grandTotal: estimatedTotal + shippingCost,
        courierService,
      },
      message: "Pesanan tercatat",
    };
  } catch (error) {
    console.error("createOrder failed:", error);
    return { success: false, data: null, message: "Gagal menyimpan pesanan. Coba lagi." };
  }
}

interface ConfirmResult {
  ok: boolean;
  error?: string;
  items?: { sku: string; name: string; requested: number; available: number }[];
}

async function isAdminRequest(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return isAdminEmail(user?.email);
}

/** Fetch the fresh order and email the customer about a status change (best-effort). */
async function notifyStatus(orderId: string, status: OrderStatus): Promise<void> {
  try {
    const order = await getOrderById(orderId);
    if (order) await sendOrderStatusEmail(order, status);
  } catch (error) {
    console.error("order status email failed:", error);
  }
}

/** Admin: atomically decrement stock and confirm, or block with the shortfalls. */
export async function confirmOrder(
  orderId: string,
  note = "",
): Promise<ActionResult> {
  if (!(await isAdminRequest())) {
    return { success: false, data: null, message: "Tidak diizinkan" };
  }
  try {
    const { data, error } = await supabaseAdmin().rpc("confirm_order", {
      p_order_id: orderId,
      p_note: note,
    });
    if (error) throw error;
    const result = data as ConfirmResult;
    if (!result.ok) {
      if (result.error === "insufficient" && result.items) {
        const detail = result.items
          .map((i) => `${i.name} (minta ${i.requested}, sisa ${i.available})`)
          .join("; ");
        return { success: false, data: null, message: `Stok tidak cukup: ${detail}` };
      }
      if (result.error === "not_pending") {
        return { success: false, data: null, message: "Pesanan sudah diproses" };
      }
      return { success: false, data: null, message: "Pesanan tidak ditemukan" };
    }
    revalidateTag("inventory");
    revalidatePath("/admin/orders");
    revalidatePath("/admin/products");
    await notifyStatus(orderId, "confirmed");
    return {
      success: true,
      data: null,
      message: "Pesanan dikonfirmasi, stok dikurangi",
    };
  } catch (error) {
    console.error("confirmOrder failed:", error);
    return { success: false, data: null, message: "Gagal mengonfirmasi pesanan" };
  }
}

const advanceSchema = z.object({
  note: z.string().trim().max(500).default(""),
  resi: z.string().trim().max(100).default(""),
  courier: z.string().trim().max(100).default(""),
});
export type AdvanceOrderInput = z.input<typeof advanceSchema>;

const updateShippingSchema = z.object({
  shippingCost: z.number().int().min(0),
  courierCode: z.string().trim().max(60).default(""),
  courierService: z.string().trim().max(100).default(""),
  note: z.string().trim().max(500).default(""),
});
export type UpdateOrderShippingInput = z.input<typeof updateShippingSchema>;

interface UpdateShippingResult {
  ok: boolean;
  error?: string;
}

/** Admin: override an order's chosen courier / shipping cost before completion. */
export async function updateOrderShipping(
  orderId: string,
  input: UpdateOrderShippingInput,
): Promise<ActionResult> {
  if (!(await isAdminRequest())) {
    return { success: false, data: null, message: "Tidak diizinkan" };
  }
  const parsed = updateShippingSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, data: null, message: "Data ongkir tidak valid" };
  }

  try {
    const { shippingCost, note } = parsed.data;
    const { data, error } = await supabaseAdmin().rpc("update_order_shipping", {
      p_order_id: orderId,
      p_shipping_cost: shippingCost,
      p_courier_code: "JNE",
      p_courier_service: "JNE Express",
      p_note: note,
    });
    if (error) throw error;
    const result = data as UpdateShippingResult;
    if (!result.ok) {
      if (result.error === "locked") {
        return { success: false, data: null, message: "Pesanan sudah final" };
      }
      return { success: false, data: null, message: "Pesanan tidak ditemukan" };
    }
    revalidatePath("/admin/orders");
    return { success: true, data: null, message: "Ongkir diperbarui" };
  } catch (error) {
    console.error("updateOrderShipping failed:", error);
    return { success: false, data: null, message: "Gagal memperbarui ongkir" };
  }
}

interface AdvanceResult {
  ok: boolean;
  error?: string;
}

const ADVANCEABLE: ReadonlySet<OrderStatus> = new Set<OrderStatus>([
  "processing",
  "shipped",
  "completed",
  "rejected",
]);

const ADVANCE_MESSAGE: Partial<Record<OrderStatus, string>> = {
  processing: "Pesanan masuk tahap diproses",
  shipped: "Pesanan ditandai dikirim",
  completed: "Pesanan ditandai selesai",
  rejected: "Pesanan ditolak",
};

/**
 * Admin: move an order to the next stage (processing / shipped / completed) or
 * reject a pending order, logging an optional customer-facing note. Shipping
 * requires a courier + resi and emails the customer the tracking details.
 */
export async function advanceOrder(
  orderId: string,
  toStatus: OrderStatus,
  input: AdvanceOrderInput = {},
): Promise<ActionResult> {
  if (!(await isAdminRequest())) {
    return { success: false, data: null, message: "Tidak diizinkan" };
  }
  if (!ADVANCEABLE.has(toStatus)) {
    return { success: false, data: null, message: "Transisi status tidak valid" };
  }
  const parsed = advanceSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, data: null, message: "Data tidak valid" };
  }
  const { note, resi, courier } = parsed.data;
  if (toStatus === "shipped" && (!resi || !courier)) {
    return {
      success: false,
      data: null,
      message: "Kurir dan nomor resi wajib diisi",
    };
  }
  try {
    const { data, error } = await supabaseAdmin().rpc("advance_order", {
      p_order_id: orderId,
      p_status: toStatus,
      p_note: note,
      p_resi: resi || null,
      p_courier: courier || null,
    });
    if (error) throw error;
    const result = data as AdvanceResult;
    if (!result.ok) {
      if (result.error === "resi_required") {
        return { success: false, data: null, message: "Kurir dan nomor resi wajib diisi" };
      }
      if (result.error === "invalid_transition") {
        return { success: false, data: null, message: "Status sudah berubah, muat ulang halaman" };
      }
      if (result.error === "not_found") {
        return { success: false, data: null, message: "Pesanan tidak ditemukan" };
      }
      return { success: false, data: null, message: "Gagal memperbarui pesanan" };
    }
    revalidatePath("/admin/orders");
    if (toStatus === "shipped") await notifyStatus(orderId, "shipped");
    return {
      success: true,
      data: null,
      message: ADVANCE_MESSAGE[toStatus] ?? "Pesanan diperbarui",
    };
  } catch (error) {
    console.error("advanceOrder failed:", error);
    return { success: false, data: null, message: "Gagal memperbarui pesanan" };
  }
}

/** Admin: reject a pending order (no stock change). */
export async function rejectOrder(
  orderId: string,
  note = "",
): Promise<ActionResult> {
  return advanceOrder(orderId, "rejected", { note });
}
