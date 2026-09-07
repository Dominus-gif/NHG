import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // www -> apex is handled in src/proxy.ts (the redirects() catch-all param
      // does not interpolate on the Cloudflare/OpenNext runtime).
      // The page lives at /about; /nordharton redirects there for old links.
      { source: "/nordharton", destination: "/about", permanent: true },
    ];
  },
};

export default nextConfig;

// Enables Cloudflare bindings (env vars, KV, R2, etc.) during `next dev`.
// No-op for the Vercel/`next build` path.
initOpenNextCloudflareForDev();
