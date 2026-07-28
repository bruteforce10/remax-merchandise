"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { createOrder, type CreateOrderInput } from "@/actions/orders";
import { waLink } from "@/lib/whatsapp";
import { useAuth } from "@/providers/AuthProvider";
import { useCart } from "@/providers/CartProvider";

type CheckoutItem = CreateOrderInput["items"][number];

interface CheckoutArgs {
  /** The single line to record as an order. */
  item: CheckoutItem;
  /** Build the WhatsApp message once the order reference is known. */
  buildMessage: (ref: string) => string;
  /** Where to return after login when the user isn't authenticated yet. */
  nextPath: string;
}

interface UseCheckoutResult {
  checkout: (args: CheckoutArgs) => Promise<void>;
  pending: boolean;
}

/**
 * Shared single-item checkout: requires login, records a pending order, then
 * opens WhatsApp with the order reference. Used by product cards + detail page
 * so every checkout is gated + tracked in the customer's order history.
 */
export function useCheckout(): UseCheckoutResult {
  const { user } = useAuth();
  const { sessionId } = useCart();
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  async function checkout({
    item,
    buildMessage,
    nextPath,
  }: CheckoutArgs): Promise<void> {
    if (pending) return;
    if (!user) {
      router.push(`/account/login?next=${encodeURIComponent(nextPath)}`);
      return;
    }
    setPending(true);
    const res = await createOrder({ sessionId, items: [item] });
    if (!res.success || !res.data) {
      toast.error(res.message);
      setPending(false);
      return;
    }
    window.location.href = waLink(buildMessage(res.data.ref));
  }

  return { checkout, pending };
}
