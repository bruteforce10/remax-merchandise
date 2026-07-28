"use client";

import * as React from "react";
import { toast } from "sonner";

import type { Product } from "@/types/product";

/**
 * Quotation cart state. Persists to localStorage by a generated sessionId
 * (no login, by MVP design). Each line stores a product snapshot so the cart
 * is self-contained and does not depend on an in-memory product map.
 * Mirrors the future Supabase `Cart` model.
 */

const STORAGE_KEY = "remax_cart";
const SESSION_KEY = "remax_session";

/** A selected variant snapshot stored alongside the product on a cart line. */
export interface CartVariant {
  sku: string;
  title: string;
  price: number;
  options: Record<string, string>;
}

export interface CartLine {
  product: Product;
  variant?: CartVariant;
  qty: number;
}

/** Cart map key — the variant SKU when set, else the product SKU. */
export function lineKey(line: Pick<CartLine, "product" | "variant">): string {
  return line.variant?.sku ?? line.product.sku;
}

/** Unit price for a line — the variant price when set, else the base price. */
export function lineUnitPrice(line: CartLine): number {
  return line.variant?.price ?? line.product.price;
}

interface CartContextValue {
  items: Record<string, number>;
  lines: CartLine[];
  count: number;
  totalQty: number;
  estimatedTotal: number;
  hydrated: boolean;
  sessionId: string;
  add: (product: Product, qty?: number, variant?: CartVariant) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const CartContext = React.createContext<CartContextValue | null>(null);

function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const line = value as { product?: unknown; qty?: unknown };
  return (
    typeof line.qty === "number" &&
    !!line.product &&
    typeof line.product === "object" &&
    typeof (line.product as { sku?: unknown }).sku === "string"
  );
}

function readStoredEntries(): Record<string, CartLine> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    const result: Record<string, CartLine> = {};
    for (const [sku, line] of Object.entries(parsed as Record<string, unknown>)) {
      if (isCartLine(line)) result[sku] = line;
    }
    return result;
  } catch {
    return {};
  }
}

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [entries, setEntries] = React.useState<Record<string, CartLine>>({});
  const [hydrated, setHydrated] = React.useState(false);
  const [sessionId, setSessionId] = React.useState("");

  // Hydrate from localStorage after mount (avoids SSR mismatch).
  React.useEffect(() => {
    setEntries(readStoredEntries());
    let sid = localStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, sid);
    }
    setSessionId(sid);
    setHydrated(true);
  }, []);

  // Persist on change.
  React.useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // ignore quota / privacy-mode errors
    }
  }, [entries, hydrated]);

  const add = React.useCallback(
    (product: Product, qty?: number, variant?: CartVariant): void => {
      const amount = qty ?? 1;
      const key = variant?.sku ?? product.sku;
      setEntries((prev) => ({
        ...prev,
        [key]: {
          product,
          variant,
          qty: (prev[key]?.qty ?? 0) + amount,
        },
      }));
      toast.success(`${product.name} ditambahkan`);
    },
    [],
  );

  const setQty = React.useCallback((key: string, qty: number): void => {
    const value = Number.isNaN(qty) || qty < 1 ? 1 : qty;
    setEntries((prev) => {
      const existing = prev[key];
      if (!existing) return prev;
      return { ...prev, [key]: { ...existing, qty: value } };
    });
  }, []);

  const remove = React.useCallback((key: string): void => {
    setEntries((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    toast.success("Produk dihapus");
  }, []);

  const clear = React.useCallback((): void => setEntries({}), []);

  const lines = React.useMemo<CartLine[]>(
    () => Object.values(entries),
    [entries],
  );

  const value = React.useMemo<CartContextValue>(() => {
    const totalQty = lines.reduce((sum, l) => sum + l.qty, 0);
    const estimatedTotal = lines.reduce(
      (sum, l) => sum + (l.variant?.price ?? l.product.price) * l.qty,
      0,
    );
    const items: Record<string, number> = {};
    for (const [key, line] of Object.entries(entries)) {
      items[key] = line.qty;
    }
    return {
      items,
      lines,
      count: lines.length,
      totalQty,
      estimatedTotal,
      hydrated,
      sessionId,
      add,
      setQty,
      remove,
      clear,
    };
  }, [entries, lines, hydrated, sessionId, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = React.useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
