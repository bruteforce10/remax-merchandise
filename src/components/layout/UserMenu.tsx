"use client";

import { LogOut, Package, User as UserIcon } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { useAuth } from "@/providers/AuthProvider";

function initialsFromEmail(email: string): string {
  return (email.split("@")[0] || "US").slice(0, 2).toUpperCase();
}

/** Navbar account control: login icon when signed out, avatar dropdown when in. */
export function UserMenu(): React.JSX.Element {
  const { user, signOut } = useAuth();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent): void => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  if (!user) {
    return (
      <Link
        href="/account/login"
        aria-label="Masuk ke akun"
        className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-pill border border-gray-200 bg-white text-ink hover:border-border-strong"
      >
        <UserIcon className="h-[19px] w-[19px]" />
      </Link>
    );
  }

  const email = user.email ?? "";

  return (
    <div className="relative flex-none" ref={ref}>
      <button
        type="button"
        aria-label="Menu akun"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-[13.5px] font-bold text-white"
      >
        {initialsFromEmail(email)}
      </button>
      {open && (
        <div className="absolute top-13 right-0 z-[60] w-60 overflow-hidden rounded-card border border-gray-200 bg-white p-1.5 shadow-menu">
          <div className="border-b border-gray-200 px-3 py-2.5">
            <div className="text-[11px] font-semibold tracking-[0.05em] text-gray-400 uppercase">
              Masuk sebagai
            </div>
            <div className="truncate text-[13.5px] font-semibold text-ink">
              {email}
            </div>
          </div>
          <Link
            href="/account/orders"
            onClick={() => setOpen(false)}
            className="mt-1 flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[14px] font-semibold text-gray-700 hover:bg-gray-50"
          >
            <Package className="h-[18px] w-[18px] text-gray-400" />
            Riwayat Pesanan
          </Link>
          <Link
            href="/account/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[14px] font-semibold text-gray-700 hover:bg-gray-50"
          >
            <UserIcon className="h-[18px] w-[18px] text-gray-400" />
            Profil Saya
          </Link>
          <div className="my-1 h-px bg-gray-200" />
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              void signOut();
            }}
            className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-[14px] font-semibold text-danger hover:bg-brand-subtle"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Keluar
          </button>
        </div>
      )}
    </div>
  );
}
