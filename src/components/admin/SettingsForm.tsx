"use client";

import { Check } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { COMPANY } from "@/lib/constants";

const FIELD =
  "h-11 rounded-btn border border-admin-border bg-admin-bg px-3.5 text-sm text-ink outline-none focus:border-brand focus:bg-white";
const LABEL = "text-[13px] font-semibold text-gray-600";
const CARD = "rounded-card border border-admin-border bg-white p-5.5";

const SOCIALS: { label: string; badge: string; value: string }[] = [
  { label: "Instagram", badge: "IG", value: "@remax.indonesia" },
  { label: "Facebook", badge: "FB", value: "REMAX Indonesia" },
  { label: "LinkedIn", badge: "IN", value: "remax-indonesia" },
  { label: "YouTube", badge: "YT", value: "@remaxindonesia" },
];

export function SettingsForm(): React.JSX.Element {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    toast.success("Pengaturan disimpan");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-[820px] animate-[rmx-fade_.3s_ease]"
    >
      <h1 className="text-2xl font-semibold tracking-tight text-ink">
        Pengaturan Website
      </h1>
      <p className="mt-0.5 mb-6 text-[14.5px] text-gray-500">
        Konfigurasi informasi perusahaan, SEO, dan sosial media
      </p>

      <div className="flex flex-col gap-[18px]">
        {/* Company */}
        <section className={CARD}>
          <h3 className="mb-[18px] text-base font-semibold text-ink">
            Informasi Perusahaan
          </h3>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <Field label="Nama Perusahaan" full>
              <input defaultValue={COMPANY.name} className={FIELD} />
            </Field>
            <Field label="Telepon">
              <input defaultValue={COMPANY.phoneDisplay} className={FIELD} />
            </Field>
            <Field label="WhatsApp">
              <input defaultValue={COMPANY.whatsappDisplay} className={FIELD} />
            </Field>
            <Field label="Email">
              <input defaultValue={COMPANY.email} className={FIELD} />
            </Field>
            <Field label="Google Maps">
              <input
                defaultValue="maps.google.com/remax-id"
                className={FIELD}
              />
            </Field>
            <Field label="Alamat" full>
              <input defaultValue={COMPANY.address} className={FIELD} />
            </Field>
          </div>
        </section>

        {/* SEO */}
        <section className={CARD}>
          <h3 className="mb-[18px] text-base font-semibold text-ink">
            SEO Website
          </h3>
          <div className="flex flex-col gap-3.5">
            <Field label="Default Meta Title">
              <input
                defaultValue="REMAX Gifts - Premium Corporate Gifts"
                className={FIELD}
              />
            </Field>
            <Field label="Default Meta Description">
              <textarea
                rows={2}
                defaultValue="Katalog gifts premium & custom untuk jaringan REMAX Indonesia."
                className="resize-y rounded-btn border border-admin-border bg-admin-bg px-3.5 py-3 text-sm outline-none focus:border-brand focus:bg-white"
              />
            </Field>
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <Field label="Google Analytics ID">
                <input
                  defaultValue="G-XXXXXXXXXX"
                  className={`${FIELD} font-mono`}
                />
              </Field>
              <Field label="Search Console">
                <input defaultValue="Terverifikasi" className={FIELD} />
              </Field>
            </div>
          </div>
        </section>

        {/* Social */}
        <section className={CARD}>
          <h3 className="mb-[18px] text-base font-semibold text-ink">
            Sosial Media
          </h3>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {SOCIALS.map((s) => (
              <Field key={s.label} label={s.label}>
                <div className="flex h-11 items-center gap-2.5 rounded-btn border border-admin-border bg-admin-bg px-3 focus-within:border-brand focus-within:bg-white">
                  <span className="flex h-6 w-6 flex-none items-center justify-center rounded-md bg-gray-900 text-[10px] font-bold text-white">
                    {s.badge}
                  </span>
                  <input
                    defaultValue={s.value}
                    className="w-full border-none bg-transparent text-sm outline-none"
                  />
                </div>
              </Field>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-5 flex justify-end gap-3">
        <button
          type="reset"
          className="h-[46px] rounded-btn border border-admin-border bg-white px-5 text-[14.5px] font-semibold hover:bg-gray-50"
        >
          Batal
        </button>
        <button
          type="submit"
          className="inline-flex h-[46px] items-center gap-2 rounded-btn bg-brand px-[22px] text-[14.5px] font-medium text-white hover:bg-brand-hover"
        >
          <Check className="h-[18px] w-[18px]" />
          Simpan Pengaturan
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  full,
  children,
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <label className={`flex flex-col gap-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <span className={LABEL}>{label}</span>
      {children}
    </label>
  );
}
