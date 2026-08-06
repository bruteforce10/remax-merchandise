"use client";

import Image from "next/image";
import * as React from "react";

import { categoryCoverSrc } from "@/lib/categoryImages";

/**
 * Hero cover background for a category, resolved by slug convention
 * (public/category-covers/<slug>.webp). If the file does not exist the image
 * errors out and this renders nothing, letting the section's default gradient
 * show through. Client component so the onError fallback works at runtime.
 */
export function CategoryCover({ slug }: { slug: string }): React.JSX.Element | null {
  const [failed, setFailed] = React.useState(false);
  if (failed) return null;

  return (
    <>
      <Image
        src={categoryCoverSrc(slug)}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        onError={() => setFailed(true)}
      />
      {/* Scrim keeps the white title/description readable over any cover */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 to-[#2a1114]/60" />
    </>
  );
}
