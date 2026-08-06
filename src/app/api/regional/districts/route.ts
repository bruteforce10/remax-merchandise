import { type NextRequest, NextResponse } from "next/server";

import { getDistricts } from "@/lib/shipping/regional";

import type { ActionResult } from "@/types/action";
import type { RegionOption } from "@/types/shipping";

/** GET /api/regional/districts?regency=<code> — districts of a regency/city. */
export async function GET(
  request: NextRequest,
): Promise<NextResponse<ActionResult<RegionOption[]>>> {
  const code = request.nextUrl.searchParams.get("regency");
  if (!code || !/^\d+$/.test(code)) {
    return NextResponse.json(
      { success: false, data: null, message: "Parameter regency wajib" },
      { status: 400 },
    );
  }
  try {
    const data = await getDistricts(code);
    return NextResponse.json({ success: true, data, message: "OK" });
  } catch (error) {
    console.error("GET /api/regional/districts failed:", error);
    return NextResponse.json(
      { success: false, data: null, message: "Gagal memuat kecamatan" },
      { status: 502 },
    );
  }
}
