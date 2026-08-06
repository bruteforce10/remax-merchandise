import { getMailer, mailFrom } from "@/lib/email/client";
import { ORDER_STATUS_META, trackingUrl } from "@/lib/orders/status";
import type { Order, OrderStatus } from "@/types/order";

const BRAND = "#E11D2E";
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function button(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:${BRAND};color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:bold;font-size:14px;">${escapeHtml(
    label,
  )}</a>`;
}

function rupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function destinationLabel(order: Order): string {
  const d = order.destination;
  return [d.addressDetail, d.villageName, d.districtName, d.regencyName, d.provinceName]
    .filter(Boolean)
    .join(", ");
}

function itemRows(order: Order): string {
  return order.items
    .map((it) => {
      const opts = Object.values(it.options).join(" / ");
      const suffix = opts
        ? ` <span style="color:#999;">(${escapeHtml(opts)})</span>`
        : "";
      return `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#222;">${escapeHtml(
          it.name,
        )}${suffix}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#222;text-align:right;white-space:nowrap;">${it.qty} pcs</td>
      </tr>`;
    })
    .join("");
}

function layout(inner: string): string {
  return `<div style="background:#f5f5f5;padding:24px 0;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #eaeaea;">
        <tr><td style="background:${BRAND};padding:20px 28px;">
          <span style="color:#ffffff;font-size:20px;font-weight:bold;letter-spacing:0.5px;">RE/MAX <span style="font-weight:normal;">Gifts</span></span>
        </td></tr>
        <tr><td style="padding:28px;color:#222222;font-size:15px;line-height:1.6;">${inner}</td></tr>
        <tr><td style="padding:18px 28px;background:#fafafa;color:#999999;font-size:12px;border-top:1px solid #eeeeee;">
          Email ini dikirim otomatis oleh REMAX Gifts. Butuh bantuan? Balas email ini.
        </td></tr>
      </table>
    </td></tr></table>
  </div>`;
}

interface Content {
  subject: string;
  heading: string;
  intro: string;
  /** Extra HTML block (e.g. resi details) rendered above the items table. */
  extra?: string;
}

function contentFor(order: Order, status: OrderStatus): Content {
  const ref = order.ref;
  if (status === "shipped") {
    const track = trackingUrl(order.resi);
    const trackBtn = track
      ? `<div style="margin-top:14px;">${button(track, `Lacak di ${order.courier || "Kurir"}`)}</div>`
      : "";
    return {
      subject: `Pesanan #${ref} sedang dikirim — REMAX Gifts`,
      heading: "Pesanan Anda Sedang Dikirim 🚚",
      intro: `Kabar baik! Pesanan <strong>#${ref}</strong> Anda telah kami serahkan ke kurir dan sedang dalam perjalanan.`,
      extra: `<div style="margin:18px 0;padding:16px 18px;background:#f7f7f8;border-radius:10px;">
          <div style="font-size:13px;color:#666;margin-bottom:4px;">Kurir</div>
          <div style="font-size:16px;font-weight:bold;color:#111;margin-bottom:10px;">${escapeHtml(
            order.courier || "-",
          )}</div>
          <div style="font-size:13px;color:#666;margin-bottom:4px;">Nomor Resi</div>
          <div style="font-size:18px;font-weight:bold;letter-spacing:0.5px;color:${BRAND};font-family:'Courier New',monospace;">${escapeHtml(
            order.resi || "-",
          )}</div>
          ${trackBtn}
        </div>`,
    };
  }
  // confirmed (and any other status we choose to notify on)
  return {
    subject: `Pesanan #${ref} dikonfirmasi — REMAX Gifts`,
    heading: "Pesanan Anda Dikonfirmasi ✅",
    intro: `Terima kasih! Pesanan <strong>#${ref}</strong> Anda telah dikonfirmasi dan sedang kami siapkan. Anda dapat memantau statusnya kapan saja lewat tautan di bawah.`,
  };
}

/**
 * Send a status-update email to the customer. No-op when the mailer is not
 * configured or the order has no customer email. Never throws — callers wrap in
 * their own try/catch, but this stays defensive so a mail failure can't break a
 * status change.
 */
export async function sendOrderStatusEmail(
  order: Order,
  status: OrderStatus,
): Promise<void> {
  const mailer = getMailer();
  if (!mailer || !order.customerEmail) return;

  const c = contentFor(order, status);
  const statusLabel = ORDER_STATUS_META[status].label;
  const trackHref = SITE_URL
    ? `${SITE_URL}/lacak/${order.ref}`
    : `/lacak/${order.ref}`;

  const inner = `
    <h1 style="margin:0 0 6px;font-size:22px;color:#111;">${c.heading}</h1>
    <p style="margin:0 0 16px;color:#444;">${c.intro}</p>
    ${c.extra ?? ""}
    <div style="margin:8px 0 4px;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:0.04em;">Ringkasan Pesanan</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
      ${itemRows(order)}
      <tr><td style="padding:10px 0 0;font-size:13px;color:#888;">Subtotal</td>
          <td style="padding:10px 0 0;font-size:13px;color:#111;font-weight:bold;text-align:right;">${rupiah(order.estimatedTotal)}</td></tr>
      <tr><td style="padding:4px 0 0;font-size:13px;color:#888;">Ongkir${order.courierService ? ` (${escapeHtml(order.courierService)})` : ""}</td>
          <td style="padding:4px 0 0;font-size:13px;color:#111;font-weight:bold;text-align:right;">${rupiah(order.shippingCost)}</td></tr>
      <tr><td style="padding:8px 0 0;font-size:14px;color:#111;font-weight:bold;">Total</td>
          <td style="padding:8px 0 0;font-size:15px;color:${BRAND};font-weight:bold;text-align:right;">${rupiah(order.grandTotal)}</td></tr>
      <tr><td style="padding:10px 0 0;font-size:13px;color:#888;">Status saat ini</td>
          <td style="padding:10px 0 0;font-size:13px;color:#111;font-weight:bold;text-align:right;">${escapeHtml(
            statusLabel,
          )}</td></tr>
    </table>
    ${order.destination.recipientName ? `<div style="margin:0 0 18px;padding:14px 16px;background:#fafafa;border:1px solid #eeeeee;border-radius:10px;">
      <div style="font-size:13px;color:#888;margin-bottom:4px;">Alamat Pengiriman</div>
      <div style="font-size:14px;color:#111;font-weight:bold;">${escapeHtml(order.destination.recipientName)} (${escapeHtml(order.destination.recipientPhone)})</div>
      <div style="font-size:13px;color:#555;margin-top:4px;">${escapeHtml(destinationLabel(order))}</div>
    </div>` : ""}
    <div style="margin:6px 0 4px;">${button(trackHref, "Lihat Status Pesanan")}</div>
  `;

  await mailer.sendMail({
    from: mailFrom(),
    to: order.customerEmail,
    subject: c.subject,
    html: layout(inner),
  });
}
