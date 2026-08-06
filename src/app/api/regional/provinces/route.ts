import { NextResponse } from "next/server";

import { getProvinces } from "@/lib/shipping/regional";

import type { ActionResult } from "@/types/action";
import type { RegionOption } from "@/types/shipping";

/** GET /api/regional/provinces — list all provinces for the destination selector. */
export async function GET(): Promise<NextResponse<ActionResult<RegionOption[]>>> {
  try {
    const data = await getProvinces();
    return NextResponse.json({ success: true, data, message: "OK" });
  } catch (error) {
    console.error("GET /api/regional/provinces failed:", error);
    return NextResponse.json(
      { success: false, data: null, message: "Gagal memuat provinsi" },
      { status: 502 },
    );
  }
}
