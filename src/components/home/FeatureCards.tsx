import { Gem, Palette, Truck, Zap, type LucideIcon } from "lucide-react";
import type { ReactElement } from "react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: Zap,
    title: "Produksi Cepat",
    description: "Pengerjaan mulai 3 hari kerja untuk item ready stock.",
  },
  {
    icon: Gem,
    title: "Kualitas Premium",
    description: "Bahan pilihan dengan kontrol kualitas yang ketat.",
  },
  {
    icon: Palette,
    title: "Corporate Branding",
    description: "Bordir, sablon, laser, sublimasi sesuai identitas brand Anda.",
  },
  {
    icon: Truck,
    title: "Kirim Nasional",
    description: "Pengiriman ke seluruh kota di Indonesia.",
  },
];

export function FeatureCards(): ReactElement {
  return (
    <section className="mx-auto max-w-[1280px] px-6 pt-11 pb-2">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="flex flex-col gap-3 rounded-card border border-gray-100 bg-gray-50 px-[22px] py-[26px]"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-[12px] border border-gray-100 bg-white text-brand">
              <f.icon className="h-[22px] w-[22px]" />
            </span>
            <div className="text-[16.5px] font-bold text-ink">{f.title}</div>
            <div className="text-sm leading-relaxed text-gray-500">
              {f.description}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
