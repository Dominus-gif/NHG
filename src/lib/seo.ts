// Central SEO config. Set NEXT_PUBLIC_SITE_URL to your production domain in
// Vercel (e.g. https://nordhartongroup.com); it falls back to that domain.

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://nordharton.com").replace(/\/+$/, "");

export const siteName = "Nord Harton";
export const siteTagline = "Where strategy meets execution";

export const siteDescription =
  "Nord Harton is a digital solutions enterprise building custom web applications, business systems, mobile apps, cloud infrastructure, and brand experiences. 15+ years of expertise and 100+ projects delivered worldwide.";

export const siteKeywords = [
  "Nord Harton",
  "digital solutions enterprise",
  "custom web application development",
  "enterprise software development",
  "business systems",
  "cloud infrastructure",
  "mobile app development",
  "web design and branding",
  "digital transformation",
  "software consultancy",
];

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path = "/"): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
