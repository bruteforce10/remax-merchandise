import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { ProductDetailView } from "@/components/product/ProductDetailView";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import { priceFrom, totalStock } from "@/lib/variants";
import { getCategoryBySlug } from "@/services/content/categories";
import {
  getProductBySlug,
  getProductDetailBySlug,
  getProductSlugs,
  getRelatedProducts,
} from "@/services/content/products";
import { getStockByProduct } from "@/services/operational/inventory";
import type { ProductDetail } from "@/types/product";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const category = await getCategoryBySlug(product.categorySlug);
  const description = `${product.name} — mulai ${formatPrice(product.price)}/pcs. ${category?.description ?? ""}`;

  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      title: `${product.name} | ${SITE_NAME}`,
      description,
      url: `/products/${slug}`,
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: PageProps): Promise<ReactNode> {
  const { slug } = await params;
  const detail = await getProductDetailBySlug(slug);
  if (!detail) notFound();
  const category = await getCategoryBySlug(detail.categorySlug);
  if (!category) notFound();
  const related = await getRelatedProducts(detail, 4);

  // Live stock (source of truth) from Supabase overrides the Hygraph seed.
  const stock = await getStockByProduct(detail.sku);
  const product: ProductDetail = {
    ...detail,
    stock: detail.sku in stock ? stock[detail.sku] : detail.stock,
    variants: detail.variants.map((v) =>
      v.sku in stock ? { ...v, stock: stock[v.sku] } : v,
    ),
  };

  const hasVariants = product.variants.length > 0;
  const displayPrice = priceFrom(product.variants, product.price);
  const inStock = hasVariants
    ? totalStock(product.variants) > 0
    : product.stock === null || product.stock > 0;

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    category: category.name,
    description: category.description,
    brand: { "@type": "Brand", name: "REMAX" },
    offers: {
      "@type": "Offer",
      priceCurrency: "IDR",
      price: displayPrice,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/products/${slug}`,
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: category.name,
        item: `${SITE_URL}/categories/${category.slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${SITE_URL}/products/${slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={productLd} />
      <JsonLd data={breadcrumbLd} />
      <ProductDetailView product={product} category={category} related={related} />
    </>
  );
}
