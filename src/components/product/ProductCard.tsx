"use client";

import { CreditCard, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";

import { Badge } from "@/components/ui/Badge";
import { useCheckout } from "@/hooks/useCheckout";
import { categoryName } from "@/lib/catalog";
import { BADGE_LABELS } from "@/lib/data/catalog";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { productMessage } from "@/lib/whatsapp";
import { useCart } from "@/providers/CartProvider";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }): ReactElement {
  const { add } = useCart();
  const { checkout, pending } = useCheckout();
  const href = `/products/${product.slug}`;

  return (
    <article className="group flex h-full flex-col">
      <Link href={href} className="relative block overflow-hidden rounded-card">
        <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-gradient-to-br from-[#f4f4f6] to-[#e9eaee]">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 1068px) 50vw, (max-width: 1800px) 25vw, 300px"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-[56%] w-[56%] items-center justify-center rounded-card bg-[repeating-linear-gradient(45deg,#e4e5e9,#e4e5e9_10px,#eeeef1_10px,#eeeef1_20px)] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.03)]">
              <span className="px-2 text-center text-xs font-bold tracking-[0.12em] text-gray-300 uppercase">
                {product.short}
              </span>
            </div>
          )}
        </div>
        {product.badge && (
          <span className="absolute top-3 left-3">
            <Badge variant={product.badge}>{BADGE_LABELS[product.badge]}</Badge>
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-[5px] pt-3">
        <span className="type-uppercase-tag text-muted">
          {categoryName(product.categorySlug)}
        </span>
        <Link
          href={href}
          className="text-[16px] leading-snug font-semibold text-ink"
        >
          {product.name}
        </Link>
        <div className="mt-0.5 flex items-baseline gap-1.5">
          <span className="font-mono text-[17px] font-bold text-brand">
            {formatPrice(product.price)}
          </span>
        </div>
        {product.stock !== null && (
          <div
            className={cn(
              "mt-1 text-[12px] font-semibold",
              product.stock > 0 ? "text-green-600" : "text-red-500",
            )}
          >
            {product.stock > 0 ? `Stok: ${product.stock} pcs` : "Stok Habis"}
          </div>
        )}
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              void checkout({
                item: {
                  sku: product.sku,
                  productSku: product.sku,
                  productSlug: product.slug,
                  name: product.name,
                  options: {},
                  qty: 1,
                  unitPrice: product.price,
                },
                buildMessage: (ref) => productMessage(product, 1, { ref }),
                nextPath: href,
              })
            }
            className="inline-flex h-[42px] flex-1 items-center justify-center gap-[7px] rounded-btn bg-brand text-[14px] font-medium text-white transition-colors hover:bg-brand-hover disabled:bg-brand-disabled"
          >
            <CreditCard className="h-4 w-4" />
            {pending ? "Memproses…" : "Checkout"}
          </button>
          <button
            type="button"
            aria-label={`Tambah ${product.name} ke keranjang`}
            onClick={() => add(product)}
            className="inline-flex h-[42px] w-[42px] flex-none items-center justify-center rounded-btn border border-gray-200 bg-white text-ink transition-colors hover:border-border-strong"
          >
            <ShoppingCart className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </article>
  );
}
