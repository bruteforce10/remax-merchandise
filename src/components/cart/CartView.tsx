"use client";

import { CreditCard, Info, Lock, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { createOrder } from "@/actions/orders";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { categoryName } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";
import { cartMessage, waLink } from "@/lib/whatsapp";
import { lineKey, lineUnitPrice, useCart } from "@/providers/CartProvider";

interface CartViewProps {
  isAuthenticated: boolean;
  userEmail: string | null;
}

export function CartView({
  isAuthenticated,
  userEmail,
}: CartViewProps): React.JSX.Element {
  const {
    lines,
    count,
    totalQty,
    estimatedTotal,
    hydrated,
    setQty,
    remove,
    clear,
    sessionId,
  } = useCart();
  const router = useRouter();
  const [checkingOut, setCheckingOut] = React.useState(false);

  async function handleGoogleLogin(): Promise<void> {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/cart`,
      },
    });
  }

  async function handleSignOut(): Promise<void> {
    await createClient().auth.signOut();
    router.refresh();
  }

  async function handleCheckout(): Promise<void> {
    setCheckingOut(true);
    const res = await createOrder({
      sessionId,
      items: lines.map((l) => ({
        sku: lineKey(l),
        productSku: l.product.sku,
        productSlug: l.product.slug,
        name: l.product.name,
        options: l.variant?.options ?? {},
        qty: l.qty,
        unitPrice: lineUnitPrice(l),
      })),
    });
    if (!res.success || !res.data) {
      toast.error(res.message);
      setCheckingOut(false);
      return;
    }
    const href = waLink(
      cartMessage(
        lines.map((l) => ({
          product: l.product,
          qty: l.qty,
          options: l.variant?.options,
          unitPrice: lineUnitPrice(l),
        })),
        res.data.ref,
      ),
    );
    clear();
    window.location.href = href;
  }

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
              const key = lineKey(line);
              const unitPrice = lineUnitPrice(line);
              return (
                <div
                  key={key}
                  className="flex flex-wrap items-center gap-4 rounded-card border border-gray-100 bg-white p-4"
                >
                  <Link
                    href={`/products/${line.product.slug}`}
                    className="relative flex h-[84px] w-[84px] flex-none items-center justify-center overflow-hidden rounded-[12px] bg-gradient-to-br from-[#f4f4f6] to-[#e9eaee] p-1.5 text-center text-[10px] font-bold text-gray-400"
                  >
                    {line.product.imageUrl ? (
                      <Image
                        src={line.product.imageUrl}
                        alt={line.product.name}
                        fill
                        sizes="84px"
                        className="object-cover"
                      />
                    ) : (
                      line.product.short
                    )}
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
                    {line.variant &&
                      Object.keys(line.variant.options).length > 0 && (
                        <div className="mt-1 mb-0.5 flex flex-wrap gap-1.5">
                          {Object.entries(line.variant.options).map(([k, v]) => (
                            <span
                              key={k}
                              className="inline-flex items-center rounded-pill bg-gray-100 px-2.5 py-0.5 text-[11.5px] font-semibold text-gray-600"
                            >
                              {k}: {v}
                            </span>
                          ))}
                        </div>
                      )}
                    <div className="text-[13px] text-gray-500">
                      SKU {line.variant?.sku ?? line.product.sku} ·{" "}
                      <span className="font-mono font-bold text-brand">
                        {formatPrice(unitPrice)}
                      </span>
                      /pcs
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="inline-flex items-center overflow-hidden rounded-[11px] border border-gray-200">
                      <button
                        type="button"
                        aria-label="Kurangi"
                        onClick={() => setQty(key, line.qty - step)}
                        className="h-[42px] w-[38px] bg-white text-lg text-gray-600 hover:bg-gray-50"
                      >
                        −
                      </button>
                      <input
                        value={line.qty}
                        onChange={(e) =>
                          setQty(key, parseInt(e.target.value, 10))
                        }
                        inputMode="numeric"
                        aria-label={`Jumlah ${line.product.name}`}
                        className="h-[42px] w-[60px] border-x border-gray-100 text-center font-mono text-[15px] font-bold outline-none"
                      />
                      <button
                        type="button"
                        aria-label="Tambah"
                        onClick={() => setQty(key, line.qty + step)}
                        className="h-[42px] w-[38px] bg-white text-lg text-gray-600 hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(key)}
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
              <div className="mt-3 flex items-center gap-2 rounded-[10px] bg-amber-50 px-3 py-2.5 text-[13px] font-semibold text-amber-700">
                <Info className="h-[16px] w-[16px] flex-none text-amber-500" />
                Harga belum termasuk ongkos kirim
              </div>
              <p className="mt-2 text-xs leading-relaxed text-gray-400">
                *Estimasi berdasarkan harga mulai. Harga final menyesuaikan
                spesifikasi &amp; jumlah, dikonfirmasi oleh tim kami.
              </p>
            </div>

            <div className="flex flex-col justify-center gap-3 rounded-[18px] border border-gray-100 p-6">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => void handleCheckout()}
                  disabled={checkingOut}
                  className="inline-flex h-14 items-center justify-center gap-2.5 rounded-[14px] bg-brand text-[16.5px] font-bold text-white shadow-cta hover:bg-brand-hover disabled:opacity-60"
                >
                  <CreditCard className="h-[21px] w-[21px]" />
                  {checkingOut ? "Memproses…" : "Checkout Pembayaran"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void handleGoogleLogin()}
                  className="inline-flex h-14 items-center justify-center gap-2.5 rounded-[14px] bg-brand text-[16.5px] font-bold text-white shadow-cta hover:bg-brand-hover"
                >
                  <GoogleIcon className="h-[19px] w-[19px]" />
                  Login dengan Google untuk Checkout
                </button>
              )}
              <Link
                href="/search"
                className="inline-flex h-[52px] items-center justify-center rounded-[14px] border-[1.5px] border-gray-200 bg-white text-[15px] font-semibold text-ink hover:bg-gray-50"
              >
                Lanjut Belanja
              </Link>
              {isAuthenticated ? (
                <div className="mt-0.5 flex flex-wrap items-center justify-center gap-1.5 text-[12.5px] text-gray-400">
                  <span className="truncate">
                    Masuk sebagai{" "}
                    <span className="font-semibold text-gray-500">{userEmail}</span>
                  </span>
                  <span aria-hidden>·</span>
                  <button
                    type="button"
                    onClick={() => void handleSignOut()}
                    className="font-semibold text-gray-500 underline underline-offset-2 hover:text-brand"
                  >
                    Keluar
                  </button>
                </div>
              ) : (
                <div className="mt-0.5 flex items-center justify-center gap-2 text-[12.5px] text-gray-400">
                  <Lock className="h-[13px] w-[13px]" />
                  Login diperlukan untuk checkout
                </div>
              )}
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

function GoogleIcon({ className }: { className?: string }): React.JSX.Element {
  return (
    <span className={`flex items-center justify-center rounded-full bg-white p-1 ${className ?? ""}`}>
      <svg viewBox="0 0 48 48" aria-hidden className="h-full w-full">
        <path
          fill="#EA4335"
          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
        />
        <path
          fill="#4285F4"
          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
        />
        <path
          fill="#FBBC05"
          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
        />
        <path
          fill="#34A853"
          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
        />
      </svg>
    </span>
  );
}
