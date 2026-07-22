"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";
import type { Banner } from "@/types/banner";

export function HeroSlider({ banners }: { banners: Banner[] }): React.JSX.Element {
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
      <div
        className="relative flex min-h-[400px] items-center overflow-hidden rounded-[24px] text-white sm:min-h-[440px]"
        style={{ background: current.gradient }}
      >
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.05)_0,rgba(255,255,255,0.05)_22px,transparent_22px,transparent_44px)] opacity-50" />

        <div key={index} className="relative w-full animate-[rmx-fade_.45s_ease]" />

        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Banner sebelumnya"
              onClick={() => go(index - 1)}
              className="absolute top-1/2 left-4 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30"
            >
              <ChevronLeft className="h-[22px] w-[22px]" />
            </button>
            <button
              type="button"
              aria-label="Banner berikutnya"
              onClick={() => go(index + 1)}
              className="absolute top-1/2 right-4 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30"
            >
              <ChevronRight className="h-[22px] w-[22px]" />
            </button>
            <div className="absolute bottom-7 left-8 flex gap-2 sm:left-12">
              {banners.map((b, i) => (
                <button
                  key={b.id}
                  type="button"
                  aria-label={`Ke banner ${i + 1}`}
                  onClick={() => go(i)}
                  className={cn(
                    "h-1.5 rounded-pill transition-all",
                    i === index ? "w-7 bg-brand" : "w-2 bg-white/40",
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
