import { ADMIN_PRODUCTS } from "@/lib/data/admin";
import type { AdminProduct } from "@/types/admin";

/** Admin product fetchers. Static in Phase 1; Supabase/Prisma in Phase 2. */

export async function getAdminProducts(): Promise<AdminProduct[]> {
  return ADMIN_PRODUCTS;
}

export async function getAdminProductBySku(
  sku: string,
): Promise<AdminProduct | null> {
  return ADMIN_PRODUCTS.find((p) => p.sku === sku) ?? null;
}

export async function getAdminProductSkus(): Promise<string[]> {
  return ADMIN_PRODUCTS.map((p) => p.sku);
}
