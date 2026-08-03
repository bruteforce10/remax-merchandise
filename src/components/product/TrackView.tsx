"use client";

import * as React from "react";

import { trackProductView } from "@/actions/tracking";

/**
 * Fires a one-time product-view event when the detail page mounts. Renders
 * nothing. A per-tab-session guard avoids re-counting on refresh or repeated
 * client navigations to the same product within the session.
 */
export function TrackView({ slug }: { slug: string }): null {
  React.useEffect(() => {
    if (!slug) return;
    const key = `remax_viewed_${slug}`;
    let sessionId: string | undefined;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
      sessionId = localStorage.getItem("remax_session") ?? undefined;
    } catch {
      /* private-mode / quota — fall through and still track */
    }
    void trackProductView(slug, sessionId);
  }, [slug]);

  return null;
}
