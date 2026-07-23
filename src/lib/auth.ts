/**
 * Admin authorization allowlist. The admin panel is gated to these emails;
 * everyone else (incl. Google-authenticated customers) is denied. Configure via
 * the server-only `ADMIN_EMAILS` env var (comma-separated); defaults to the
 * RE/MAX super admin.
 */
const ADMIN_EMAILS: readonly string[] = (
  process.env.ADMIN_EMAILS ?? "support@remax.co.id"
)
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

/** Whether the given email is allowed to access the admin panel. */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
