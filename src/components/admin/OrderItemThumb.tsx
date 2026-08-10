import { Package } from "lucide-react";
import Image from "next/image";
import type { ReactElement } from "react";

import { cn } from "@/lib/utils";

export interface OrderItemThumbProps {
  src: string | null;
  alt: string;
  /** Rendered box size in px — also drives the `sizes` hint. */
  size?: number;
  className?: string;
}

/**
 * Square product thumbnail for order views. Order items only snapshot the
 * product slug, so the caller resolves the URL and passes null when the product
 * has no image (or was deleted from the CMS) — this falls back to a box icon.
 */
export function OrderItemThumb({
  src,
  alt,
  size = 36,
  className,
}: OrderItemThumbProps): ReactElement {
  return (
    <span
      style={{ width: size, height: size }}
      className={cn(
        "relative flex flex-none items-center justify-center overflow-hidden rounded-btn bg-gradient-to-br from-[#f1f2f4] to-[#e6e7ea] text-gray-400",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={`${size * 2}px`}
          className="object-cover"
        />
      ) : (
        <Package className="h-1/2 w-1/2" />
      )}
    </span>
  );
}
