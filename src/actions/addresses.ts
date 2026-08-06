"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

import type { ActionResult } from "@/types/action";

const addressSchema = z.object({
  id: z.string().uuid().optional(),
  label: z.string().trim().max(60).default("Alamat"),
  recipientName: z.string().trim().min(1, "Nama penerima wajib diisi"),
  recipientPhone: z.string().trim().min(6, "No. HP wajib diisi").max(30),
  addressDetail: z.string().trim().min(1, "Alamat lengkap wajib diisi"),
  provinceCode: z.string().trim().min(1),
  provinceName: z.string().trim().min(1),
  regencyCode: z.string().trim().min(1),
  regencyName: z.string().trim().min(1),
  districtCode: z.string().trim().min(1),
  districtName: z.string().trim().min(1),
  villageCode: z.string().trim().min(1),
  villageName: z.string().trim().min(1),
  postalCode: z.string().trim().default(""),
  isDefault: z.boolean().default(false),
});

export type CustomerAddressInput = z.input<typeof addressSchema>;

type AddressData = z.output<typeof addressSchema>;

function toDb(userId: string, email: string, data: AddressData): Record<string, unknown> {
  return {
    user_id: userId,
    customer_email: email,
    label: data.label || "Alamat",
    recipient_name: data.recipientName,
    recipient_phone: data.recipientPhone,
    address_detail: data.addressDetail,
    province_code: data.provinceCode,
    province_name: data.provinceName,
    regency_code: data.regencyCode,
    regency_name: data.regencyName,
    district_code: data.districtCode,
    district_name: data.districtName,
    village_code: data.villageCode,
    village_name: data.villageName,
    postal_code: data.postalCode,
    is_default: data.isDefault,
    updated_at: new Date().toISOString(),
  };
}

async function currentUser(): Promise<{ id: string; email: string } | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.email ? { id: user.id, email: user.email } : null;
}

/** Create/update a customer's saved delivery address. */
export async function saveCustomerAddress(
  input: CustomerAddressInput,
): Promise<ActionResult<{ id: string }>> {
  const user = await currentUser();
  if (!user) return { success: false, data: null, message: "Silakan login terlebih dahulu" };

  const parsed = addressSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      data: null,
      message: parsed.error.issues[0]?.message ?? "Data alamat tidak valid",
    };
  }

  const db = supabaseAdmin();
  const data = parsed.data;
  try {
    const shouldDefault = data.isDefault;
    if (shouldDefault) {
      const { error } = await db
        .from("customer_addresses")
        .update({ is_default: false })
        .eq("user_id", user.id);
      if (error) throw error;
    }

    if (data.id) {
      const { error } = await db
        .from("customer_addresses")
        .update(toDb(user.id, user.email, data))
        .eq("id", data.id)
        .eq("user_id", user.id);
      if (error) throw error;
      revalidatePath("/account/profile");
      revalidatePath("/cart");
      return { success: true, data: { id: data.id }, message: "Alamat diperbarui" };
    }

    const { count, error: countError } = await db
      .from("customer_addresses")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);
    if (countError) throw countError;

    const payload = toDb(user.id, user.email, {
      ...data,
      isDefault: data.isDefault || (count ?? 0) === 0,
    });
    const { data: inserted, error } = await db
      .from("customer_addresses")
      .insert(payload)
      .select("id")
      .single();
    if (error || !inserted) throw error ?? new Error("insert failed");
    revalidatePath("/account/profile");
    revalidatePath("/cart");
    return {
      success: true,
      data: { id: inserted.id as string },
      message: "Alamat disimpan",
    };
  } catch (error) {
    console.error("saveCustomerAddress failed:", error);
    return { success: false, data: null, message: "Gagal menyimpan alamat" };
  }
}

/** Set one saved address as default. */
export async function setDefaultCustomerAddress(id: string): Promise<ActionResult> {
  const user = await currentUser();
  if (!user) return { success: false, data: null, message: "Silakan login terlebih dahulu" };
  try {
    const db = supabaseAdmin();
    const { error: clearError } = await db
      .from("customer_addresses")
      .update({ is_default: false })
      .eq("user_id", user.id);
    if (clearError) throw clearError;
    const { error } = await db
      .from("customer_addresses")
      .update({ is_default: true, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) throw error;
    revalidatePath("/account/profile");
    revalidatePath("/cart");
    return { success: true, data: null, message: "Alamat utama diperbarui" };
  } catch (error) {
    console.error("setDefaultCustomerAddress failed:", error);
    return { success: false, data: null, message: "Gagal mengubah alamat utama" };
  }
}

/** Delete a saved address owned by the logged-in customer. */
export async function deleteCustomerAddress(id: string): Promise<ActionResult> {
  const user = await currentUser();
  if (!user) return { success: false, data: null, message: "Silakan login terlebih dahulu" };
  try {
    const db = supabaseAdmin();
    const { data: existing, error: selectError } = await db
      .from("customer_addresses")
      .select("is_default")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (selectError) throw selectError;
    const wasDefault = Boolean(existing?.is_default);
    const { error } = await db
      .from("customer_addresses")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) throw error;

    if (wasDefault) {
      const { data: next } = await db
        .from("customer_addresses")
        .select("id")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (next?.id) {
        await db
          .from("customer_addresses")
          .update({ is_default: true, updated_at: new Date().toISOString() })
          .eq("id", next.id as string)
          .eq("user_id", user.id);
      }
    }
    revalidatePath("/account/profile");
    revalidatePath("/cart");
    return { success: true, data: null, message: "Alamat dihapus" };
  } catch (error) {
    console.error("deleteCustomerAddress failed:", error);
    return { success: false, data: null, message: "Gagal menghapus alamat" };
  }
}
