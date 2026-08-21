import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Force the apex domain: www.nordharton.com/* -> nordharton.com/* (301).
      // Host-scoped so it never loops on the apex itself.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.nordharton.com" }],
        destination: "https://nordharton.com/:path*",
        permanent: true,
      },
      // The page lives at /about; /nordharton redirects there for old links.
      { source: "/nordharton", destination: "/about", permanent: true },
    ];
  },
};

export default nextConfig;
