import { type NextRequest, NextResponse } from "next/server";

import { getVillages } from "@/lib/shipping/regional";

import type { ActionResult } from "@/types/action";
import type { RegionOption } from "@/types/shipping";

/** GET /api/regional/villages?district=<code> — villages (10-digit) of a district. */
export async function GET(
  request: NextRequest,
): Promise<NextResponse<ActionResult<RegionOption[]>>> {
  const code = request.nextUrl.searchParams.get("district");
  if (!code || !/^\d+$/.test(code)) {
    return NextResponse.json(
      { success: false, data: null, message: "Parameter district wajib" },
      { status: 400 },
    );
  }
  try {
    const data = await getVillages(code);
    return NextResponse.json({ success: true, data, message: "OK" });
  } catch (error) {
    console.error("GET /api/regional/villages failed:", error);
    return NextResponse.json(
      { success: false, data: null, message: "Gagal memuat desa/kelurahan" },
      { status: 502 },
    );
  }
}
