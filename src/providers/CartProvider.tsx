"use client";

import * as React from "react";
import { toast } from "sonner";

import { PRODUCT_MAP } from "@/lib/data/catalog";
import type { Product } from "@/types/product";

/**
 * Quotation cart state. Persists to localStorage by a generated sessionId
 * (no login, by MVP design). Mirrors the future Supabase `Cart` model.
 */

const STORAGE_KEY = "remax_cart";
const SESSION_KEY = "remax_session";

export interface CartLine {
  product: Product;
  qty: number;
}

interface CartContextValue {
  items: Record<string, number>;
  lines: CartLine[];
  count: number;
  totalQty: number;
  estimatedTotal: number;
  hydrated: boolean;
  sessionId: string;
  add: (product: Product, qty?: number) => void;
  setQty: (sku: string, qty: number) => void;
  remove: (sku: string) => void;
  clear: () => void;
}

const CartContext = React.createContext<CartContextValue | null>(null);

function readStoredItems(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return parsed as Record<string, number>;
    }
    return {};
  } catch {
    return {};
  }
}

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [items, setItems] = React.useState<Record<string, number>>({});
  const [hydrated, setHydrated] = React.useState(false);
  const [sessionId, setSessionId] = React.useState("");

  // Hydrate from localStorage after mount (avoids SSR mismatch).
  React.useEffect(() => {
    setItems(readStoredItems());
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore quota / privacy-mode errors
    }
  }, [items, hydrated]);

  const add = React.useCallback((product: Product, qty?: number): void => {
    const amount = qty ?? 1;
    setItems((prev) => ({
      ...prev,
      [product.sku]: (prev[product.sku] ?? 0) + amount,
    }));
    toast.success(`${product.name} ditambahkan`);
  }, []);

  const setQty = React.useCallback((sku: string, qty: number): void => {
    const value = Number.isNaN(qty) || qty < 1 ? 1 : qty;
    setItems((prev) => ({ ...prev, [sku]: value }));
  }, []);

  const remove = React.useCallback((sku: string): void => {
    setItems((prev) => {
      const next = { ...prev };
      delete next[sku];
      return next;
    });
    toast.success("Produk dihapus");
  }, []);

  const clear = React.useCallback((): void => setItems({}), []);

  const lines = React.useMemo<CartLine[]>(
    () =>
      Object.entries(items)
        .map(([sku, qty]) => {
          const product = PRODUCT_MAP[sku];
          return product ? { product, qty } : null;
        })
        .filter((line): line is CartLine => line !== null),
    [items],
  );

  const value = React.useMemo<CartContextValue>(() => {
    const totalQty = lines.reduce((sum, l) => sum + l.qty, 0);
    const estimatedTotal = lines.reduce(
      (sum, l) => sum + l.product.price * l.qty,
      0,
    );
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
  }, [items, lines, hydrated, sessionId, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = React.useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
