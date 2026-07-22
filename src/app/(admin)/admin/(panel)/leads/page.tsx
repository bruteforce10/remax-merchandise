import type { Metadata } from "next";
import type { ReactNode } from "react";

import { LeadsTable } from "@/components/admin/LeadsTable";
import { getLeads } from "@/services/operational/leads";

export const metadata: Metadata = { title: "Leads" };

export default async function AdminLeadsPage(): Promise<ReactNode> {
  const leads = await getLeads();
  return <LeadsTable leads={leads} />;
}
