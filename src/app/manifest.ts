import type { MetadataRoute } from "next";
import { siteName, siteTagline } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteName} — ${siteTagline}`,
    short_name: "Nord Harton",
    description:
      "A digital solutions enterprise building custom web applications, business systems, mobile apps, cloud infrastructure, and brand experiences.",
    start_url: "/",
    display: "standalone",
    background_color: "#131517",
    theme_color: "#131517",
    icons: [
      { src: "/icon", sizes: "64x64", type: "image/png", purpose: "any" },
    ],
  };
}
