"use client";

import { Info, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { ProductGrid } from "@/components/product/ProductGrid";
import { Badge } from "@/components/ui/Badge";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { BADGE_LABELS, COLOR_HEX } from "@/lib/data/catalog";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { productMessage, waLink } from "@/lib/whatsapp";
import { useCart } from "@/providers/CartProvider";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

interface ProductDetailViewProps {
  product: Product;
  category: Category;
  related: Product[];
}

export function ProductDetailView({
  product,
  category,
  related,
}: ProductDetailViewProps): React.JSX.Element {
  const { add } = useCart();
  const step = 1;

  const [galleryIndex, setGalleryIndex] = React.useState(0);
  const [colorIndex, setColorIndex] = React.useState(0);
  const [sizeIndex, setSizeIndex] = React.useState(0);
  const [qty, setQty] = React.useState(1);

  const finalQty = qty;
  const color = category.colors[colorIndex];
  const size = category.sizes.length ? category.sizes[sizeIndex] : undefined;

  const specs: { k: string; v: string }[] = [
    { k: "Bahan", v: category.material },
    { k: "Metode Branding", v: category.branding },
    { k: "Kategori", v: category.name },
  ];

  function waHref(): string {
    return waLink(productMessage(product, finalQty, { color, size }));
  }

  return (
    <div className="mx-auto max-w-[1280px] animate-[rmx-fade_.3s_ease] px-6 pt-[22px] pb-12">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[20px] border border-gray-100 bg-gradient-to-br from-[#f4f4f6] to-[#e6e7ec]">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover"
              />
            ) : (
              <>
                <div className="h-[52%] w-[52%] rounded-[18px] bg-[repeating-linear-gradient(45deg,#e4e5e9,#e4e5e9_12px,#eeeef1_12px,#eeeef1_24px)]" />
                <span className="absolute bottom-[18px] left-[18px] text-xs font-bold tracking-[0.1em] text-gray-300 uppercase">
                  Foto {galleryIndex + 1}/4
                </span>
              </>
            )}
          </div>
          {!product.imageUrl && (
            <div className="mt-3.5 grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`Foto ${n + 1}`}
                  onClick={() => setGalleryIndex(n)}
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-[12px] border-2 bg-gradient-to-br from-[#f4f4f6] to-[#e9eaee] text-[11px] font-bold text-gray-300",
                    n === galleryIndex ? "border-brand" : "border-gray-100",
                  )}
                >
                  {n + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="mb-3 flex gap-2">
            {product.badge && (
              <Badge variant={product.badge}>
                {BADGE_LABELS[product.badge]}
              </Badge>
            )}
            <Link
              href={`/categories/${category.slug}`}
              className="inline-flex items-center rounded-pill bg-gray-100 px-3.5 py-1.5 text-[11.5px] font-semibold text-gray-600"
            >
              {category.name}
            </Link>
          </div>

          <h1 className="text-[26px] leading-tight font-extrabold tracking-tight text-ink sm:text-[34px]">
            {product.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-2.5 border-b border-gray-100 pb-4">
            <span className="text-[13px] text-gray-500">Mulai dari</span>
            <span className="font-mono text-[32px] font-extrabold text-brand">
              {formatPrice(product.price)}
            </span>
            <span className="text-[13px] text-gray-400">/pcs</span>
          </div>

          {product.stock !== null && (
            <div
              className={cn(
                "mt-3 mb-[14px] text-[13px] font-semibold",
                product.stock > 0 ? "text-green-600" : "text-red-500",
              )}
            >
              {product.stock > 0
                ? `Stok tersedia: ${product.stock} pcs`
                : "Stok habis"}
            </div>
          )}
          {product.stock === null && <div className="mb-[18px]" />}

          {/* Colors */}
          <div className="mb-[18px]">
            <div className="mb-2.5 text-[13px] font-bold text-ink">
              Pilihan Warna
            </div>
            <div className="flex flex-wrap gap-2.5">
              {category.colors.map((name, i) => {
                const active = i === colorIndex;
                return (
                  <button
                    key={name}
                    type="button"
                    title={name}
                    aria-label={name}
                    aria-pressed={active}
                    onClick={() => setColorIndex(i)}
                    style={{ backgroundColor: COLOR_HEX[name] }}
                    className={cn(
                      "h-[38px] w-[38px] rounded-[11px] border-2",
                      active
                        ? "border-brand shadow-[0_0_0_3px_rgba(225,29,46,0.18)]"
                        : name === "Putih"
                          ? "border-gray-200"
                          : "border-transparent",
                    )}
                  />
                );
              })}
            </div>
          </div>

          {/* Sizes */}
          {category.sizes.length > 0 && (
            <div className="mb-5">
              <div className="mb-2.5 text-[13px] font-bold text-ink">
                Ukuran
              </div>
              <div className="flex flex-wrap gap-2.5">
                {category.sizes.map((label, i) => {
                  const active = i === sizeIndex;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setSizeIndex(i)}
                      className={cn(
                        "h-11 min-w-[48px] rounded-[11px] border-[1.5px] px-3 text-sm font-bold",
                        active
                          ? "border-brand bg-brand-subtle text-brand"
                          : "border-gray-200 bg-white text-ink",
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-[22px] flex items-center gap-3.5">
            <div className="text-[13px] font-bold text-ink">Jumlah</div>
            <div className="inline-flex items-center overflow-hidden rounded-btn border border-gray-200">
              <button
                type="button"
                aria-label="Kurangi"
                onClick={() => setQty(Math.max(1, finalQty - step))}
                className="h-[46px] w-11 bg-white text-xl text-gray-600 hover:bg-gray-50"
              >
                −
              </button>
              <input
                value={finalQty}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  setQty(Number.isNaN(v) || v < 1 ? 1 : v);
                }}
                inputMode="numeric"
                aria-label="Jumlah"
                className="h-[46px] w-16 border-x border-gray-100 text-center font-mono text-base font-bold outline-none"
              />
              <button
                type="button"
                aria-label="Tambah"
                onClick={() => setQty(finalQty + step)}
                className="h-[46px] w-11 bg-white text-xl text-gray-600 hover:bg-gray-50"
              >
                +
              </button>
            </div>
            <span className="text-[12.5px] text-gray-400">pcs</span>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <a
              href={waHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-[54px] min-w-[200px] flex-1 items-center justify-center gap-2.5 rounded-[14px] bg-brand text-base font-bold text-white shadow-cta transition-colors hover:bg-brand-hover"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Chat via WhatsApp
            </a>
            <button
              type="button"
              onClick={() => add(product, finalQty)}
              className="inline-flex h-[54px] flex-none items-center justify-center gap-2.5 rounded-[14px] border-[1.5px] border-gray-200 bg-white px-6 text-[15.5px] font-bold text-ink hover:border-gray-300 hover:bg-gray-50"
            >
              <ShoppingCart className="h-[19px] w-[19px]" />
              Tambah ke Keranjang
            </button>
          </div>

          {/* Trust row */}
          <div className="mt-[22px] flex flex-wrap gap-5 px-[18px] py-4">
            <div className="flex items-center gap-2.5 text-[13.5px] text-gray-700">
              <Truck className="h-[17px] w-[17px] text-brand" />
              Kirim seluruh Indonesia
            </div>
            <div className="flex items-center gap-2.5 text-[13.5px] text-gray-700">
              <ShieldCheck className="h-[17px] w-[17px] text-brand" />
              Garansi kualitas
            </div>
            <div className="flex items-center gap-2 rounded-[8px] bg-amber-50 px-2.5 py-1 text-[13.5px] font-semibold text-amber-700">
              <Info className="h-[16px] w-[16px] flex-none text-amber-500" />
              Harga belum termasuk ongkir
            </div>
          </div>
        </div>
      </div>

      {/* Description + Specs */}
      <div className="mt-11 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-[18px] border border-gray-100 p-6.5">
          <h3 className="mb-3 text-lg font-extrabold text-ink">Deskripsi</h3>
          <p className="text-[15px] leading-relaxed text-gray-600">
            {category.description}
          </p>
        </div>
        <div className="rounded-[18px] border border-gray-100 p-6.5">
          <h3 className="mb-3.5 text-lg font-extrabold text-ink">
            Spesifikasi
          </h3>
          <div className="flex flex-col">
            {specs.map((s) => (
              <div
                key={s.k}
                className="flex justify-between gap-4 border-b border-gray-100 py-[11px] last:border-b-0"
              >
                <span className="text-sm text-gray-400">{s.k}</span>
                <span className="text-right text-sm font-semibold text-ink">
                  {s.v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-13">
        <h2 className="mb-[18px] text-[22px] font-extrabold text-ink">
          Rekomendasi Produk
        </h2>
        <ProductGrid products={related} />
      </div>

      {/* Mobile sticky buy bar */}
      <div className="fixed right-0 bottom-0 left-0 z-[60] flex items-center gap-3 border-t border-gray-100 bg-white p-3 shadow-[0_-6px_24px_rgba(0,14,53,0.08)] lg:hidden">
        <div className="flex-none">
          <div className="text-[11px] text-gray-400">Mulai</div>
          <div className="font-mono text-[19px] font-extrabold text-brand">
            {formatPrice(product.price)}
          </div>
        </div>
        <button
          type="button"
          aria-label="Tambah ke keranjang"
          onClick={() => add(product, finalQty)}
          className="flex h-[50px] w-[52px] flex-none items-center justify-center rounded-[13px] border-[1.5px] border-gray-200 bg-white text-ink"
        >
          <ShoppingCart className="h-5 w-5" />
        </button>
        <a
          href={waHref()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-[50px] flex-1 items-center justify-center gap-2.5 rounded-[13px] bg-brand text-[15.5px] font-bold text-white"
        >
          <WhatsAppIcon className="h-[19px] w-[19px]" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
