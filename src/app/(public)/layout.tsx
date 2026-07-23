import type { ReactNode } from "react";

import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Toaster } from "@/components/ui/Toaster";
import { CartProvider } from "@/providers/CartProvider";
import { getCategories } from "@/services/content/categories";
import { getProducts } from "@/services/content/products";

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}): Promise<ReactNode> {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <SiteHeader categories={categories} products={products} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
      <FloatingWhatsApp />
      <Toaster />
    </CartProvider>
  );
}
