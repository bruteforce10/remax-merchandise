import type { Metadata } from "next";
import type { ReactNode } from "react";

import { CtaBanner } from "@/components/home/CtaBanner";
import { FeatureCards } from "@/components/home/FeatureCards";
import { HeroSlider } from "@/components/home/HeroSlider";
import { HomeProducts } from "@/components/home/HomeProducts";
import {
  PopularCategories,
  type PopularCategoryItem,
} from "@/components/home/PopularCategories";
import { POPULAR_CATEGORY_SLUGS } from "@/lib/data/catalog";
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
  const categoryMap = new Map(categories.map((c) => [c.slug, c]));
  const popularItems: PopularCategoryItem[] = POPULAR_CATEGORY_SLUGS.map(
    (slug) => {
      const c = categoryMap.get(slug);
      return c
        ? { slug: c.slug, name: c.name, icon: c.icon, count: counts[slug] ?? 0 }
        : null;
    },
  ).filter((x): x is PopularCategoryItem => x !== null);

  return (
    <>
      <HeroSlider banners={banners} />
      <PopularCategories items={popularItems} />
      <HomeProducts products={products} />
      <FeatureCards />
      <CtaBanner />
    </>
  );
}
