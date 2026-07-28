import { Clock, Headset, Mail, MapPin } from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { FaqAccordion } from "@/components/contact/FaqAccordion";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { COMPANY } from "@/lib/constants";
import { generalMessage, waLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Kontak",
  description:
    "Hubungi tim RE/MAX Merchandise via WhatsApp, email, atau kunjungi kantor kami di Jakarta Selatan. Konsultasi kebutuhan merchandise custom Anda.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage(): ReactNode {
  return (
    <div className="animate-[rmx-fade_.3s_ease]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-[#2a1114] text-white">
        <div className="mx-auto max-w-[1280px] px-6 pt-11 pb-13 text-center">
          <span className="mb-[18px] inline-flex items-center gap-[7px] rounded-pill bg-white/12 px-3.5 py-1.5 text-[12.5px] font-semibold">
            <Headset className="h-[15px] w-[15px] text-[#FF6472]" />
            Kami siap membantu
          </span>
          <h1 className="text-[34px] font-semibold tracking-tight sm:text-[40px]">
            Butuh Bantuan?
          </h1>
          <p className="mx-auto mt-3 max-w-[560px] text-base leading-relaxed text-gray-300">
            Konsultasikan kebutuhan merchandise Anda. Tim corporate kami akan
            merespons dengan cepat di jam kerja.
          </p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="mx-auto max-w-[1280px] px-6 pt-9 pb-5">
        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-2.5 rounded-card border border-gray-200 p-6">
            <span className="flex h-[46px] w-[46px] items-center justify-center rounded-card bg-success-subtle text-success">
              <WhatsAppIcon className="h-[22px] w-[22px]" />
            </span>
            <div className="text-[15px] font-semibold text-ink">WhatsApp</div>
            <div className="text-sm text-gray-500">{COMPANY.whatsappDisplay}</div>
            <a
              href={waLink(generalMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13.5px] font-semibold"
            >
              Chat sekarang →
            </a>
          </div>

          <div className="flex flex-col gap-2.5 rounded-card border border-gray-200 p-6">
            <span className="flex h-[46px] w-[46px] items-center justify-center rounded-card bg-brand-subtle text-brand">
              <Mail className="h-[22px] w-[22px]" />
            </span>
            <div className="text-[15px] font-semibold text-ink">Email</div>
            <div className="text-sm text-gray-500">{COMPANY.email}</div>
            <span className="text-[13.5px] text-gray-400">
              Balasan &lt; 1 hari kerja
            </span>
          </div>

          <div className="flex flex-col gap-2.5 rounded-card border border-gray-200 p-6">
            <span className="flex h-[46px] w-[46px] items-center justify-center rounded-card bg-info-subtle text-info">
              <MapPin className="h-[22px] w-[22px]" />
            </span>
            <div className="text-[15px] font-semibold text-ink">Kantor</div>
            <div className="text-sm leading-relaxed text-gray-500">
              {COMPANY.address}
            </div>
          </div>

          <div className="flex flex-col gap-2.5 rounded-card border border-gray-200 p-6">
            <span className="flex h-[46px] w-[46px] items-center justify-center rounded-card bg-warning-subtle text-warning">
              <Clock className="h-[22px] w-[22px]" />
            </span>
            <div className="text-[15px] font-semibold text-ink">Jam Operasional</div>
            <div className="text-sm leading-relaxed text-gray-500">
              Senin – Sabtu
              <br />
              09.00 – 18.00 WIB
            </div>
          </div>
        </div>
      </section>

      {/* Map + FAQ */}
      <section className="mx-auto max-w-[1280px] px-6 pt-5 pb-13">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-card border border-gray-200">
            <div className="relative flex h-[220px] items-center justify-center bg-gradient-to-br from-[#e9eaee] to-gray-200">
              <div className="absolute inset-0 bg-[linear-gradient(#d3d5db_1px,transparent_1px),linear-gradient(90deg,#d3d5db_1px,transparent_1px)] bg-[length:36px_36px] opacity-60" />
              <div className="relative text-center text-gray-500">
                <MapPin className="mx-auto h-[34px] w-[34px] text-brand" />
                <div className="mt-1.5 text-[13.5px] font-semibold">
                  RE/MAX Indonesia HQ
                </div>
                <div className="text-[12.5px] text-gray-400">Google Maps</div>
              </div>
            </div>
            <div className="flex items-center justify-between px-[18px] py-4">
              <span className="text-sm text-gray-600">{COMPANY.addressShort}</span>
              <a
                href={COMPANY.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13.5px] font-semibold"
              >
                Buka Maps →
              </a>
            </div>
          </div>

          <div className="rounded-card border border-gray-200 p-6">
            <h3 className="mb-2 text-[17px] font-semibold text-ink">
              Pertanyaan Umum (FAQ)
            </h3>
            <FaqAccordion />
          </div>
        </div>
      </section>
    </div>
  );
}
