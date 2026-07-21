import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export default function NotFound(): ReactNode {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="mx-auto w-full max-w-[1280px] px-6 py-5">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <Image
            src="/assets/logo-full.png"
            alt="RE/MAX"
            width={866}
            height={238}
            className="h-[26px] w-auto"
          />
          <span className="border-l border-gray-200 pl-2.5 text-[13px] font-semibold text-gray-400">
            Merchandise
          </span>
        </Link>
      </div>

      <div className="mx-auto flex max-w-[720px] flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <div className="text-[clamp(80px,16vw,150px)] leading-none font-black tracking-[-0.04em] text-ink">
          4<span className="text-brand">0</span>4
        </div>
        <h1 className="mt-3.5 text-[26px] font-extrabold text-ink">
          Halaman tidak ditemukan
        </h1>
        <p className="mx-auto mt-2.5 mb-7 max-w-[420px] text-[15.5px] leading-relaxed text-gray-500">
          Sepertinya halaman yang Anda cari sudah dipindahkan atau tidak
          tersedia. Mari kembali menjelajahi katalog.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-[50px] items-center rounded-[13px] bg-brand px-6 text-[15px] font-bold text-white hover:bg-brand-hover"
          >
            Kembali ke Beranda
          </Link>
          <Link
            href="/search"
            className="inline-flex h-[50px] items-center rounded-[13px] border-[1.5px] border-gray-200 bg-white px-[22px] text-[15px] font-semibold text-ink hover:bg-gray-50"
          >
            Cari Produk
          </Link>
        </div>
      </div>
    </div>
  );
}
