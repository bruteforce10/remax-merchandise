"use client";

import type { ReactElement } from "react";
import { usePathname } from "next/navigation";

import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { generalMessage, waLink } from "@/lib/whatsapp";

/** Persistent WhatsApp CTA. Lifts above the product sticky buy bar on mobile. */
export function FloatingWhatsApp(): ReactElement {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const raised = isMobile && (pathname?.startsWith("/products/") ?? false);

  return (
    <a
      href={waLink(generalMessage())}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat via WhatsApp"
      className={cn(
        "fixed right-5 z-[70] inline-flex h-14 items-center gap-2.5 rounded-pill bg-whatsapp pr-5 pl-[18px] font-semibold text-white shadow-fab transition-transform hover:-translate-y-0.5",
        raised ? "bottom-[86px]" : "bottom-5",
      )}
    >
      <WhatsAppIcon className="h-6 w-6" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
