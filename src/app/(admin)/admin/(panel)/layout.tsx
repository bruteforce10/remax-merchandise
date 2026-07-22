import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { Toaster } from "@/components/ui/Toaster";
import { getLeads } from "@/services/operational/leads";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · RE/MAX Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminPanelLayout({
  children,
}: {
  children: ReactNode;
}): Promise<ReactNode> {
  const leads = await getLeads();
  const newLeadsCount = leads.filter((l) => l.status === "new").length;

  return (
    <>
      <AdminShell newLeadsCount={newLeadsCount}>{children}</AdminShell>
      <Toaster />
    </>
  );
}
