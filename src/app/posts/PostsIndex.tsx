"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import type { Post } from "@/content/posts";

/* Map the granular per-post tags into a small set of broad, scannable domains.
   Deriving the dropdown from these keeps a clean "Filter by Domain" menu even as
   the underlying tags stay specific. New/unmapped tags fall back by keyword. */
const TAG_TO_DOMAIN: Record<string, string> = {
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
  "Remote Work & Culture": "Strategy & Culture",
  "UI/UX Design & Tokens": "UX & Design",
  "Artificial Intelligence & Enterprise Security": "Security",
  "Security & Cloud Architecture": "Security",
  "Architecture & Scalability": "Architecture & Cloud",
};

const DOMAIN_ORDER = [
  "Architecture & Cloud",
  "UX & Design",
  "Data & AI",
  "Security",
  "Strategy & Culture",
];

const ALL = "All domains";

function domainForTag(tag: string): string {
  if (TAG_TO_DOMAIN[tag]) return TAG_TO_DOMAIN[tag];
  const t = tag.toLowerCase();
  if (t.includes("security")) return "Security";
  if (/(ux|ui|design|token|motion)/.test(t)) return "UX & Design";
  if (/(\bai\b|intelligence|data)/.test(t)) return "Data & AI";
  if (/(cloud|architect|serverless|edge|scal|modern|infrastructure|language)/.test(t)) return "Architecture & Cloud";
  return "Strategy & Culture";
}

export default function PostsIndex({ posts }: { posts: Post[] }) {
  const [domain, setDomain] = useState(ALL);

  // Only surface domains that actually have posts, in a stable order.
  const domains = useMemo(() => {
    const present = new Set(posts.map((p) => domainForTag(p.tag)));
    return DOMAIN_ORDER.filter((d) => present.has(d));
  }, [posts]);

  const filtered = useMemo(
    () => (domain === ALL ? posts : posts.filter((p) => domainForTag(p.tag) === domain)),
    [posts, domain],
  );

  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Filter bar */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <label
              htmlFor="domain-filter"
              className="text-xs font-semibold uppercase tracking-[0.18em] text-accent"
            >
              Filter by Domain
            </label>
            <div className="relative w-full sm:w-auto">
              <select
                id="domain-filter"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                style={{ colorScheme: "dark" }}
                className="w-full appearance-none rounded-xl border border-hairline bg-elevated py-2.5 pl-4 pr-10 text-sm font-medium text-fg outline-none transition-colors hover:border-hairline-strong focus:border-accent sm:w-64"
              >
                <option value={ALL}>{ALL}</option>
                {domains.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-fg-subtle"
              />
            </div>
          </div>
          <span className="text-xs text-fg-subtle">
            {filtered.length} {filtered.length === 1 ? "article" : "articles"}
          </span>
        </div>

        {/* Grid — remounts on filter change so cards re-animate in */}
        <Stagger key={domain} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <StaggerItem key={post.slug}>
              <Link
                href={`/posts/${post.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-hairline bg-elevated/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-wider text-accent">{post.tag}</span>
                  <span className="text-xs text-fg-subtle">{post.readTime}</span>
                </div>
                <h2 className="mt-4 text-lg font-semibold leading-snug text-fg transition-colors group-hover:text-accent">
                  {post.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-muted">{post.excerpt}</p>
                <div className="mt-6 flex items-center gap-2 border-t border-hairline pt-4 text-xs text-fg-subtle">
                  <span>{post.author}</span>
                  <span>·</span>
                  <span>{post.date}</span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
