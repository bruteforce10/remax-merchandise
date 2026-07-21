import type { Metadata } from "next";
import type { ReactNode } from "react";

import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Keranjang Penawaran",
  description:
    "Daftar produk merchandise RE/MAX untuk permintaan penawaran (quotation) via WhatsApp.",
  alternates: { canonical: "/cart" },
  robots: { index: false, follow: true },
};

export default function CartPage(): ReactNode {
  return <CartView />;
}
