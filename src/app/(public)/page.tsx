import type { Metadata } from "next";
import type { ReactNode } from "react";

import { FeatureCards } from "@/components/home/FeatureCards";
import { HeroSlider } from "@/components/home/HeroSlider";
import { HomeProducts } from "@/components/home/HomeProducts";
import {
  PopularCategories,
  type PopularCategoryItem,
} from "@/components/home/PopularCategories";
import { getBanners } from "@/services/content/banners";
import { getCategories } from "@/services/content/categories";
import { getProducts } from "@/services/content/products";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage(): Promise<ReactNode> {
  const [banners, products, categories] = await Promise.all([
    getBanners(),
    getProducts(),
    getCategories(),
  ]);

  const counts = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.categorySlug] = (acc[p.categorySlug] ?? 0) + 1;
    return acc;
  }, {});
  // "Kategori Populer" now mirrors the categories marked as Unggulan (featured)
  // in the admin, in their Hygraph order.
  const popularItems: PopularCategoryItem[] = categories
    .filter((c) => c.featured)
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      icon: c.icon,
      count: counts[c.slug] ?? 0,
    }));

  return (
    <>
      <HeroSlider banners={banners} />
      {popularItems.length > 0 && <PopularCategories items={popularItems} />}
      <HomeProducts products={products} />
      <FeatureCards />
    </>
  );
}
