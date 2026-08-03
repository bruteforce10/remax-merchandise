"use server";

import { z } from "zod";

import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Public engagement tracking. Called fire-and-forget from the public site to
 * feed the admin leads funnel (product_stats) and popular-keyword panel
 * (search_logs). Writes go through the service-role client server-side; these
 * actions never throw so a tracking failure can never break the UX.
 *
 * Note: checkout is tracked inside the auth-gated createOrder action, not here,
 * so the conversion metric cannot be inflated from the client.
 */

const slugSchema = z.string().trim().min(1).max(200);
const keywordSchema = z.string().trim().min(1).max(120);

type StatKind = "view" | "cart";

async function bumpProductStat(slug: string, kind: StatKind): Promise<void> {
  const parsed = slugSchema.safeParse(slug);
  if (!parsed.success) return;
  try {
    const { error } = await supabaseAdmin().rpc("bump_product_stat", {
      p_slug: parsed.data,
      p_kind: kind,
    });
    if (error) throw error;
  } catch (error) {
    console.error(`bumpProductStat(${slug}, ${kind}) failed:`, error);
  }
}

/** Record a product-detail view. */
export async function trackProductView(slug: string): Promise<void> {
  await bumpProductStat(slug, "view");
}

/** Record an add-to-cart. */
export async function trackAddToCart(slug: string): Promise<void> {
  await bumpProductStat(slug, "cart");
}

/** Log a committed search keyword for the popular-keywords aggregation. */
export async function logSearch(
  keyword: string,
  sessionId?: string,
): Promise<void> {
  const parsed = keywordSchema.safeParse(keyword);
  if (!parsed.success) return;
  try {
    const { error } = await supabaseAdmin()
      .from("search_logs")
      .insert({ keyword: parsed.data, session_id: sessionId ?? null });
    if (error) throw error;
  } catch (error) {
    console.error(`logSearch(${keyword}) failed:`, error);
  }
}
