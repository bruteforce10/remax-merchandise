import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Content images are hosted as Hygraph assets.
    remotePatterns: [
      { protocol: "https", hostname: "**.graphassets.com" },
      { protocol: "https", hostname: "media.graphassets.com" },
    ],
  },
};

export default nextConfig;
