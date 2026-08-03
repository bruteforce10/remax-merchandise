/** Status labels shared by StatusBadge (also used for orders/products). */
export type LeadStatus = "new" | "contacted" | "completed";

/**
 * Per-product engagement funnel row, backed by Supabase `product_stats`.
 * Tracks the discovery funnel: views → cart → checkout, plus a conversion ratio.
 */
export interface LeadFunnelRow {
  slug: string;
  name: string;
  imageUrl: string | null;
  views: number;
  cartCount: number;
  checkoutCount: number;
  /** checkoutCount / views (0 when there are no views). */
  conversion: number;
}
