import nodemailer, { type Transporter } from "nodemailer";

/**
 * Lazily-built Gmail SMTP transport (server-only — imported only from Server
 * Actions / Route Handlers). Returns null when the Gmail credentials are not
 * configured, so callers can skip sending silently instead of throwing.
 *
 * Requires `GMAIL_USER` (e.g. support@remax.co.id) and `GMAIL_APP_PASSWORD`
 * (a Google App Password, NOT the normal account password) in the environment.
 */
let cached: Transporter | null | undefined;

export function getMailer(): Transporter | null {
  if (cached !== undefined) return cached;
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    cached = null;
    return null;
  }
  cached = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
  return cached;
}

/** From header, e.g. `REMAX Gifts <support@remax.co.id>`. */
export function mailFrom(): string {
  const user = process.env.GMAIL_USER ?? "";
  return `REMAX Gifts <${user}>`;
}
