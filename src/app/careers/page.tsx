import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import CtaBand from "@/components/sections/CtaBand";
import { ArrowRight } from "@/components/site/icons";
import { jobs } from "@/content/jobs";

export const metadata: Metadata = {
  title: "Careers — Nord Harton Group",
  description:
    "Join a small, senior team building mission-critical enterprise platforms. Open roles across engineering, design, and platform.",
  alternates: { canonical: "/careers" },
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
                  className="group block rounded-2xl border border-hairline bg-elevated/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg sm:p-7"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center rounded-full border border-hairline px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-accent">
                      {job.department}
                    </span>
                    <span className="text-xs text-fg-subtle">{job.posted}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-fg sm:text-2xl">{job.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-fg-muted">{job.summary}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    {[job.location, job.type, job.level, job.salary].map((m) => (
                      <span key={m} className="rounded-full border border-hairline px-3 py-1 text-xs text-fg-subtle">{m}</span>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-col gap-4 border-t border-hairline pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs text-fg-subtle">{job.team}</span>
                    <span className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0E0E0E] transition-colors group-hover:bg-[#ECECEC]">
                      View role &amp; apply
                      <ArrowRight size={15} />
                    </span>
                  </div>
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
