import type { ShippingDestination } from "@/types/shipping";

/** Saved customer delivery address (Supabase `customer_addresses`). */
export interface CustomerAddress extends ShippingDestination {
  id: string;
  userId: string;
  customerEmail: string;
  label: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddressInput extends ShippingDestination {
  id?: string;
  label?: string;
  isDefault?: boolean;
}
