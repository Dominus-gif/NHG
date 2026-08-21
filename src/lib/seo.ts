// Central SEO config. Set NEXT_PUBLIC_SITE_URL to your production domain in
// Vercel (e.g. https://nordharton.com); it falls back to that domain.

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

/** Official brand profiles for the Organization `sameAs` (entity graph).
 *  IMPORTANT: every URL here must resolve to a REAL Nord Harton profile — a
 *  wrong or empty link hurts your entity graph more than an empty list. Remove
 *  any that don't exist, and add others (Crunchbase, Instagram, etc.). */
export const brandProfiles: string[] = [
  "https://www.linkedin.com/company/nordharton",
  "https://x.com/nordharton",
  "https://github.com/nordharton",
];

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path = "/"): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Convert a human date like "Mar 6, 2026" to an ISO date ("2026-03-06").
 *  Used for machine-readable datePublished / og:published_time. Falls back to
 *  the original string if it can't be parsed. */
export function toISODate(input: string): string {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
