import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ProductEditor } from "@/components/admin/ProductEditor";
import { getCategories } from "@/services/content/categories";

export const metadata: Metadata = { title: "Produk Baru" };

export default async function NewProductPage(): Promise<ReactNode> {
  const categories = await getCategories();
  return <ProductEditor mode="create" categories={categories} />;
}
