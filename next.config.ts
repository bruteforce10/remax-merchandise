import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // All product/content images will later come from Supabase Storage URLs.
    // Add remotePatterns here when wiring real image hosts.
    remotePatterns: [],
  },
};

export default nextConfig;
