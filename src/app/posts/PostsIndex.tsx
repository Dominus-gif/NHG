"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import type { Post } from "@/content/posts";
import { DOMAIN_ORDER, domainForTag } from "@/lib/postDomains";

const ALL = "All domains";

/* Themed, accessible dropdown — a native <select>'s open menu is OS-chrome that
   can't be styled, so we render our own listbox that matches the dark theme. */
function DomainDropdown({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative w-full sm:w-64">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-hairline bg-elevated py-2.5 pl-4 pr-3 text-sm font-medium text-fg outline-none transition-colors hover:border-hairline-strong focus-visible:border-accent"
      >
        <span className="truncate">{value}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-fg-subtle transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-xl border border-hairline bg-elevated p-1 shadow-2xl shadow-black/50"
        >
          {options.map((opt) => {
            const active = opt === value;
            return (
              <li key={opt} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    active
                      ? "bg-white/10 text-fg"
                      : "text-fg-muted hover:bg-white/5 hover:text-fg"
                  }`}
                >
                  <span className="truncate">{opt}</span>
                  {active && <Check size={15} className="shrink-0 text-accent" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function PostsIndex({ posts }: { posts: Post[] }) {
  const [domain, setDomain] = useState(ALL);

  // Only surface domains that actually have posts, in a stable order.
  const domains = useMemo(() => {
    const present = new Set(posts.map((p) => domainForTag(p.tag)));
    return [ALL, ...DOMAIN_ORDER.filter((d) => present.has(d))];
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
            <span
              id="domain-filter-label"
              className="text-xs font-semibold uppercase tracking-[0.18em] text-accent"
            >
              Filter by Domain
            </span>
            <DomainDropdown value={domain} options={domains} onChange={setDomain} />
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
                className="group flex h-full flex-col rounded-2xl border border-hairline bg-elevated/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 sm:p-7"
              >
                <span className="inline-flex w-fit items-center rounded-full border border-hairline bg-base px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-fg-muted">
                  {post.tag}
                </span>
                <h2 className="mt-6 text-lg font-semibold leading-snug tracking-tight text-fg transition-colors group-hover:text-accent">
                  {post.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-muted">{post.excerpt}</p>
                <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-hairline pt-4 text-xs text-fg-subtle">
                  <span className="text-fg-muted">{post.author}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.date}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.readTime}</span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
