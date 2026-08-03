import type { Metadata } from "next";
import type { ReactNode } from "react";

import { LeadsTable } from "@/components/admin/LeadsTable";
import { getLeadFunnel } from "@/services/operational/leads";

export const metadata: Metadata = { title: "Leads" };

export default async function AdminLeadsPage(): Promise<ReactNode> {
  const funnel = await getLeadFunnel();
  return <LeadsTable funnel={funnel} />;
}
