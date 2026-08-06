import { type NextRequest, NextResponse } from "next/server";

import { getRegencies } from "@/lib/shipping/regional";

import type { ActionResult } from "@/types/action";
import type { RegionOption } from "@/types/shipping";

/** GET /api/regional/regencies?province=<code> — regencies/cities of a province. */
export async function GET(
  request: NextRequest,
): Promise<NextResponse<ActionResult<RegionOption[]>>> {
  const code = request.nextUrl.searchParams.get("province");
  if (!code || !/^\d+$/.test(code)) {
    return NextResponse.json(
      { success: false, data: null, message: "Parameter province wajib" },
      { status: 400 },
    );
  }
  try {
    const data = await getRegencies(code);
    return NextResponse.json({ success: true, data, message: "OK" });
  } catch (error) {
    console.error("GET /api/regional/regencies failed:", error);
    return NextResponse.json(
      { success: false, data: null, message: "Gagal memuat kota/kabupaten" },
      { status: 502 },
    );
  }
}
