import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import CtaBand from "@/components/sections/CtaBand";
import { projects } from "@/content/work";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Work — The Lynstad Group",
  description:
    "Selected enterprise projects and the measurable outcomes we delivered.",
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Selected work"
        title="Projects that move the metrics that matter"
        description="A selection of enterprise engagements across web, systems, commerce, and mobile."
      />

      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <Stagger className="grid gap-5 sm:grid-cols-2">
            {projects.map((project) => (
              <StaggerItem key={project.title}>
                <article className="group relative overflow-hidden rounded-2xl border border-hairline bg-elevated/60">
                  <div
                    className="h-56"
                    style={{
                      background: `radial-gradient(120% 120% at 30% 20%, ${project.accent}33, transparent 60%), #0B1120`,
                    }}
                  >
                    <span
                      className="absolute left-6 top-6 h-10 w-10 rounded-lg"
                      style={{ background: project.accent }}
                    />
                  </div>
                  <div className="flex items-start justify-between gap-4 p-6">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-fg-subtle">
                        {project.category}
                      </span>
                      <h3 className="mt-1.5 text-lg font-semibold">{project.title}</h3>
                      <p className="mt-1 text-sm text-fg-muted">{project.result}</p>
                    </div>
                    <ArrowUpRight
                      size={20}
                      className="mt-1 shrink-0 text-fg-subtle transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    />
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
