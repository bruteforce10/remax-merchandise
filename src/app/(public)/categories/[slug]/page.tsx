import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { CategoryProducts } from "@/components/category/CategoryProducts";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { CategoryIcon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import {
  getCategories,
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/categories/${slug}` },
    openGraph: {
      title: `${category.name} | RE/MAX Merchandise`,
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

  const [allCategories, products, related, allProducts] = await Promise.all([
    getCategories(),
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
      <section className="bg-gradient-to-br from-gray-900 to-[#2a1114] text-white">
        <div className="mx-auto max-w-[1280px] px-6 pt-9 pb-10">
          <Breadcrumb
            variant="dark"
            items={[
              { label: "Beranda", href: "/" },
              { label: "Kategori", href: "/categories" },
              { label: category.name },
            ]}
          />
          <div className="mt-5 flex flex-wrap items-center gap-[18px]">
            <span className="flex h-[66px] w-[66px] items-center justify-center rounded-[18px] border border-brand/35 bg-brand/[0.18] text-[#FF6472]">
              <CategoryIcon name={category.icon} className="h-[30px] w-[30px]" />
            </span>
            <div className="min-w-[240px] flex-1">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[40px]">
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
        {/* Category chips */}
        <div className="rmx-scrollbar mb-5 flex gap-2.5 overflow-x-auto pb-3">
          {allCategories.map((c) => {
            const active = c.slug === slug;
            return (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                className={cn(
                  "inline-flex h-10 flex-none items-center gap-[7px] rounded-pill border px-4 text-sm font-semibold",
                  active
                    ? "border-brand bg-brand text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300",
                )}
              >
                <CategoryIcon name={c.icon} className="h-[15px] w-[15px]" />
                {c.name}
              </Link>
            );
          })}
        </div>

        <CategoryProducts products={products} />

        {/* Related categories */}
        <div className="mt-13">
          <h2 className="mb-[18px] text-[22px] font-extrabold text-ink">
            Kategori Terkait
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((c) => (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                className="flex items-center gap-3.5 rounded-card border border-gray-100 p-5 transition-[box-shadow,transform] duration-200 hover:-translate-y-[2px] hover:shadow-hover"
              >
                <span className="flex h-[46px] w-[46px] flex-none items-center justify-center rounded-[12px] bg-brand-subtle text-brand">
                  <CategoryIcon name={c.icon} className="h-[22px] w-[22px]" />
                </span>
                <div>
                  <div className="text-[15px] font-bold text-ink">{c.name}</div>
                  <div className="text-[12.5px] text-gray-400">
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
