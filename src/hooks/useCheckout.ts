"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { useCart, type CartVariant } from "@/providers/CartProvider";

import type { Product } from "@/types/product";

interface CheckoutArgs {
  /** Product snapshot to add before opening the unified cart checkout. */
  product: Product;
  qty?: number;
  variant?: CartVariant;
}

interface UseCheckoutResult {
  checkout: (args: CheckoutArgs) => Promise<void>;
  pending: boolean;
}

/**
 * Shared buy-now funnel. Ongkir now requires recipient address + courier, so every
 * product-level "Checkout" first commits the line to the cart, then opens the
 * single checkout surface at /cart. The cart page handles login, destination,
 * courier selection, order creation, and WhatsApp hand-off.
 */
export function useCheckout(): UseCheckoutResult {
  const { add } = useCart();
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  async function checkout({
    product,
    qty = 1,
    variant,
  }: CheckoutArgs): Promise<void> {
    if (pending) return;
    setPending(true);
    add(product, qty, variant);
    router.push("/cart");
  }

  return { checkout, pending };
}
