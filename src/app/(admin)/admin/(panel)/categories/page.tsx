import type { Metadata } from "next";
import type { ReactNode } from "react";

import {
  CategoriesGrid,
  type AdminCategory,
} from "@/components/admin/CategoriesGrid";
import { getCategories } from "@/services/content/categories";
import { getAdminProducts } from "@/services/operational/products";

export const metadata: Metadata = { title: "Kategori" };

export default async function AdminCategoriesPage(): Promise<ReactNode> {
  const [categories, products] = await Promise.all([
    getCategories(),
    getAdminProducts(),
  ]);
  const counts = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.categorySlug] = (acc[p.categorySlug] ?? 0) + 1;
    return acc;
  }, {});
  const items: AdminCategory[] = categories.map((c, i) => ({
    ...c,
    count: counts[c.slug] ?? 0,
    order: i + 1,
    status: "published",
  }));

  return <CategoriesGrid initial={items} />;
}
