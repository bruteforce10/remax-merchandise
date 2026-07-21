import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";

import { COMPANY, SOCIALS } from "@/lib/constants";
import { CATEGORY_MAP, FOOTER_CATEGORY_SLUGS } from "@/lib/data/catalog";

const QUICK_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Cari Produk", href: "/search" },
  { label: "Keranjang Penawaran", href: "/cart" },
  { label: "Kontak", href: "/contact" },
];

export function SiteFooter(): ReactElement {
  const footerCategories = FOOTER_CATEGORY_SLUGS.map((slug) => CATEGORY_MAP[slug]).filter(
    (c): c is NonNullable<typeof c> => Boolean(c),
  );

  return (
    <footer className="mt-6 bg-gray-900 text-gray-300">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-9 px-6 pt-13 pb-7 sm:grid-cols-2 lg:grid-cols-4">
        <div className="min-w-[200px]">
          <div className="mb-4 flex items-center gap-2.5">
            <Image
              src="/assets/logo-mark.png"
              alt="RE/MAX"
              width={182}
              height={207}
              className="h-8 w-auto"
            />
            <span className="text-lg font-extrabold tracking-tight text-white">
              RE/MAX <span className="text-brand">Merchandise</span>
            </span>
          </div>
          <p className="mb-4 max-w-[280px] text-sm leading-relaxed">
            Katalog merchandise premium &amp; custom untuk agen, kantor, dan mitra
            korporat RE/MAX Indonesia.
          </p>
          <div className="flex gap-2.5">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-white/10 text-[13px] font-bold text-white transition-colors hover:bg-brand"
              >
                {s.short}
              </a>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 text-[13px] font-bold tracking-[0.06em] text-white uppercase">
            Tautan Cepat
          </div>
          <div className="flex flex-col gap-2.5">
            {QUICK_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-gray-300 transition-colors hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 text-[13px] font-bold tracking-[0.06em] text-white uppercase">
            Kategori
          </div>
          <div className="flex flex-col gap-2.5">
            {footerCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                className="text-sm text-gray-300 transition-colors hover:text-white"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 text-[13px] font-bold tracking-[0.06em] text-white uppercase">
            Kontak
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <span className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-brand" />
              {COMPANY.phoneDisplay}
            </span>
            <span className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-brand" />
              {COMPANY.email}
            </span>
            <span className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              {COMPANY.address}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-6 py-5 text-[13px] text-gray-500">
          <span>
            © {new Date().getFullYear()} RE/MAX Indonesia Merchandise. Seluruh hak
            cipta dilindungi.
          </span>
          <span>Bukan platform pembayaran — hanya permintaan penawaran.</span>
        </div>
      </div>
    </footer>
  );
}
