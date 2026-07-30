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
  const { sku: rawSku } = await params;
  // Next.js leaves reserved characters percent-encoded in dynamic params, so a
  // SKU containing a space (e.g. "TT 001") arrives as "TT%20001". Decode it back
  // to the stored Hygraph SKU, otherwise the lookup finds nothing and 404s.
  const sku = decodeSku(rawSku);
  const [product, categories] = await Promise.all([
    getAdminProductBySku(sku),
    getCategories(),
  ]);
  if (!product) notFound();
  return (
    <ProductEditor mode="edit" product={product} categories={categories} />
  );
}

/** Reverse the URL-encoding of a dynamic route param; tolerate malformed input. */
function decodeSku(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
