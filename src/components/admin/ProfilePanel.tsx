"use client";

import { Monitor, Shield, Smartphone, type LucideIcon } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

const FIELD =
  "h-11 rounded-btn border border-admin-border bg-admin-bg px-3.5 text-sm text-ink outline-none focus:border-brand focus:bg-white";
const LABEL = "text-[13px] font-semibold text-gray-600";
const CARD = "rounded-card border border-admin-border bg-white p-5.5";

const SESSIONS: { icon: LucideIcon; device: string; meta: string; current: boolean }[] = [
  { icon: Monitor, device: "Chrome · macOS", meta: "Jakarta, Indonesia · Aktif sekarang", current: true },
  { icon: Smartphone, device: "Safari · iPhone", meta: "Jakarta, Indonesia · 2 jam lalu", current: false },
  { icon: Monitor, device: "Edge · Windows", meta: "Bandung, Indonesia · Kemarin", current: false },
];

export function ProfilePanel(): React.JSX.Element {
  const [twoFa, setTwoFa] = React.useState(true);

  return (
    <div className="max-w-[820px] animate-[rmx-fade_.3s_ease]">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">Profil Admin</h1>
      <p className="mt-0.5 mb-6 text-[14.5px] text-gray-500">Kelola akun dan keamanan</p>

      <div className="flex flex-col gap-[18px]">
        {/* Avatar */}
        <section className={`${CARD} flex flex-wrap items-center gap-5`}>
          <span className="flex h-[76px] w-[76px] flex-none items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-[28px] font-extrabold text-white">
            AD
          </span>
          <div className="min-w-[180px] flex-1">
            <div className="text-[19px] font-extrabold text-ink">Admin REMAX</div>
            <div className="text-sm text-gray-500">admin@remax.co.id</div>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-pill bg-brand-subtle px-3 py-1 text-[12px] font-bold text-brand">
              <Shield className="h-[13px] w-[13px]" />
              Super Admin
            </span>
          </div>
          <button
            type="button"
            onClick={() => toast.success("Pilih foto baru")}
            className="h-[42px] rounded-[11px] border border-admin-border bg-white px-4 text-sm font-semibold hover:bg-gray-50"
          >
            Ganti Foto
          </button>
        </section>

        {/* Account */}
        <section className={CARD}>
          <h3 className="mb-[18px] text-base font-extrabold text-ink">Informasi Akun</h3>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className={LABEL}>Nama</span>
              <input defaultValue="Admin REMAX" className={FIELD} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={LABEL}>Email</span>
              <input defaultValue="admin@remax.co.id" className={FIELD} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={LABEL}>Telepon</span>
              <input defaultValue="0895 0904 6152" className={FIELD} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={LABEL}>Peran</span>
              <input
                value="Super Admin"
                disabled
                className="h-11 rounded-btn border border-admin-border bg-gray-100 px-3.5 text-sm text-gray-400"
              />
            </label>
          </div>
        </section>

        {/* Security */}
        <section className={CARD}>
          <h3 className="mb-1.5 text-base font-extrabold text-ink">Keamanan</h3>
          <div className="flex flex-wrap items-center justify-between gap-3.5 border-b border-gray-100 py-3.5">
            <div>
              <div className="text-[14.5px] font-bold text-ink">Ubah Password</div>
              <div className="text-[13px] text-gray-400">Terakhir diubah 3 bulan lalu</div>
            </div>
            <button
              type="button"
              onClick={() => toast.success("Formulir ubah password")}
              className="h-[38px] rounded-[10px] border border-admin-border bg-white px-3.5 text-[13.5px] font-semibold hover:bg-gray-50"
            >
              Ubah
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3.5 py-3.5">
            <div>
              <div className="flex items-center gap-2 text-[14.5px] font-bold text-ink">
                Two-Factor Authentication
                {twoFa && (
                  <span className="rounded-pill bg-success-subtle px-2.5 py-0.5 text-[11px] font-bold text-success">
                    Aktif
                  </span>
                )}
              </div>
              <div className="text-[13px] text-gray-400">Keamanan ekstra saat login</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={twoFa}
              aria-label="Two-factor authentication"
              onClick={() => setTwoFa((v) => !v)}
              className={cn(
                "relative h-[26px] w-[46px] flex-none rounded-pill transition-colors",
                twoFa ? "bg-brand" : "bg-gray-200",
              )}
            >
              <span
                className={cn(
                  "absolute top-[3px] h-5 w-5 rounded-full bg-white shadow-sm transition-all",
                  twoFa ? "left-[23px]" : "left-[3px]",
                )}
              />
            </button>
          </div>
        </section>

        {/* Sessions */}
        <section className={CARD}>
          <div className="mb-1.5 flex items-center justify-between">
            <h3 className="text-base font-extrabold text-ink">Sesi Aktif</h3>
            <button
              type="button"
              onClick={() => toast.success("Keluar dari semua perangkat")}
              className="h-9 rounded-[10px] border border-[#F8D2D7] bg-white px-3.5 text-[13px] font-semibold text-danger hover:bg-brand-subtle"
            >
              Keluar dari semua perangkat
            </button>
          </div>
          {SESSIONS.map((s) => (
            <div key={s.device} className="flex items-center gap-3.5 border-b border-gray-50 py-3 last:border-b-0">
              <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-gray-50 text-gray-500">
                <s.icon className="h-[19px] w-[19px]" />
              </span>
              <div className="flex-1">
                <div className="text-[13.5px] font-bold text-ink">{s.device}</div>
                <div className="text-[12.5px] text-gray-400">{s.meta}</div>
              </div>
              {s.current && (
                <span className="rounded-pill bg-success-subtle px-2.5 py-0.5 text-[11px] font-bold text-success">
                  Perangkat ini
                </span>
              )}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
