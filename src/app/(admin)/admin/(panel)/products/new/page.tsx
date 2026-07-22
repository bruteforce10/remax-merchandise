import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ProductEditor } from "@/components/admin/ProductEditor";

export const metadata: Metadata = { title: "Produk Baru" };

export default function NewProductPage(): ReactNode {
  return <ProductEditor mode="create" />;
}
