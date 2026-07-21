import { WA_NUMBER } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";

/** Build a click-to-chat wa.me link with a URL-encoded message body. */
export function waLink(text: string): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

/** Generic corporate inquiry (header CTA, floating button, empty states). */
export function generalMessage(): string {
  return (
    "Halo Admin RE/MAX Merchandise,\n" +
    "Saya ingin menanyakan produk merchandise / custom untuk kebutuhan corporate. " +
    "Mohon dibantu ya. Terima kasih."
  );
}

export interface ProductMessageOptions {
  color?: string;
  size?: string;
}

/** Single-product inquiry (product card + product detail). */
export function productMessage(
  product: Product,
  qty: number,
  options: ProductMessageOptions = {},
): string {
  const { color, size } = options;
  const lines = [
    "Halo Admin,",
    "Saya tertarik produk:",
    "",
    `Nama: ${product.name}`,
    `SKU: ${product.sku}`,
    `Qty: ${qty} pcs`,
  ];
  if (color) lines.push(`Warna: ${color}`);
  if (size) lines.push(`Ukuran: ${size}`);
  lines.push(
    `Harga mulai: ${formatPrice(product.price)}`,
    "",
    "Mohon info harga & ketersediaannya. Terima kasih.",
  );
  return lines.join("\n");
}

export interface CartMessageLine {
  product: Product;
  qty: number;
}

/** Quotation request for the whole cart. */
export function cartMessage(lines: CartMessageLine[]): string {
  const productCount = lines.length;
  const totalQty = lines.reduce((sum, l) => sum + l.qty, 0);
  const body = lines
    .map(
      (l, i) =>
        `${i + 1}. ${l.product.name}\n   SKU: ${l.product.sku} | Qty: ${l.qty} pcs | Mulai ${formatPrice(l.product.price)}/pcs`,
    )
    .join("\n");
  return (
    "Halo Admin,\n" +
    "Saya ingin meminta penawaran (quotation) untuk produk berikut:\n\n" +
    `${body}\n\n` +
    `Total jenis produk: ${productCount}\n` +
    `Estimasi total qty: ${totalQty} pcs\n\n` +
    "Mohon info harga & ketersediaannya. Terima kasih."
  );
}
