"use client";

import { ArrowLeft, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";

export function AdminLogin(): React.JSX.Element {
  const router = useRouter();
  const [email, setEmail] = React.useState("support@remax.co.id");
  const [password, setPassword] = React.useState("");
  const [pending, setPending] = React.useState(false);

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      setPending(false);
      toast.error("Email atau password salah");
      return;
    }
    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-admin-bg px-6 py-12">
      <div className="w-full max-w-[400px]">
        <div className="mb-6 flex flex-col items-center text-center">
          <Image
            src="/assets/logo-mark.png"
            alt="RE/MAX"
            width={182}
            height={207}
            priority
            className="h-10 w-auto"
          />
          <h1 className="mt-3 text-xl font-extrabold tracking-tight text-ink">
            RE/MAX <span className="text-brand">Admin</span>
          </h1>
          <p className="text-[13px] font-semibold text-gray-400">Merchandise CMS</p>
        </div>

        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="rounded-[18px] border border-admin-border bg-white p-7 shadow-card"
        >
          <h2 className="text-lg font-extrabold text-ink">Masuk</h2>
          <p className="mt-0.5 mb-5 text-[13.5px] text-gray-500">
            Kelola katalog merchandise Anda.
          </p>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[13px] font-semibold text-gray-600">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-[46px] rounded-btn border border-gray-200 bg-admin-bg px-3.5 text-[14.5px] text-ink outline-none focus:border-brand focus:bg-white"
            />
          </div>

          <div className="mt-3.5 flex flex-col gap-1.5">
            <label htmlFor="password" className="text-[13px] font-semibold text-gray-600">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-[46px] rounded-btn border border-gray-200 bg-admin-bg px-3.5 text-[14.5px] text-ink outline-none focus:border-brand focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="mt-5 flex h-[48px] w-full items-center justify-center rounded-btn bg-brand text-[15px] font-bold text-white transition-colors hover:bg-brand-hover disabled:opacity-60"
          >
            {pending ? "Memproses…" : "Masuk"}
          </button>

          <p className="mt-3.5 flex items-center justify-center gap-1.5 text-[12px] text-gray-400">
            <Lock className="h-3 w-3" />
            Akses terbatas untuk admin RE/MAX
          </p>
        </form>

        <Link
          href="/"
          className="mt-5 flex items-center justify-center gap-1.5 text-[13.5px] font-semibold text-gray-500 hover:text-brand"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke situs
        </Link>
      </div>
    </div>
  );
}
