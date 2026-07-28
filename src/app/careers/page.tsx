import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import CtaBand from "@/components/sections/CtaBand";
import { jobs } from "@/content/jobs";

export const metadata: Metadata = {
  title: "Careers — Nord Harton Group",
  description:
    "Join a small, senior team building mission-critical enterprise platforms. Open roles across engineering, design, and platform.",
};

export default function CareersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="Build things that matter, with people who care"
        description="We're a small, senior, fully-remote team. We hire people who take real ownership, communicate honestly, and would rather solve the right problem than the easy one. No take-home gauntlets, no 8-round loops — just a few honest conversations and some real work."
      />

      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <Reveal>
            <div className="mb-10 grid gap-4 sm:grid-cols-3">
              {[
                { k: "How we work", v: "Remote-first, async-friendly, low process." },
                { k: "How we hire", v: "Intro chat → a paid, real-world exercise → a team conversation." },
                { k: "What we value", v: "Ownership, candor, and craft over credentials." },
              ].map((c) => (
                <div key={c.k} className="rounded-xl border border-hairline bg-elevated/60 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent">{c.k}</p>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">{c.v}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-fg-subtle">Open positions</h2>
            <span className="text-sm text-fg-subtle">{jobs.length} open roles</span>
          </div>

          <Stagger className="flex flex-col gap-4">
            {jobs.map((job) => (
              <StaggerItem key={job.slug}>
                <Link
                  href={`/careers/${job.slug}`}
                  className="group block rounded-2xl border border-hairline bg-elevated/60 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs text-accent">{job.department}</span>
                    <span className="text-xs text-fg-subtle">{job.posted}</span>
                  </div>
                  <h3 className="mt-2 text-xl font-semibold text-fg">{job.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-fg-muted">{job.summary}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {[job.location, job.type, job.level, job.salary].map((m) => (
                      <span key={m} className="rounded-full border border-hairline px-3 py-1 text-xs text-fg-subtle">{m}</span>
                    ))}
                  </div>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent transition-transform group-hover:translate-x-1">
                    View role &amp; apply →
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
