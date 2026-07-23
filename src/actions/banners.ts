"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

import { hygraphWrite } from "@/lib/hygraph/client";
import { hygraphErrorMessage } from "@/lib/hygraph/errors";
import {
  CREATE_BANNER,
  DELETE_BANNER,
  PUBLISH_BANNER,
  UPDATE_BANNER,
} from "@/lib/hygraph/mutations";
import type { ActionResult } from "@/types/action";

const bannerSchema = z.object({
  alt: z.string().trim().min(1, "Alt gambar wajib diisi"),
  link: z.string().trim().default(""),
  order: z.number().int().min(1).default(1),
  status: z.enum(["published", "draft"]).default("draft"),
});

export type BannerInput = z.input<typeof bannerSchema>;

function revalidateBanners(): void {
  revalidateTag("banners");
  revalidatePath("/");
  revalidatePath("/admin/banners");
}

function todayLabel(): string {
  return new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export async function createBanner(
  input: BannerInput,
): Promise<ActionResult<{ id: string; date: string }>> {
  const parsed = bannerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      data: null,
      message: parsed.error.issues[0]?.message ?? "Data banner tidak valid",
    };
  }

  const { alt, link, order, status } = parsed.data;
  try {
    const client = hygraphWrite();
    const created = await client.request<{ createBanner: { id: string } }>(
      CREATE_BANNER,
      {
        data: {
          alt,
          link,
          order,
          publishStatus: status === "published" ? "Published" : "Draft",
        },
      },
    );
    const id = created.createBanner.id;
    // Always publish so the published stage carries the latest field values;
    // the publishStatus field (filtered in the public query) gates visibility.
    await client.request(PUBLISH_BANNER, { id });
    revalidateBanners();
    return {
      success: true,
      data: { id, date: todayLabel() },
      message: "Banner ditambahkan",
    };
  } catch (error) {
    console.error("createBanner failed:", error);
    return {
      success: false,
      data: null,
      message: hygraphErrorMessage(error, "Gagal menambahkan banner"),
    };
  }
}

export async function updateBanner(
  id: string,
  input: BannerInput,
): Promise<ActionResult> {
  const parsed = bannerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      data: null,
      message: parsed.error.issues[0]?.message ?? "Data banner tidak valid",
    };
  }

  const { alt, link, order, status } = parsed.data;
  try {
    const client = hygraphWrite();
    await client.request(UPDATE_BANNER, {
      id,
      data: {
        alt,
        link,
        order,
        publishStatus: status === "published" ? "Published" : "Draft",
      },
    });
    // Always publish so the published stage carries the latest field values;
    // the publishStatus field (filtered in the public query) gates visibility.
    await client.request(PUBLISH_BANNER, { id });
    revalidateBanners();
    return { success: true, data: null, message: "Banner diperbarui" };
  } catch (error) {
    console.error("updateBanner failed:", error);
    return {
      success: false,
      data: null,
      message: hygraphErrorMessage(error, "Gagal memperbarui banner"),
    };
  }
}

export async function deleteBanner(id: string): Promise<ActionResult> {
  try {
    await hygraphWrite().request(DELETE_BANNER, { id });
    revalidateBanners();
    return { success: true, data: null, message: "Banner dihapus" };
  } catch (error) {
    console.error("deleteBanner failed:", error);
    return {
      success: false,
      data: null,
      message: hygraphErrorMessage(error, "Gagal menghapus banner"),
    };
  }
}
