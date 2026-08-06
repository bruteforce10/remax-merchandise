import type { Metadata } from "next";
import type { ReactNode } from "react";

import { CategoryCard } from "@/components/category/CategoryCard";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { getCategories } from "@/services/content/categories";
import { getProducts } from "@/services/content/products";

export const metadata: Metadata = {
  title: "Kategori Gifts",
  description:
    "Jelajahi seluruh kategori merchandise REMAX Indonesia - polo, jaket, hoodie, payung, tumbler, tote bag, dan corporate gift lainnya.",
  alternates: { canonical: "/categories" },
};

export default async function CategoriesPage(): Promise<ReactNode> {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const counts = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.categorySlug] = (acc[p.categorySlug] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-[1280px] animate-[rmx-fade_.3s_ease] px-6 pt-[22px] pb-14">
      <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Kategori" }]} />
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Kategori Gifts
      </h1>
      <p className="mt-2 max-w-[640px] text-[15px] leading-relaxed text-muted">
        Temukan produk berdasarkan jenisnya - dari apparel hingga corporate gift,
        semua tersedia dalam desain resmi REMAX Indonesia.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <CategoryCard key={c.slug} category={c} count={counts[c.slug] ?? 0} />
        ))}
      </div>
    </div>
  );
}

