import { supabaseAdmin } from "@/lib/supabase/admin";

import type { CustomerAddress } from "@/types/address";

interface RawAddress {
  id: string;
  user_id: string;
  customer_email: string;
  label: string | null;
  recipient_name: string;
  recipient_phone: string;
  address_detail: string;
  province_code: string;
  province_name: string;
  regency_code: string;
  regency_name: string;
  district_code: string;
  district_name: string;
  village_code: string;
  village_name: string;
  postal_code: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

const ADDRESS_SELECT =
  "id, user_id, customer_email, label, recipient_name, recipient_phone, address_detail, province_code, province_name, regency_code, regency_name, district_code, district_name, village_code, village_name, postal_code, is_default, created_at, updated_at";

function mapAddress(row: RawAddress): CustomerAddress {
  return {
    id: row.id,
    userId: row.user_id,
    customerEmail: row.customer_email,
    label: row.label ?? "Alamat",
    recipientName: row.recipient_name,
    recipientPhone: row.recipient_phone,
    addressDetail: row.address_detail,
    provinceCode: row.province_code,
    provinceName: row.province_name,
    regencyCode: row.regency_code,
    regencyName: row.regency_name,
    districtCode: row.district_code,
    districtName: row.district_name,
    villageCode: row.village_code,
    villageName: row.village_name,
    postalCode: row.postal_code ?? "",
    isDefault: row.is_default,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Saved delivery addresses for one authenticated user, default first. */
export async function getCustomerAddresses(
  userId: string,
): Promise<CustomerAddress[]> {
  if (!userId) return [];
  try {
    const { data, error } = await supabaseAdmin()
      .from("customer_addresses")
      .select(ADDRESS_SELECT)
      .eq("user_id", userId)
      .order("is_default", { ascending: false })
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return ((data ?? []) as RawAddress[]).map(mapAddress);
  } catch (error) {
    console.error("getCustomerAddresses failed:", error);
    return [];
  }
}
