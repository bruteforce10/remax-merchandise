import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { ProductEditor } from "@/components/admin/ProductEditor";
import { getCategories } from "@/services/content/categories";
import {
  getAdminProductBySku,
  getAdminProductSkus,
} from "@/services/operational/products";

interface PageProps {
  params: Promise<{ sku: string }>;
}

export const metadata: Metadata = { title: "Edit Produk" };

export async function generateStaticParams(): Promise<{ sku: string }[]> {
  const skus = await getAdminProductSkus();
  return skus.map((sku) => ({ sku }));
}

export default async function EditProductPage({
  params,
}: PageProps): Promise<ReactNode> {
  const { sku } = await params;
  const [product, categories] = await Promise.all([
    getAdminProductBySku(sku),
    getCategories(),
  ]);
  if (!product) notFound();
  return (
    <ProductEditor mode="edit" product={product} categories={categories} />
  );
}
