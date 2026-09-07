import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

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

// Enables Cloudflare bindings (env vars, KV, R2, etc.) during `next dev`.
// No-op for the Vercel/`next build` path.
initOpenNextCloudflareForDev();
