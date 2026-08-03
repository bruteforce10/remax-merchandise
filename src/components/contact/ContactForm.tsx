"use client";

import { CheckCircle2, MessageCircle } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { z } from "zod";

import { trackWa } from "@/lib/track-wa";
import { generalMessage, waLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  company: z.string().optional(),
  email: z.email("Email tidak valid"),
  phone: z.string().min(8, "Nomor WhatsApp tidak valid"),
  message: z.string().min(10, "Pesan minimal 10 karakter"),
});

type Field = "name" | "company" | "email" | "phone" | "message";

const INITIAL: Record<Field, string> = {
  name: "",
  company: "",
  email: "",
  phone: "",
  message: "",
};

const FIELD_BASE =
  "h-12 rounded-input border bg-white px-3.5 text-[14.5px] text-ink outline-none focus:border-brand";

export function ContactForm(): React.JSX.Element {
  const [values, setValues] = React.useState<Record<Field, string>>(INITIAL);
  const [errors, setErrors] = React.useState<Partial<Record<Field, string>>>({});
  const [sent, setSent] = React.useState(false);

  function update(field: Field, value: string): void {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault();
    const result = contactSchema.safeParse(values);
    if (!result.success) {
      const next: Partial<Record<Field, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as Field;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setSent(true);
    setValues(INITIAL);
    toast.success("Pesan Anda telah terkirim");
  }

  return (
    <div className="rounded-card border border-gray-200 p-7">
      <h2 className="text-[22px] font-semibold tracking-tight text-ink">Kirim Pesan</h2>
      <p className="mt-0.5 mb-5 text-sm text-muted">
        Isi form, tim kami akan menghubungi Anda kembali.
      </p>

      {sent && (
        <div className="mb-4 flex items-center gap-2.5 rounded-btn bg-success-subtle px-4 py-3.5 text-sm font-semibold text-success-fg">
          <CheckCircle2 className="h-[18px] w-[18px]" />
          Terima kasih! Pesan Anda telah terkirim.
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <FormField label="Nama" error={errors.name}>
            <input
              value={values.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Nama lengkap"
              className={cn(FIELD_BASE, errors.name ? "border-danger" : "border-gray-200")}
            />
          </FormField>
          <FormField label="Perusahaan" error={errors.company}>
            <input
              value={values.company}
              onChange={(e) => update("company", e.target.value)}
              placeholder="Nama perusahaan / kantor"
              className={cn(FIELD_BASE, "border-gray-200")}
            />
          </FormField>
          <FormField label="Email" error={errors.email}>
            <input
              type="email"
              value={values.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="email@perusahaan.com"
              className={cn(FIELD_BASE, errors.email ? "border-danger" : "border-gray-200")}
            />
          </FormField>
          <FormField label="No. WhatsApp" error={errors.phone}>
            <input
              value={values.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="08xxxxxxxxxx"
              className={cn(FIELD_BASE, errors.phone ? "border-danger" : "border-gray-200")}
            />
          </FormField>
        </div>

        <div className="mt-3.5">
          <FormField label="Pesan" error={errors.message}>
            <textarea
              value={values.message}
              onChange={(e) => update("message", e.target.value)}
              rows={4}
              placeholder="Ceritakan kebutuhan merchandise Anda…"
              className={cn(
                "resize-y rounded-input border bg-white px-3.5 py-3 text-[14.5px] text-ink outline-none focus:border-brand",
                errors.message ? "border-danger" : "border-gray-200",
              )}
            />
          </FormField>
        </div>

        <div className="mt-[18px] flex flex-wrap gap-3">
          <button
            type="submit"
            className="h-[50px] rounded-btn bg-brand px-6 text-[15px] font-medium text-white hover:bg-brand-hover"
          >
            Kirim Pesan
          </button>
          <a
            href={waLink(generalMessage())}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWa()}
            className="inline-flex h-[50px] items-center gap-2 rounded-btn border border-gray-200 bg-white px-[22px] text-[15px] font-medium text-ink hover:border-border-strong"
          >
            <MessageCircle className="h-[18px] w-[18px] text-success" />
            Chat WhatsApp
          </a>
        </div>
      </form>
    </div>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-semibold text-gray-600">{label}</label>
      {children}
      {error && <span className="text-[12px] font-medium text-danger">{error}</span>}
    </div>
  );
}
