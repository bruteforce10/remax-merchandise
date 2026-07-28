import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Privileged, service-role Supabase client for server-only operational writes
 * (orders + inventory). Bypasses RLS — NEVER import this from a client component
 * and never expose SUPABASE_SERVICE_ROLE_KEY to the browser.
 */
export function supabaseAdmin(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
