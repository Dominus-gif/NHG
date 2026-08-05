import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // /about was merged into /nordharton — preserve link equity and old bookmarks.
      { source: "/about", destination: "/nordharton", permanent: true },
    ];
  },
};

export default nextConfig;
