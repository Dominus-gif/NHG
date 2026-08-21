import type { Post } from "@/content/posts";

/* Map the granular per-post tags into a small set of broad, scannable domains.
   Used by the Posts filter and the "Related posts" clustering. New/unmapped
   tags fall back by keyword. */
export const TAG_TO_DOMAIN: Record<string, string> = {
  "Strategy & Architecture": "Strategy & Culture",
  "Architecture & Modernization": "Architecture & Cloud",
  "UX Design & Strategy": "UX & Design",
  "Data Architecture & Governance": "Data & AI",
  "AI & Workflow Strategy": "Data & AI",
  "Design Systems & Governance": "UX & Design",
  "Edge Computing & Cloud Architecture": "Architecture & Cloud",
  "UX Design & Inclusion": "UX & Design",
  "Serverless & Cloud Architecture": "Architecture & Cloud",
  "UX Motion & Design Principles": "UX & Design",
  "Language & Architecture": "Architecture & Cloud",
  "Remote Work & Culture": "People & Culture",
  "UI/UX Design & Tokens": "UX & Design",
  "Artificial Intelligence & Enterprise Security": "Security",
  "Security & Cloud Architecture": "Security",
  "Architecture & Scalability": "Architecture & Cloud",
  "Blockchain & Distributed Systems": "Architecture & Cloud",
  "Data Analytics & Trends": "Data & AI",
  "Cloud & Customer Experience": "Architecture & Cloud",
  "DevOps & Delivery": "Architecture & Cloud",
  "Machine Learning & Security": "Security",
  "Emerging Technology": "Strategy & Culture",
  "Business Intelligence & Strategy": "Data & AI",
  "3D Printing & Manufacturing": "Strategy & Culture",
  "Technology Selection": "Strategy & Culture",
  "Social Analytics & Marketing": "Data & AI",
  "Cybersecurity & Risk": "Security",
  "E-commerce & Retail": "Strategy & Culture",
  "Cloud Strategy": "Architecture & Cloud",
  "AI & Business Intelligence": "Data & AI",
  "People & Culture": "People & Culture",
  "Leadership & Culture": "People & Culture",
  "Workforce & Engagement": "People & Culture",
  "Workplace Communication": "People & Culture",
  "Management & Operations": "People & Culture",
  "Workplace Trends": "People & Culture",
  "Performance & Feedback": "People & Culture",
  "Wellbeing & Culture": "People & Culture",
  "AI Governance & Ethics": "Data & AI",
};

export const DOMAIN_ORDER = [
  "Architecture & Cloud",
  "UX & Design",
  "Data & AI",
  "Security",
  "Strategy & Culture",
  "People & Culture",
];

export function domainForTag(tag: string): string {
  if (TAG_TO_DOMAIN[tag]) return TAG_TO_DOMAIN[tag];
  const t = tag.toLowerCase();
  if (t.includes("security")) return "Security";
  if (/(ux|ui|design|token|motion)/.test(t)) return "UX & Design";
  if (/(\bai\b|intelligence|data)/.test(t)) return "Data & AI";
  if (/(cloud|architect|serverless|edge|scal|modern|infrastructure|language)/.test(t)) return "Architecture & Cloud";
  return "Strategy & Culture";
}

/** Posts related to `current`: same exact tag first, then same broad domain,
 *  most-recent first, capped at `n`. Used for internal-linking clusters. */
export function relatedPosts(current: Post, all: Post[], n = 4): Post[] {
  const domain = domainForTag(current.tag);
  const time = (p: Post) => new Date(p.date).getTime() || 0;
  const byTime = (arr: Post[]) => [...arr].sort((a, b) => time(b) - time(a));
  const others = all.filter((p) => p.slug !== current.slug);
  const sameTag = byTime(others.filter((p) => p.tag === current.tag));
  const sameDomain = byTime(others.filter((p) => p.tag !== current.tag && domainForTag(p.tag) === domain));
  const rest = byTime(others.filter((p) => domainForTag(p.tag) !== domain));
  // Priority order (same tag → same domain → rest), each already newest-first.
  return [...sameTag, ...sameDomain, ...rest].slice(0, n);
}
