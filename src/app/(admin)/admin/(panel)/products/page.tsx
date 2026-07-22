import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ProductsTable } from "@/components/admin/ProductsTable";
import { getAdminProducts } from "@/services/operational/products";

export const metadata: Metadata = { title: "Produk" };

export default async function AdminProductsPage(): Promise<ReactNode> {
  const products = await getAdminProducts();
  return <ProductsTable initialProducts={products} />;
}
