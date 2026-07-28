"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

import { isAdminEmail } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/action";

const orderItemSchema = z.object({
  sku: z.string().trim().min(1),
  productSku: z.string().trim().min(1),
  productSlug: z.string().default(""),
  name: z.string().default(""),
  options: z.record(z.string(), z.string()).default({}),
  qty: z.number().int().min(1),
  unitPrice: z.number().int().min(0).default(0),
});

const createOrderSchema = z.object({
  sessionId: z.string().default(""),
  items: z.array(orderItemSchema).min(1, "Keranjang kosong"),
});

export type CreateOrderInput = z.input<typeof createOrderSchema>;

/** Short human-friendly order reference from a UUID. */
function orderRef(id: string): string {
  return id.replace(/-/g, "").slice(0, 8).toUpperCase();
}

/**
 * Record a pending order from the cart when a logged-in customer checks out.
 * Does NOT decrement stock — that happens on admin confirmation.
 */
export async function createOrder(
  input: CreateOrderInput,
): Promise<ActionResult<{ orderId: string; ref: string }>> {
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

  const { sessionId, items } = parsed.data;
  const totalQty = items.reduce((sum, i) => sum + i.qty, 0);
  const estimatedTotal = items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);

  try {
    const db = supabaseAdmin();
    const { data: order, error: orderError } = await db
      .from("orders")
      .insert({
        session_id: sessionId,
        customer_email: user.email,
        status: "pending",
        total_qty: totalQty,
        estimated_total: estimatedTotal,
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
      })),
    );
    if (itemsError) throw itemsError;

    revalidatePath("/admin/orders");
    return {
      success: true,
      data: { orderId, ref: orderRef(orderId) },
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

/** Admin: atomically decrement stock and confirm, or block with the shortfalls. */
export async function confirmOrder(orderId: string): Promise<ActionResult> {
  if (!(await isAdminRequest())) {
    return { success: false, data: null, message: "Tidak diizinkan" };
  }
  try {
    const { data, error } = await supabaseAdmin().rpc("confirm_order", {
      p_order_id: orderId,
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

/** Admin: reject a pending order (no stock change). */
export async function rejectOrder(orderId: string): Promise<ActionResult> {
  if (!(await isAdminRequest())) {
    return { success: false, data: null, message: "Tidak diizinkan" };
  }
  try {
    const { error } = await supabaseAdmin()
      .from("orders")
      .update({ status: "rejected" })
      .eq("id", orderId)
      .eq("status", "pending");
    if (error) throw error;
    revalidatePath("/admin/orders");
    return { success: true, data: null, message: "Pesanan ditolak" };
  } catch (error) {
    console.error("rejectOrder failed:", error);
    return { success: false, data: null, message: "Gagal menolak pesanan" };
  }
}
