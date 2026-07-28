import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";

import { CustomerLogin } from "@/components/account/CustomerLogin";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Masuk",
  description:
    "Masuk ke akun RE/MAX Merchandise untuk checkout dan melihat riwayat pesanan.",
  robots: { index: false, follow: false },
};

interface LoginPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function LoginPage({
  searchParams,
}: LoginPageProps): Promise<ReactElement> {
  const { next } = await searchParams;
  // Only allow same-site relative paths to avoid open-redirects.
  const safeNext = next && next.startsWith("/") ? next : "/";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(safeNext);

  return <CustomerLogin next={safeNext} />;
}
