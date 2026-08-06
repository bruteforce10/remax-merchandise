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
    "Halo Admin REMAX Gifts,\n" +
    "Saya ingin menanyakan produk merchandise resmi REMAX yang tersedia. " +
    "Mohon dibantu ya. Terima kasih."
  );
}

export interface ProductMessageOptions {
  /** Selected option values, keyed by dimension name (e.g. Warna, Ukuran). */
  options?: Record<string, string>;
  /** Unit price of the selected variant; defaults to the product base price. */
  unitPrice?: number;
  /** Order reference to include when the checkout recorded an order. */
  ref?: string;
}

/** Single-product inquiry (product card + product detail). */
export function productMessage(
  product: Product,
  qty: number,
  { options = {}, unitPrice, ref }: ProductMessageOptions = {},
): string {
  const lines = ["Halo Admin,"];
  if (ref) lines.push(`No. Pesanan: ${ref}`);
  lines.push(
    "Saya tertarik produk:",
    "",
    `Nama: ${product.name}`,
    `SKU: ${product.sku}`,
    `Qty: ${qty} pcs`,
  );
  for (const [key, value] of Object.entries(options)) {
    lines.push(`${key}: ${value}`);
  }
  lines.push(
    `Harga mulai: ${formatPrice(unitPrice ?? product.price)}`,
    "",
    "Mohon info harga & ketersediaannya. Terima kasih.",
  );
  return lines.join("\n");
}

export interface CartMessageLine {
  product: Product;
  qty: number;
  options?: Record<string, string>;
  unitPrice?: number;
}

/** Delivery + ongkir breakdown appended to the cart quotation message. */
export interface CartMessageShipping {
  recipientName: string;
  recipientPhone: string;
  addressDetail: string;
  /** "Kelurahan, Kecamatan, Kota, Provinsi" (+ postal when known). */
  destinationLabel: string;
  /** Chosen courier service name; "" when ongkir is quoted manually. */
  courier: string;
  subtotal: number;
  shippingCost: number;
  grandTotal: number;
}

/** Quotation request for the whole cart, optionally with the delivery + ongkir. */
export function cartMessage(
  lines: CartMessageLine[],
  ref?: string,
  shipping?: CartMessageShipping,
): string {
  const productCount = lines.length;
  const totalQty = lines.reduce((sum, l) => sum + l.qty, 0);
  const body = lines
    .map((l, i) => {
      const price = l.unitPrice ?? l.product.price;
      const opts =
        l.options && Object.keys(l.options).length > 0
          ? `\n   ${Object.entries(l.options)
              .map(([k, v]) => `${k}: ${v}`)
              .join(" · ")}`
          : "";
      return `${i + 1}. ${l.product.name}${opts}\n   SKU: ${l.product.sku} | Qty: ${l.qty} pcs | Mulai ${formatPrice(price)}/pcs`;
    })
    .join("\n");
  const shippingBlock = shipping
    ? "\n\n" +
      "Pengiriman:\n" +
      `Penerima: ${shipping.recipientName} (${shipping.recipientPhone})\n` +
      `Alamat: ${shipping.addressDetail}, ${shipping.destinationLabel}\n` +
      (shipping.courier ? `Kurir: ${shipping.courier}\n` : "") +
      "\n" +
      `Subtotal: ${formatPrice(shipping.subtotal)}\n` +
      `Ongkir: ${shipping.courier ? formatPrice(shipping.shippingCost) : "(dihitung tim)"}\n` +
      `Total: ${formatPrice(shipping.grandTotal)}`
    : "";
  return (
    "Halo Admin,\n" +
    (ref ? `No. Pesanan: ${ref}\n` : "") +
    "Saya ingin meminta penawaran (quotation) untuk produk berikut:\n\n" +
    `${body}\n\n` +
    `Total jenis produk: ${productCount}\n` +
    `Estimasi total qty: ${totalQty} pcs` +
    shippingBlock +
    "\n\nMohon info harga & ketersediaannya. Terima kasih."
  );
}

