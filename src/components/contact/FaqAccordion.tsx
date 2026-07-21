"use client";

import { Minus, Plus } from "lucide-react";
import * as React from "react";

interface Faq {
  q: string;
  a: string;
}

const FAQS: Faq[] = [
  {
    q: "Berapa minimum order (MOQ)?",
    a: "MOQ berbeda tiap produk, umumnya mulai dari 12 pcs untuk apparel dan 50–100 pcs untuk item promosi. Detail MOQ tertera di setiap produk.",
  },
  {
    q: "Berapa lama waktu produksi?",
    a: "Waktu produksi berkisar 3–14 hari kerja tergantung jenis produk dan jumlah, dihitung setelah desain dan pembayaran DP disetujui.",
  },
  {
    q: "Apakah bisa custom logo dan warna?",
    a: "Tentu. Kami melayani custom penuh: bordir, sablon, laser engrave, sublimasi, hingga pemilihan warna sesuai brand Anda.",
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
          <div key={f.q} className="border-b border-gray-100 last:border-b-0">
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
              <div className="pb-3.5 text-sm leading-relaxed text-gray-500">
                {f.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
