"use client";

import * as React from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right";
  widthClassName?: string;
  ariaLabel?: string;
  children: React.ReactNode;
}

/** Lightweight slide-in panel with overlay, Escape-to-close, and scroll lock. */
export function Drawer({
  open,
  onClose,
  side = "right",
  widthClassName = "w-[min(88vw,360px)]",
  ariaLabel,
  children,
}: DrawerProps): React.ReactNode {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[85]"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      <button
        type="button"
        aria-label="Tutup"
        className="absolute inset-0 cursor-default bg-gray-900/40"
        onClick={onClose}
      />
      <div
        className={cn(
          "absolute top-0 bottom-0 flex flex-col bg-white shadow-menu",
          side === "right"
            ? "right-0 animate-[rmx-slide-in-right_.25s_ease]"
            : "left-0 animate-[rmx-slide-in-left_.25s_ease]",
          widthClassName,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
