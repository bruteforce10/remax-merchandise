"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Public engagement tracking. Called fire-and-forget from the public site to
 * feed the admin leads funnel (product_stats), popular-keyword panel
 * (search_logs), and the analytics time-series (events). Writes go through the
 * service-role client server-side; these actions never throw so a tracking
 * failure can never break the UX.
 *
 * Note: checkout is tracked inside the auth-gated createOrder action, not here,
 * so the conversion metric cannot be inflated from the client.
 */

const slugSchema = z.string().trim().min(1).max(200);
const keywordSchema = z.string().trim().min(1).max(120);
const sessionSchema = z.string().trim().min(1).max(100);

type StatKind = "view" | "cart";
type EventKind = "view" | "cart" | "wa";
type Device = "mobile" | "desktop" | "tablet";

/** Coarse device class from the User-Agent (tablet checked before mobile). */
function deviceFromUA(ua: string): Device {
  const s = ua.toLowerCase();
  if (/ipad|tablet|playbook|silk|kindle|(android(?!.*mobi))/.test(s)) {
    return "tablet";
  }
  if (/mobi|iphone|ipod|blackberry|iemobile|opera mini|windows phone/.test(s)) {
    return "mobile";
  }
  return "desktop";
}

/** Log one engagement event with request-derived device + country metadata. */
async function logEvent(
  type: EventKind,
  slug: string | null,
  sessionId?: string,
): Promise<void> {
  try {
    const h = await headers();
    const device = deviceFromUA(h.get("user-agent") ?? "");
    // Vercel injects the visitor's ISO country code; absent in local/dev.
    const country = h.get("x-vercel-ip-country");
    const session = sessionSchema.safeParse(sessionId);
    const { error } = await supabaseAdmin()
      .from("events")
      .insert({
        type,
        product_slug: slug,
        session_id: session.success ? session.data : null,
        device,
        country: country ? country.toUpperCase() : null,
      });
    if (error) throw error;
  } catch (error) {
    console.error(`logEvent(${type}, ${slug}) failed:`, error);
  }
}

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

/** Record a product-detail view (funnel counter + analytics event). */
export async function trackProductView(
  slug: string,
  sessionId?: string,
): Promise<void> {
  const parsed = slugSchema.safeParse(slug);
  if (!parsed.success) return;
  await Promise.all([
    bumpProductStat(parsed.data, "view"),
    logEvent("view", parsed.data, sessionId),
  ]);
}

/** Record an add-to-cart (funnel counter + analytics event). */
export async function trackAddToCart(
  slug: string,
  sessionId?: string,
): Promise<void> {
  const parsed = slugSchema.safeParse(slug);
  if (!parsed.success) return;
  await Promise.all([
    bumpProductStat(parsed.data, "cart"),
    logEvent("cart", parsed.data, sessionId),
  ]);
}

/**
 * Record a WhatsApp click. `slug` attributes the click to a product (card,
 * detail, post-checkout hand-off); omit it for general inquiries (floating
 * button, cart quotation, contact) so they still count toward the total.
 */
export async function trackWaClick(
  slug?: string,
  sessionId?: string,
): Promise<void> {
  const parsed = slug ? slugSchema.safeParse(slug) : null;
  await logEvent("wa", parsed?.success ? parsed.data : null, sessionId);
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
