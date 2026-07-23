"use client";

import { Shield } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

const FIELD =
  "h-11 rounded-btn border border-admin-border bg-admin-bg px-3.5 text-sm text-ink outline-none focus:border-brand focus:bg-white";
const LABEL = "text-[13px] font-semibold text-gray-600";
const CARD = "rounded-card border border-admin-border bg-white p-5.5";

export function ProfilePanel(): React.JSX.Element {
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
          <div className="flex flex-wrap items-center justify-between gap-3.5 py-3.5">
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
        </section>
      </div>
    </div>
  );
}
