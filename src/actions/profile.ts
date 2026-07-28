"use server";

import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/action";

const profileSchema = z.object({
  fullName: z.string().trim().max(80, "Nama terlalu panjang").default(""),
  phone: z.string().trim().max(30, "Nomor terlalu panjang").default(""),
  company: z
    .string()
    .trim()
    .max(120, "Nama perusahaan terlalu panjang")
    .default(""),
});

export type ProfileInput = z.input<typeof profileSchema>;

/** Save the logged-in customer's profile into Supabase Auth user metadata. */
export async function updateProfile(
  input: ProfileInput,
): Promise<ActionResult> {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      data: null,
      message: parsed.error.issues[0]?.message ?? "Data profil tidak valid",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      success: false,
      data: null,
      message: "Silakan login terlebih dahulu",
    };
  }

  const { fullName, phone, company } = parsed.data;
  const { error } = await supabase.auth.updateUser({
    data: { full_name: fullName, phone, company },
  });
  if (error) {
    console.error("updateProfile failed:", error);
    return {
      success: false,
      data: null,
      message: "Gagal menyimpan profil. Coba lagi.",
    };
  }

  return { success: true, data: null, message: "Profil tersimpan" };
}
