"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";
import type { Banner } from "@/types/banner";

export function HeroSlider({
  banners,
}: {
  banners: Banner[];
}): React.JSX.Element {
  const [index, setIndex] = React.useState(0);
  const count = banners.length;

  React.useEffect(() => {
    if (count <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [count]);

  if (count === 0) return <></>;

  const current = banners[index] ?? banners[0];
  const go = (i: number): void => setIndex(((i % count) + count) % count);

  return (
    <section className="mx-auto max-w-[1280px] px-6 pt-7 pb-2">
      <div className="relative flex min-h-[400px] items-center overflow-hidden rounded-[20px] border border-gray-200 bg-white sm:min-h-[440px]">
        {current.imageUrl ? (
          <Image
            key={current.id}
            src={current.imageUrl}
            alt={current.alt}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="animate-[rmx-fade_.45s_ease] object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-50 bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.035)_0,rgba(0,0,0,0.035)_22px,transparent_22px,transparent_44px)]" />
        )}

        {current.link && (
          <Link
            href={current.link}
            aria-label={current.alt || "Buka banner"}
            className="absolute inset-0 z-10"
          />
        )}

        <div
          key={index}
          className="relative w-full animate-[rmx-fade_.45s_ease]"
        />

        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Banner sebelumnya"
              onClick={() => go(index - 1)}
              className="absolute top-1/2 left-4 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/20 text-white transition-colors hover:bg-black/35"
            >
              <ChevronLeft className="h-[22px] w-[22px]" />
            </button>
            <button
              type="button"
              aria-label="Banner berikutnya"
              onClick={() => go(index + 1)}
              className="absolute top-1/2 right-4 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/20 text-white transition-colors hover:bg-black/35"
            >
              <ChevronRight className="h-[22px] w-[22px]" />
            </button>
            <div className="absolute bottom-7 left-8 z-20 flex gap-2 sm:left-12">
              {banners.map((b, i) => (
                <button
                  key={b.id}
                  type="button"
                  aria-label={`Ke banner ${i + 1}`}
                  onClick={() => go(i)}
                  className={cn(
                    "h-1.5 rounded-pill transition-all",
                    i === index ? "w-7 bg-brand" : "w-2 bg-black/20",
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
