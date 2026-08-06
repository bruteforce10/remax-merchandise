"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

import { hygraphWrite } from "@/lib/hygraph/client";
import { hygraphErrorMessage } from "@/lib/hygraph/errors";
import {
  CREATE_CATEGORY,
  DELETE_CATEGORY,
  PUBLISH_CATEGORY,
  UPDATE_CATEGORY,
} from "@/lib/hygraph/mutations";
import type { ActionResult } from "@/types/action";

const categorySchema = z.object({
  name: z.string().trim().min(1, "Nama kategori wajib diisi"),
  slug: z.string().trim().min(1),
  icon: z.string().trim().default("package"),
  description: z.string().default(""),
  material: z.string().default(""),
  branding: z.string().default(""),
  colors: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
});

export type CategoryInput = z.input<typeof categorySchema>;

function revalidateCategories(): void {
  revalidateTag("categories");
  revalidatePath("/");
  revalidatePath("/categories");
  revalidatePath("/admin/categories");
}

export async function createCategory(
  input: CategoryInput,
): Promise<ActionResult> {
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      data: null,
      message: parsed.error.issues[0]?.message ?? "Data kategori tidak valid",
    };
  }

  try {
    const client = hygraphWrite();
    await client.request(CREATE_CATEGORY, { data: parsed.data });
    await client.request(PUBLISH_CATEGORY, { slug: parsed.data.slug });
    revalidateCategories();
    return { success: true, data: null, message: "Kategori ditambahkan" };
  } catch (error) {
    console.error("createCategory failed:", error);
    return {
      success: false,
      data: null,
      message: hygraphErrorMessage(error, "Gagal menambahkan kategori"),
    };
  }
}

export async function updateCategory(
  slug: string,
  input: CategoryInput,
): Promise<ActionResult> {
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      data: null,
      message: parsed.error.issues[0]?.message ?? "Data kategori tidak valid",
    };
  }

  try {
    const client = hygraphWrite();
    // `slug` is the current identifier; the admin may rename it, so `data.slug`
    // can differ. Update by the old slug, then publish the (possibly new) slug.
    await client.request(UPDATE_CATEGORY, { slug, data: parsed.data });
    await client.request(PUBLISH_CATEGORY, { slug: parsed.data.slug });
    revalidateCategories();
    return { success: true, data: null, message: "Kategori diperbarui" };
  } catch (error) {
    console.error("updateCategory failed:", error);
    return {
      success: false,
      data: null,
      message: hygraphErrorMessage(error, "Gagal memperbarui kategori"),
    };
  }
}

export async function deleteCategory(slug: string): Promise<ActionResult> {
  try {
    await hygraphWrite().request(DELETE_CATEGORY, { slug });
    revalidateCategories();
    return { success: true, data: null, message: "Kategori dihapus" };
  } catch (error) {
    console.error("deleteCategory failed:", error);
    return {
      success: false,
      data: null,
      message: hygraphErrorMessage(error, "Gagal menghapus kategori"),
    };
  }
}
