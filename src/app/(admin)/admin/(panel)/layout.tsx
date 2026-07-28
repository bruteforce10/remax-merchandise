import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { Toaster } from "@/components/ui/Toaster";
import { isAdminEmail } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getLeads } from "@/services/operational/leads";
import { getPendingOrderCount } from "@/services/operational/orders";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · RE/MAX Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminPanelLayout({
  children,
}: {
  children: ReactNode;
}): Promise<ReactNode> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAdminEmail(user?.email)) {
    redirect("/admin");
  }

  const leads = await getLeads();
  const newLeadsCount = leads.filter((l) => l.status === "new").length;
  const newOrdersCount = await getPendingOrderCount();

  return (
    <>
      <AdminShell
        newLeadsCount={newLeadsCount}
        newOrdersCount={newOrdersCount}
        userEmail={user?.email ?? ""}
      >
        {children}
      </AdminShell>
      <Toaster />
    </>
  );
}
