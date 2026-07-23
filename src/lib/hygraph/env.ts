/**
 * Server-only Hygraph environment accessors.
 * NEVER import this from a Client Component — the write token must stay on the server.
 */

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/** Public read endpoint (high-performance CDN, published content only). */
export function readEndpoint(): string {
  return required("HYGRAPH_ENDPOINT", process.env.HYGRAPH_ENDPOINT);
}

/** Optional bearer token for the read API (empty when the API is public). */
export function readToken(): string {
  return process.env.HYGRAPH_TOKEN ?? "";
}

/** Regular Content API endpoint used for mutations (create/update/delete/publish). */
export function writeEndpoint(): string {
  return required("HYGRAPH_MANAGEMENT_ENDPOINT", process.env.HYGRAPH_MANAGEMENT_ENDPOINT);
}

/** Permanent Auth Token with content mutation + publish permissions. Server-only. */
export function writeToken(): string {
  return required("HYGRAPH_MANAGEMENT_TOKEN", process.env.HYGRAPH_MANAGEMENT_TOKEN);
}
