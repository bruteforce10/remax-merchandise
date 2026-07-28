import type { ReactNode } from "react";

import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Toaster } from "@/components/ui/Toaster";
import { AuthProvider } from "@/providers/AuthProvider";
import { CartProvider } from "@/providers/CartProvider";
import { getCategories } from "@/services/content/categories";
import { getProducts } from "@/services/content/products";

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}): Promise<ReactNode> {
  // Auth state is resolved on the client (AuthProvider) so public pages stay
  // statically renderable — reading cookies here would force them all dynamic.
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return (
    <AuthProvider>
      <CartProvider>
        <div className="flex min-h-screen flex-col">
          <SiteHeader categories={categories} products={products} />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <FloatingWhatsApp />
        <Toaster />
      </CartProvider>
    </AuthProvider>
  );
}
