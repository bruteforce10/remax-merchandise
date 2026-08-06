import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { CategoryCover } from "@/components/category/CategoryCover";
import { CategoryProducts } from "@/components/category/CategoryProducts";
import { CategoryVisual } from "@/components/category/CategoryVisual";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import {
  getCategoryBySlug,
  getCategorySlugs,
  getRelatedCategories,
} from "@/services/content/categories";
import {
  getProducts,
  getProductsByCategory,
} from "@/services/content/products";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await getCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/categories/${slug}` },
    openGraph: {
      title: `${category.name} | REMAX Gifts`,
      description: category.description,
      url: `/categories/${slug}`,
    },
  };
}

export default async function CategoryDetailPage({
  params,
}: PageProps): Promise<ReactNode> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [products, related, allProducts] = await Promise.all([
    getProductsByCategory(slug),
    getRelatedCategories(slug, 4),
    getProducts(),
  ]);

  const counts = allProducts.reduce<Record<string, number>>((acc, p) => {
    acc[p.categorySlug] = (acc[p.categorySlug] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="animate-[rmx-fade_.3s_ease]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-[#2a1114] text-white">
        <CategoryCover slug={slug} />
        <div className="relative mx-auto max-w-[1280px] px-6 py-16">
          <Breadcrumb
            variant="dark"
            items={[
              { label: "Beranda", href: "/" },
              { label: "Kategori", href: "/categories" },
              { label: category.name },
            ]}
          />
          <div className="mt-5 flex flex-wrap items-center gap-[18px]">
            <CategoryVisual
              slug={category.slug}
              name={category.name}
              icon={category.icon}
              sizes="66px"
              imageClassName="p-2"
              iconClassName="h-[30px] w-[30px]"
              wrapClassName="h-[66px] w-[66px] rounded-card border"
              imageWrapClassName="border-white/20 bg-white"
              iconWrapClassName="border-brand/35 bg-brand/[0.18] text-[#FF6472]"
            />
            <div className="min-w-[240px] flex-1">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[40px]">
                {category.name}
              </h1>
              <p className="mt-2 max-w-[640px] text-[15.5px] leading-relaxed text-gray-300">
                {category.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 pt-6 pb-10">
        <CategoryProducts products={products} />

        {/* Related categories */}
        <div className="mt-13">
          <h2 className="mb-[18px] text-[22px] font-semibold text-ink">
            Kategori Terkait
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((c) => (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                className="group flex items-center gap-3.5 rounded-card border border-gray-200 p-5 transition-[box-shadow,border-color] duration-200 ease-out-quart hover:border-border-strong hover:shadow-card"
              >
                <CategoryVisual
                  slug={c.slug}
                  name={c.name}
                  icon={c.icon}
                  sizes="46px"
                  imageClassName="p-1"
                  iconClassName="h-[22px] w-[22px]"
                  wrapClassName="h-[46px] w-[46px] flex-none rounded-card text-brand transition-transform duration-200 ease-out-quart group-hover:scale-[1.06]"
                  imageWrapClassName="bg-white"
                  iconWrapClassName="bg-brand-subtle"
                />
                <div>
                  <div className="text-[15px] font-semibold text-ink">
                    {c.name}
                  </div>
                  <div className="text-[12.5px] text-muted">
                    {counts[c.slug] ?? 0} produk
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
