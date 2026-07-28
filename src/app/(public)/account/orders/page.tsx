import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";

import { OrderHistory } from "@/components/account/OrderHistory";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { createClient } from "@/lib/supabase/server";
import { getOrdersByEmail } from "@/services/operational/orders";

export const metadata: Metadata = {
  title: "Riwayat Pesanan",
  description: "Lihat status dan detail pesanan Anda di RE/MAX Merchandise.",
  robots: { index: false, follow: false },
};

export default async function OrdersPage(): Promise<ReactElement> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) redirect("/account/login?next=/account/orders");

  const orders = await getOrdersByEmail(user.email);

  return (
    <div className="mx-auto max-w-[860px] animate-[rmx-fade_.3s_ease] px-6 pt-6 pb-15">
      <div className="mb-[18px]">
        <Breadcrumb
          items={[
            { label: "Beranda", href: "/" },
            { label: "Riwayat Pesanan" },
          ]}
        />
      </div>
      <h1 className="text-[26px] font-semibold tracking-tight text-ink sm:text-[30px]">
        Riwayat Pesanan
      </h1>
      <p className="mt-1 mb-6.5 text-[15px] text-muted">
        Daftar pesanan yang Anda buat. Status diperbarui setelah tim kami
        memproses pesanan.
      </p>
      <OrderHistory orders={orders} />
    </div>
  );
}
