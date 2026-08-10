"use client";

import * as React from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  ariaLabel?: string;
  /** Overrides panel width/padding defaults (e.g. wider detail dialogs). */
  className?: string;
  children: React.ReactNode;
}

/** Centered modal dialog (portal, overlay, Escape, scroll-lock). */
export function Modal({
  open,
  onClose,
  ariaLabel,
  className,
  children,
}: ModalProps): React.ReactNode {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-5"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      <button
        type="button"
        aria-label="Tutup"
        className="absolute inset-0 cursor-default bg-black/50"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative w-full max-w-[440px] animate-[rmx-pop_.2s_ease] rounded-modal border border-hairline bg-white p-6 shadow-menu",
          className,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
