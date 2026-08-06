import { apiCoIdBaseUrl, apiCoIdKey } from "./env";

/**
 * Thin server-only client for api.co.id. Injects the privileged `x-api-co-id`
 * key and unwraps the standard `{ is_success, message, data }` envelope.
 *
 * Error contract (so `unstable_cache` never caches a transient failure):
 *   - returns `null` only when the key is UNSET (a stable condition)
 *   - THROWS on network / non-2xx / `is_success:false` (transient) so callers
 *     inside unstable_cache propagate rather than cache an empty result
 */

const API_KEY_HEADER = "x-api-co-id";

interface ApiEnvelope<T> {
  is_success: boolean;
  message: string;
  data: T;
}

export async function apiCoIdGet<T>(
  path: string,
  params?: Record<string, string | number>,
): Promise<T | null> {
  const key = apiCoIdKey();
  if (!key) return null;

  const url = new URL(`${apiCoIdBaseUrl()}${path}`);
  for (const [name, value] of Object.entries(params ?? {})) {
    url.searchParams.set(name, String(value));
  }

  const res = await fetch(url, {
    headers: { [API_KEY_HEADER]: key, accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`api.co.id ${path} → HTTP ${res.status}`);
  }

  const body = (await res.json()) as ApiEnvelope<T>;
  if (!body.is_success) {
    throw new Error(`api.co.id ${path} → ${body.message || "request failed"}`);
  }
  return body.data;
}
