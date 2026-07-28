import type { ReactElement } from "react";

import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { generalMessage, waLink } from "@/lib/whatsapp";

export function CtaBanner(): ReactElement {
  return (
    <section className="mx-auto max-w-[1280px] px-6 pt-11 pb-5">
      <div className="flex flex-wrap items-center justify-between gap-6 overflow-hidden rounded-[20px] bg-gradient-to-br from-brand to-brand-dark px-8 py-12 text-white sm:px-11">
        <div className="max-w-[560px]">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-[30px]">
            Butuh Merchandise Custom?
          </h2>
          <p className="mt-2.5 text-base leading-relaxed text-[#FCE4E6]">
            Konsultasikan kebutuhan seragam, event kit, dan corporate gift Anda.
            Tim kami bantu dari desain hingga produksi.
          </p>
        </div>
        <a
          href={waLink(generalMessage())}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-14 items-center gap-2.5 rounded-btn bg-white px-7 text-[16.5px] font-medium text-brand-dark shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-transform hover:-translate-y-0.5"
        >
          <WhatsAppIcon className="h-5 w-5" />
          Chat via WhatsApp
        </a>
      </div>
    </section>
  );
}
