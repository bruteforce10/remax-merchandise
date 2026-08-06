import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getShippingRates } from "@/lib/shipping/cost";
import { shipOriginVillageCode } from "@/lib/shipping/env";
import { resolveItemWeights } from "@/lib/shipping/weight";
import { createClient } from "@/lib/supabase/server";

import type { ActionResult } from "@/types/action";
import type { ShippingRate } from "@/types/shipping";

interface ShippingCostData {
  rates: ShippingRate[];
  weightGrams: number;
}

const bodySchema = z.object({
  destinationVillageCode: z.string().trim().regex(/^\d{6,}$/),
  items: z
    .array(
      z.object({
        sku: z.string().trim().min(1),
        qty: z.number().int().min(1),
      }),
    )
    .min(1),
});

/**
 * POST /api/shipping/cost — live courier rates (ongkir) for the cart. Login-gated
 * (checkout requires auth) to keep the paid proxy from public abuse. Origin +
 * total weight are computed SERVER-side (weight from inventory, never the client)
 * so a tampered payload can't lower the price.
 */
export async function POST(
  request: NextRequest,
): Promise<NextResponse<ActionResult<ShippingCostData>>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json(
      { success: false, data: null, message: "Silakan login untuk checkout" },
      { status: 401 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, data: null, message: "Body tidak valid" },
      { status: 400 },
    );
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, data: null, message: "Data tujuan/keranjang tidak valid" },
      { status: 400 },
    );
  }

  const origin = shipOriginVillageCode();
  if (!origin) {
    return NextResponse.json(
      { success: false, data: null, message: "Origin pengiriman belum dikonfigurasi" },
      { status: 503 },
    );
  }

  try {
    const { totalGrams } = await resolveItemWeights(parsed.data.items);
    const rates = await getShippingRates({
      originVillageCode: origin,
      destinationVillageCode: parsed.data.destinationVillageCode,
      weightGrams: totalGrams,
    });
    return NextResponse.json({
      success: true,
      data: { rates, weightGrams: totalGrams },
      message: rates.length > 0 ? "OK" : "Tidak ada layanan kurir untuk tujuan ini",
    });
  } catch (error) {
    console.error("POST /api/shipping/cost failed:", error);
    return NextResponse.json(
      { success: false, data: null, message: "Gagal menghitung ongkir" },
      { status: 502 },
    );
  }
}
