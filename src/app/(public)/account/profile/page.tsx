import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";

import { AddressBookManager } from "@/components/account/AddressBookManager";
import { ProfileForm } from "@/components/account/ProfileForm";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { getProvinces } from "@/lib/shipping/regional";
import { createClient } from "@/lib/supabase/server";
import { getCustomerAddresses } from "@/services/operational/addresses";

export const metadata: Metadata = {
  title: "Profil Saya",
  description: "Kelola data profil akun REMAX Gifts Anda.",
  robots: { index: false, follow: false },
};

function metaString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export default async function ProfilePage(): Promise<ReactElement> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) redirect("/account/login?next=/account/profile");

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const initial = {
    fullName: metaString(meta.full_name) || metaString(meta.name),
    phone: metaString(meta.phone),
    company: metaString(meta.company),
  };

  const [addresses, provinces] = await Promise.all([
    getCustomerAddresses(user.id),
    getProvinces().catch((error) => {
      console.error("ProfilePage getProvinces failed:", error);
      return [];
    }),
  ]);

  return (
    <div className="mx-auto max-w-[860px] animate-[rmx-fade_.3s_ease] px-6 pt-6 pb-15">
      <div className="mb-[18px]">
        <Breadcrumb
          items={[{ label: "Beranda", href: "/" }, { label: "Profil Saya" }]}
        />
      </div>
      <h1 className="text-[26px] font-semibold tracking-tight text-ink sm:text-[30px]">
        Profil Saya
      </h1>
      <p className="mt-1 mb-6.5 text-[15px] text-muted">
        Data ini dipakai untuk mempercepat proses pemesanan Anda.
      </p>
      <div className="max-w-[560px]">
        <ProfileForm email={user.email} initial={initial} />
      </div>
      <AddressBookManager addresses={addresses} provinces={provinces} />
    </div>
  );
}

