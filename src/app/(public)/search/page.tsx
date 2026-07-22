import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";

import { SearchClient } from "@/components/search/SearchClient";

export const metadata: Metadata = {
  title: "Cari Produk",
  description:
    "Cari merchandise RE/MAX Indonesia berdasarkan nama atau kategori. Filter harga dan warna untuk menemukan produk yang tepat.",
  alternates: { canonical: "/search" },
};

export default function SearchPage(): ReactNode {
  return (
    <Suspense
      fallback={<div className="mx-auto min-h-[60vh] max-w-[1280px] px-6 py-10" />}
    >
      <SearchClient />
    </Suspense>
  );
}
