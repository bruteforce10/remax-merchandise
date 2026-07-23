import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      // Image uploads flow through the `uploadAsset` server action; the default
      // 1 MB body cap must cover the largest allowed upload (products = 10 MB).
      bodySizeLimit: "12mb",
    },
  },
  images: {
    // Content images are hosted as Hygraph assets.
    remotePatterns: [
      { protocol: "https", hostname: "**.graphassets.com" },
      { protocol: "https", hostname: "media.graphassets.com" },
    ],
  },
};

export default nextConfig;
