/** Lead / inquiry model (maps to Supabase `Lead` + `Event` in Phase 2). */
export type LeadStatus = "new" | "contacted" | "completed";

export type DeviceType = "Desktop" | "Mobile" | "Tablet";

export interface Lead {
  id: string;
  date: string;
  product: string;
  qty: number;
  session: string;
  country: string;
  device: DeviceType;
  status: LeadStatus;
}
