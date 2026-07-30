/**
 * Site-wide constants. In production these company/contact values move to the
 * Supabase `Setting` model; WhatsApp number and site URL come from env.
 */

export const WA_NUMBER: string =
  process.env.NEXT_PUBLIC_WA_NUMBER ?? "6287716289585";

export const SITE_URL: string =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://remax-merchandise.vercel.app";

export const SITE_NAME = "REMAX Gifts";

export const SITE_DESCRIPTION =
  "Katalog gifts REMAX Indonesia premium - polo, jaket, hoodie, payung, tumbler, tote bag, dll";

export interface CompanyInfo {
  name: string;
  shortName: string;
  tagline: string;
  phoneDisplay: string;
  whatsappDisplay: string;
  email: string;
  address: string;
  addressShort: string;
  hours: string;
  hoursShort: string;
  mapsUrl: string;
}

export const COMPANY: CompanyInfo = {
  name: "REMAX Gifts",
  shortName: SITE_NAME,
  tagline: "Official gifts untuk jaringan REMAX Indonesia",
  phoneDisplay: "087716289585",
  whatsappDisplay: "087716289585",
  email: "support@remax.co.id",
  address: "Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan 12190",
  addressShort: "Jakarta Selatan, DKI Jakarta",
  hours: "Senin - Jumat, 09:00 - 18:00 WIB",
  hoursShort: "Sen-Jum, 09:00-18:00",
  mapsUrl: "https://maps.google.com",
};

export interface SocialLink {
  label: string;
  short: string;
  href: string;
}

export const SOCIALS: SocialLink[] = [
  { label: "Instagram", short: "IG", href: "https://instagram.com" },
  { label: "Facebook", short: "FB", href: "https://facebook.com" },
  { label: "LinkedIn", short: "IN", href: "https://linkedin.com" },
];
