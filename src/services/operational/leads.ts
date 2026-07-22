import { LEADS } from "@/lib/data/admin";
import type { Lead } from "@/types/lead";

export async function getLeads(): Promise<Lead[]> {
  return LEADS;
}
