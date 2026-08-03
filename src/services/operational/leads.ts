import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAdminProducts } from "@/services/operational/products";
import type { LeadFunnelRow } from "@/types/lead";

interface ProductStatsRow {
  product_slug: string;
  views: number;
  cart_count: number;
  checkout_count: number;
}

/**
 * Per-product engagement funnel from Supabase `product_stats`, enriched with
 * product names from Hygraph. Sorted by views (most-viewed first). Products
 * with stats but no matching Hygraph entry fall back to their slug as the name.
 */
export async function getLeadFunnel(): Promise<LeadFunnelRow[]> {
  try {
    const { data, error } = await supabaseAdmin()
      .from("product_stats")
      .select("product_slug, views, cart_count, checkout_count")
      .order("views", { ascending: false });
    if (error) throw error;

    const rows = (data ?? []) as ProductStatsRow[];
    if (rows.length === 0) return [];

    const products = await getAdminProducts();
    const nameBySlug = new Map(products.map((p) => [p.slug, p.name]));

    return rows.map((r) => {
      const views = r.views ?? 0;
      const checkoutCount = r.checkout_count ?? 0;
      const product = products.find((p) => p.slug === r.product_slug);
      return {
        slug: r.product_slug,
        name: nameBySlug.get(r.product_slug) ?? r.product_slug,
        imageUrl: product?.imageUrl ?? null,
        views,
        cartCount: r.cart_count ?? 0,
        checkoutCount,
        conversion: views > 0 ? checkoutCount / views : 0,
      };
    });
  } catch (error) {
    console.error("getLeadFunnel failed:", error);
    return [];
  }
}
