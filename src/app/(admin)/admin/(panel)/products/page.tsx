import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ProductsTable } from "@/components/admin/ProductsTable";
import { getCategories } from "@/services/content/categories";
import { getAdminProducts } from "@/services/operational/products";

export const metadata: Metadata = { title: "Produk" };

export default async function AdminProductsPage(): Promise<ReactNode> {
  const [products, categories] = await Promise.all([
    getAdminProducts(),
    getCategories(),
  ]);
  return <ProductsTable initialProducts={products} categories={categories} />;
}
