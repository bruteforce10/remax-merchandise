"use client";

import * as React from "react";
import { toast } from "sonner";
import { z } from "zod";

import { updateProfile } from "@/actions/profile";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  fullName: z.string().trim().max(80, "Nama terlalu panjang"),
  phone: z.string().trim().max(30, "Nomor terlalu panjang"),
  company: z.string().trim().max(120, "Nama perusahaan terlalu panjang"),
});

type Field = "fullName" | "phone" | "company";

interface ProfileFormProps {
  email: string;
  initial: Record<Field, string>;
}

const FIELD_BASE =
  "h-12 rounded-input border bg-surface-soft px-3.5 text-[14.5px] text-ink outline-none transition-colors focus:border-brand focus:bg-white";

export function ProfileForm({
  email,
  initial,
}: ProfileFormProps): React.JSX.Element {
  const [values, setValues] = React.useState<Record<Field, string>>(initial);
  const [errors, setErrors] = React.useState<Partial<Record<Field, string>>>(
    {},
  );
  const [pending, setPending] = React.useState(false);

  function update(field: Field, value: string): void {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (pending) return;
    const result = profileSchema.safeParse(values);
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
    setPending(true);
    const res = await updateProfile(result.data);
    setPending(false);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    toast.success(res.message);
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      noValidate
      className="flex flex-col gap-4"
    >
      <FormField label="Email" hint="Terhubung dengan akun Google Anda">
        <input
          value={email}
          readOnly
          disabled
          className={cn(
            FIELD_BASE,
            "cursor-not-allowed border-gray-200 text-gray-400",
          )}
        />
      </FormField>
      <FormField label="Nama Lengkap" error={errors.fullName}>
        <input
          value={values.fullName}
          onChange={(e) => update("fullName", e.target.value)}
          placeholder="Nama Anda"
          className={cn(
            FIELD_BASE,
            errors.fullName ? "border-danger" : "border-gray-200",
          )}
        />
      </FormField>
      <FormField label="No. WhatsApp" error={errors.phone}>
        <input
          value={values.phone}
          onChange={(e) => update("phone", e.target.value)}
          inputMode="tel"
          placeholder="08xxxxxxxxxx"
          className={cn(
            FIELD_BASE,
            errors.phone ? "border-danger" : "border-gray-200",
          )}
        />
      </FormField>
      <FormField label="Perusahaan / Kantor" error={errors.company}>
        <input
          value={values.company}
          onChange={(e) => update("company", e.target.value)}
          placeholder="Opsional"
          className={cn(
            FIELD_BASE,
            errors.company ? "border-danger" : "border-gray-200",
          )}
        />
      </FormField>
      <button
        type="submit"
        disabled={pending}
        className="mt-1 inline-flex h-12 items-center justify-center rounded-btn bg-brand px-6 text-[15px] font-medium text-white shadow-cta transition-colors hover:bg-brand-hover disabled:opacity-60"
      >
        {pending ? "Menyimpan…" : "Simpan Perubahan"}
      </button>
    </form>
  );
}

function FormField({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-semibold text-gray-600">{label}</label>
      {children}
      {hint && !error && <span className="text-[12px] text-gray-400">{hint}</span>}
      {error && <span className="text-[12px] font-medium text-danger">{error}</span>}
    </div>
  );
}
