"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";

import { Badge } from "@/components/ui/Badge";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { categoryName } from "@/lib/catalog";
import { BADGE_LABELS } from "@/lib/data/catalog";
import { formatPrice } from "@/lib/format";
import { productMessage, waLink } from "@/lib/whatsapp";
import { useCart } from "@/providers/CartProvider";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }): ReactElement {
  const { add } = useCart();
  const href = `/products/${product.slug}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card border border-gray-200 bg-white shadow-card transition-[box-shadow,transform] duration-200 hover:-translate-y-[3px] hover:shadow-hover">
      <Link href={href} className="relative block">
        <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-[#f4f4f6] to-[#e9eaee]">
          <div className="flex h-[56%] w-[56%] items-center justify-center rounded-[14px] bg-[repeating-linear-gradient(45deg,#e4e5e9,#e4e5e9_10px,#eeeef1_10px,#eeeef1_20px)] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.03)]">
            <span className="px-2 text-center text-xs font-bold tracking-[0.12em] text-gray-300 uppercase">
              {product.short}
            </span>
          </div>
        </div>
        {product.badge && (
          <span className="absolute top-3 left-3">
            <Badge variant={product.badge}>{BADGE_LABELS[product.badge]}</Badge>
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-[5px] p-4">
        <span className="text-[11px] font-semibold tracking-[0.06em] text-gray-400 uppercase">
          {categoryName(product.categorySlug)}
        </span>
        <Link
          href={href}
          className="text-[15.5px] leading-tight font-bold text-ink hover:text-ink"
        >
          {product.name}
        </Link>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-xs text-gray-500">Mulai</span>
          <span className="font-mono text-[17px] font-bold text-brand">
            {formatPrice(product.price)}
          </span>
        </div>
        <span className="text-[12.5px] text-gray-500">
          Min. order {product.moq} pcs
        </span>

        <div className="mt-3 flex gap-2">
          <a
            href={waLink(productMessage(product, product.moq))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-[42px] flex-1 items-center justify-center gap-[7px] rounded-btn bg-brand text-[13.5px] font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp
          </a>
          <button
            type="button"
            aria-label={`Tambah ${product.name} ke keranjang`}
            onClick={() => add(product)}
            className="inline-flex h-[42px] w-[42px] flex-none items-center justify-center rounded-btn border border-gray-300 bg-white text-ink transition-colors hover:border-gray-400 hover:bg-gray-50"
          >
            <ShoppingCart className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </article>
  );
}
