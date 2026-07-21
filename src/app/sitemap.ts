import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/constants";
import { getCategorySlugs } from "@/services/content/categories";
import { getProductSlugs } from "@/services/content/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categorySlugs, productSlugs] = await Promise.all([
    getCategorySlugs(),
    getProductSlugs(),
  ]);
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/search`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/categories`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified, changeFrequency: "monthly", priority: 0.5 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${SITE_URL}/categories/${slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${SITE_URL}/products/${slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
