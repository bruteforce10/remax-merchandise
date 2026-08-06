"use client";

import { Minus, Plus } from "lucide-react";
import * as React from "react";

interface Faq {
  q: string;
  a: string;
}

const FAQS: Faq[] = [
  {
    q: "Apakah ada minimum order?",
    a: "Tidak ada minimum order. Semua produk tersedia ready stock dan bisa dipesan sesuai jumlah stok yang tertera di halaman produk.",
  },
  {
    q: "Berapa lama pesanan diproses?",
    a: "Pesanan diproses paling lama 7 hari kerja setelah pembayaran diterima, lalu dikirim sesuai kurir yang Anda pilih. Status pesanan bisa dipantau di halaman lacak.",
  },
  {
    q: "Apakah warna dan ukuran bisa dipilih?",
    a: "Bisa, sebatas pilihan yang tersedia pada tiap produk. Katalog ini hanya menjual merchandise resmi REMAX dengan desain yang sudah ditentukan — tidak melayani pesanan desain atau logo sendiri.",
  },
  {
    q: "Bagaimana cara memesan?",
    a: "Tambahkan produk ke keranjang lalu kirim ke WhatsApp kami untuk mendapatkan penawaran. Website ini bukan platform pembayaran — semua transaksi dilanjutkan bersama tim kami.",
  },
];

export function FaqAccordion(): React.JSX.Element {
  const [open, setOpen] = React.useState(0);

  return (
    <div>
      {FAQS.map((f, i) => {
        const isOpen = i === open;
        return (
          <div key={f.q} className="border-b border-gray-200 last:border-b-0">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-3 py-3.5 text-left"
            >
              <span className="text-[14.5px] font-semibold text-ink">{f.q}</span>
              {isOpen ? (
                <Minus className="h-[18px] w-[18px] flex-none text-gray-400" />
              ) : (
                <Plus className="h-[18px] w-[18px] flex-none text-gray-400" />
              )}
            </button>
            {isOpen && (
              <div className="pb-3.5 text-sm leading-relaxed text-body">
                {f.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
