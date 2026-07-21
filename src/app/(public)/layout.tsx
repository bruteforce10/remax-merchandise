import type { ReactNode } from "react";

import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Toaster } from "@/components/ui/Toaster";
import { CartProvider } from "@/providers/CartProvider";
import { getCategories } from "@/services/content/categories";

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}): Promise<ReactNode> {
  const categories = await getCategories();

  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <SiteHeader categories={categories} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
      <FloatingWhatsApp />
      <Toaster />
    </CartProvider>
  );
}
