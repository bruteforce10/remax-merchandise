import type { Metadata } from "next";
import type { ReactNode } from "react";

import { CartView } from "@/components/cart/CartView";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Keranjang Penawaran",
  description:
    "Daftar produk merchandise RE/MAX untuk permintaan penawaran (quotation) via WhatsApp.",
  alternates: { canonical: "/cart" },
  robots: { index: false, follow: true },
};

export default async function CartPage(): Promise<ReactNode> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <CartView isAuthenticated={!!user} userEmail={user?.email ?? null} />;
}
