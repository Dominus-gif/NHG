import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import CtaBand from "@/components/sections/CtaBand";
import { jobs } from "@/content/jobs";

export const metadata: Metadata = {
  title: "Careers — The Lynstad Group",
  description:
    "Join a small, senior team building mission-critical enterprise platforms. Open roles across engineering, design, and platform.",
};

export default function CareersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="Build systems that matter"
        description="We're a small, senior, high-trust team. We hire people who care deeply about their craft and want to see their work run in production for organizations that depend on it."
      />

      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-fg-subtle">
              Open positions
            </h2>
            <span className="text-sm text-fg-subtle">{jobs.length} roles</span>
          </div>

          <Stagger className="flex flex-col gap-4">
            {jobs.map((job) => (
              <StaggerItem key={job.slug}>
                <Link
                  href={`/careers/${job.slug}`}
                  className="group flex flex-col gap-4 rounded-2xl border border-hairline bg-elevated/60 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <span className="font-mono text-xs text-accent">{job.department}</span>
                    <h3 className="mt-2 text-lg font-semibold text-fg">{job.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-fg-muted">
                      <span>{job.location}</span>
                      <span>·</span>
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-accent transition-transform group-hover:translate-x-1">
                    View role →
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
