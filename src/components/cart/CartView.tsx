"use client";

import { CreditCard, Lock, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { categoryName } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { cartMessage, waLink } from "@/lib/whatsapp";
import { useCart } from "@/providers/CartProvider";

export function CartView(): React.JSX.Element {
  const { lines, count, totalQty, estimatedTotal, hydrated, setQty, remove } =
    useCart();

  return (
    <div className="mx-auto max-w-[1280px] animate-[rmx-fade_.3s_ease] px-6 pt-6 pb-15">
      <div className="mb-[18px]">
        <Breadcrumb
          items={[{ label: "Beranda", href: "/" }, { label: "Keranjang" }]}
        />
      </div>
      <h1 className="text-[26px] font-extrabold tracking-tight text-ink sm:text-[34px]">
        Keranjang Penawaran
      </h1>
      <p className="mt-1 mb-6.5 text-[15px] text-gray-500">
        Kirim daftar produk ini ke tim kami untuk mendapatkan penawaran harga
        (quotation).
      </p>

      {!hydrated ? (
        <div className="min-h-[240px]" />
      ) : lines.length === 0 ? (
        <div className="rounded-[20px] border border-dashed border-gray-200 px-5 py-20 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[22px] bg-gray-50 text-gray-300">
            <ShoppingCart className="h-[38px] w-[38px]" />
          </div>
          <div className="mb-1.5 text-xl font-extrabold text-ink">
            Keranjang masih kosong
          </div>
          <div className="mx-auto mb-[22px] max-w-[360px] text-[14.5px] text-gray-500">
            Jelajahi katalog dan tambahkan produk yang ingin Anda tanyakan
            penawarannya.
          </div>
          <Link
            href="/search"
            className="inline-flex h-[50px] items-center rounded-[13px] bg-brand px-6 text-[15px] font-bold text-white hover:bg-brand-hover"
          >
            Jelajahi Produk
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3.5">
            {lines.map((line) => {
              const step = 1;
              return (
                <div
                  key={line.product.sku}
                  className="flex flex-wrap items-center gap-4 rounded-card border border-gray-100 bg-white p-4"
                >
                  <Link
                    href={`/products/${line.product.slug}`}
                    className="flex h-[84px] w-[84px] flex-none items-center justify-center rounded-[12px] bg-gradient-to-br from-[#f4f4f6] to-[#e9eaee] p-1.5 text-center text-[10px] font-bold text-gray-400"
                  >
                    {line.product.short}
                  </Link>
                  <div className="min-w-[160px] flex-1">
                    <div className="text-[11px] font-semibold tracking-[0.05em] text-gray-400 uppercase">
                      {categoryName(line.product.categorySlug)}
                    </div>
                    <Link
                      href={`/products/${line.product.slug}`}
                      className="my-0.5 block text-base font-bold text-ink"
                    >
                      {line.product.name}
                    </Link>
                    <div className="text-[13px] text-gray-500">
                      SKU {line.product.sku} · Mulai{" "}
                      <span className="font-mono font-bold text-brand">
                        {formatPrice(line.product.price)}
                      </span>
                      /pcs
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="inline-flex items-center overflow-hidden rounded-[11px] border border-gray-200">
                      <button
                        type="button"
                        aria-label="Kurangi"
                        onClick={() => setQty(line.product.sku, line.qty - step)}
                        className="h-[42px] w-[38px] bg-white text-lg text-gray-600 hover:bg-gray-50"
                      >
                        −
                      </button>
                      <input
                        value={line.qty}
                        onChange={(e) =>
                          setQty(line.product.sku, parseInt(e.target.value, 10))
                        }
                        inputMode="numeric"
                        aria-label={`Jumlah ${line.product.name}`}
                        className="h-[42px] w-[60px] border-x border-gray-100 text-center font-mono text-[15px] font-bold outline-none"
                      />
                      <button
                        type="button"
                        aria-label="Tambah"
                        onClick={() => setQty(line.product.sku, line.qty + step)}
                        className="h-[42px] w-[38px] bg-white text-lg text-gray-600 hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(line.product.sku)}
                      className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-gray-400 hover:text-brand"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Hapus
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="rounded-[18px] border border-gray-100 bg-gray-50 p-6">
              <h3 className="mb-4 text-lg font-extrabold text-ink">
                Ringkasan Penawaran
              </h3>
              <SummaryRow label="Jumlah jenis produk" value={String(count)} />
              <SummaryRow label="Estimasi total qty" value={`${totalQty} pcs`} />
              <div className="flex items-center justify-between pt-3.5 pb-0.5">
                <span className="text-[14.5px] text-gray-500">Estimasi nilai</span>
                <span className="font-mono text-xl font-extrabold text-brand">
                  {formatPrice(estimatedTotal)}
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-gray-400">
                *Estimasi berdasarkan harga mulai. Harga final menyesuaikan
                spesifikasi &amp; jumlah, dikonfirmasi oleh tim kami.
              </p>
            </div>

            <div className="flex flex-col justify-center gap-3 rounded-[18px] border border-gray-100 p-6">
              <a
                href={waLink(
                  cartMessage(lines.map((l) => ({ product: l.product, qty: l.qty }))),
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center justify-center gap-2.5 rounded-[14px] bg-brand text-[16.5px] font-bold text-white shadow-cta hover:bg-brand-hover"
              >
                <CreditCard className="h-[21px] w-[21px]" />
                Checkout Pembayaran
              </a>
              <Link
                href="/search"
                className="inline-flex h-[52px] items-center justify-center rounded-[14px] border-[1.5px] border-gray-200 bg-white text-[15px] font-semibold text-ink hover:bg-gray-50"
              >
                Lanjut Belanja
              </Link>
              <div className="mt-0.5 flex items-center justify-center gap-2 text-[12.5px] text-gray-400">
                <Lock className="h-[13px] w-[13px]" />
                Permintaan penawaran — tanpa komitmen pembelian
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}): React.JSX.Element {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 py-2.5">
      <span className="text-[14.5px] text-gray-500">{label}</span>
      <span className="font-mono text-[15px] font-bold text-ink">{value}</span>
    </div>
  );
}
