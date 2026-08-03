import { trackWaClick } from "@/actions/tracking";

/**
 * Client helper to record a WhatsApp click (fire-and-forget). Reads the cart
 * session id from localStorage (set by CartProvider under `remax_session`) so
 * the click ties into the same session as the visitor's other events. Pass a
 * product slug to attribute the click to a product; omit for general inquiries.
 */
export function trackWa(slug?: string): void {
  let sessionId: string | undefined;
  try {
    sessionId = localStorage.getItem("remax_session") ?? undefined;
  } catch {
    /* private mode / storage disabled — track without a session */
  }
  void trackWaClick(slug, sessionId);
}
