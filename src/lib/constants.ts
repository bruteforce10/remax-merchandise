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
  /** Google Maps place link for the office ("Buka Maps"). */
  mapsUrl: string;
  /** Keyless Google Maps embed of {@link mapsUrl} — no API key required. */
  mapsEmbedUrl: string;
}

/**
 * Office coordinates, read off the Google Maps place link for RE/MAX Indonesia.
 * Reverse-geocoding puts them in kelurahan Senayan, Kebayoran Baru (3174071006)
 * — the same village as `SHIP_ORIGIN_VILLAGE_CODE`, which is what every ongkir
 * quote ships from. Keep the two in step if the office moves.
 */
const OFFICE_LAT_LNG = "-6.2262628,106.8084354";

export const COMPANY: CompanyInfo = {
  name: "REMAX Gifts",
  shortName: SITE_NAME,
  tagline: "Official gifts untuk jaringan REMAX Indonesia",
  phoneDisplay: "087716289585",
  whatsappDisplay: "087716289585",
  email: "support@remax.co.id",
  address:
    "Sudirman Central Business District (SCBD), Senayan, Kebayoran Baru, Jakarta Selatan 12190",
  addressShort: "Kebayoran Baru, Jakarta Selatan",
  hours: "Senin - Jumat, 09:00 - 18:00 WIB",
  hoursShort: "Sen-Jum, 09:00-18:00",
  mapsUrl: "https://maps.app.goo.gl/Rr7qyzTc1a6V19nWA",
  mapsEmbedUrl: `https://maps.google.com/maps?q=${OFFICE_LAT_LNG}&z=16&output=embed`,
};

export interface SocialLink {
  label: string;
  /** Key into the SocialIcon registry (see components/ui/SocialIcon.tsx). */
  icon: string;
  href: string;
}

export const SOCIALS: SocialLink[] = [
  {
    label: "Instagram",
    icon: "instagram",
    href: "https://www.instagram.com/remaxindonesia",
  },
  {
    label: "YouTube",
    icon: "youtube",
    href: "https://www.youtube.com/@remaxindo",
  },
  {
    label: "Facebook",
    icon: "facebook",
    href: "https://www.facebook.com/remaxindo",
  },
];

/** RE/MAX Indonesia main site — property listings, linked from the navbar. */
export const PROPERTY_SEARCH_URL = "https://remax.co.id/properties";
