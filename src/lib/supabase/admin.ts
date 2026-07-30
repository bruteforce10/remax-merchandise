import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Privileged, service-role Supabase client for server-only operational writes
 * (orders + inventory). Bypasses RLS — NEVER import this from a client component
 * and never expose SUPABASE_SERVICE_ROLE_KEY to the browser.
 */
export function supabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    // Surface a clear, actionable error instead of supabase-js's cryptic
    // "supabaseKey is required" — this usually means the env var is missing in
    // the deployment (Vercel → Settings → Environment Variables → redeploy).
    throw new Error(
      "Missing Supabase server env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set for the deployed environment.",
    );
  }
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
