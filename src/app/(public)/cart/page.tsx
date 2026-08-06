import type { Metadata } from "next";
import type { ReactNode } from "react";

import { CartView } from "@/components/cart/CartView";
import { getProvinces } from "@/lib/shipping/regional";
import { getCustomerAddresses } from "@/services/operational/addresses";
import { createClient } from "@/lib/supabase/server";

import type { RegionOption } from "@/types/shipping";

export const metadata: Metadata = {
  title: "Keranjang Penawaran",
  description:
    "Daftar produk merchandise REMAX untuk permintaan penawaran (quotation) via WhatsApp.",
  alternates: { canonical: "/cart" },
  robots: { index: false, follow: true },
};

export default async function CartPage(): Promise<ReactNode> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let provinces: RegionOption[] = [];
  try {
    provinces = await getProvinces();
  } catch (error) {
    console.error("CartPage getProvinces failed:", error);
  }

  const addresses = user ? await getCustomerAddresses(user.id) : [];

  return (
    <CartView
      isAuthenticated={!!user}
      userEmail={user?.email ?? null}
      initialProvinces={provinces}
      savedAddresses={addresses}
    />
  );
}
