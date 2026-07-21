import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";

import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Merchandise Premium & Custom RE/MAX Indonesia`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "merchandise remax",
    "merchandise custom",
    "seragam korporat",
    "corporate gift",
    "polo shirt custom",
    "jaket custom",
    "tumbler custom",
    "payung promosi",
    "RE/MAX Indonesia",
  ],
  authors: [{ name: "RE/MAX Indonesia Merchandise" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Merchandise Premium & Custom RE/MAX Indonesia`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Merchandise Premium & Custom`,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
  icons: { icon: "/assets/logo-mark.png", apple: "/assets/logo-mark.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>): ReactNode {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-white font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
