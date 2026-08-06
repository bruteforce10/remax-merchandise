import { readFile } from "node:fs/promises";
import path from "node:path";

import { renderToBuffer } from "@react-pdf/renderer";
import { type NextRequest, NextResponse } from "next/server";

import { OrderFormPdf } from "@/components/pdf/OrderFormPdf";
import { isAdminEmail } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getOrderById } from "@/services/operational/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Read the REMAX logo as a base64 data URI for embedding in the PDF. */
async function loadLogo(): Promise<string | undefined> {
  try {
    const buf = await readFile(
      path.join(process.cwd(), "public", "assets", "logo-full.png"),
    );
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    return undefined;
  }
}

/** GET /api/admin/orders/[id]/form — download the Formulir Pemesanan PDF (admin only). */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAdminEmail(user?.email)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const { id } = await context.params;
  const order = await getOrderById(id);
  if (!order) {
    return new NextResponse("Not found", { status: 404 });
  }

  const logoSrc = await loadLogo();
  const buffer = await renderToBuffer(OrderFormPdf({ order, logoSrc }));

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="FPM-${order.ref}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
