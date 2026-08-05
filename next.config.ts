import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The page lives at /about; /nordharton redirects there for old links.
      { source: "/nordharton", destination: "/about", permanent: true },
    ];
  },
};

export default nextConfig;
