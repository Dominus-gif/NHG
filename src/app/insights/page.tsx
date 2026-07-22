import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import CtaBand from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "Insights — Nord Harton Group",
  description: "Thought leadership on enterprise digital transformation.",
};

const articles = [
  {
    tag: "Strategy",
    title: "Why enterprise transformation fails — and how to fix it",
    date: "Coming soon",
  },
  {
    tag: "Engineering",
    title: "Modernizing legacy systems without halting the business",
    date: "Coming soon",
  },
  {
    tag: "Design",
    title: "Designing for complexity: enterprise UX that scales",
    date: "Coming soon",
  },
];

export default function InsightsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Thought leadership for the digital enterprise"
        description="Perspectives on strategy, engineering, and design from the teams building mission-critical systems."
      />

      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <Stagger className="grid gap-5 md:grid-cols-3">
            {articles.map((a) => (
              <StaggerItem key={a.title}>
                <article className="flex h-full flex-col rounded-2xl border border-hairline bg-elevated/60 p-7">
                  <span className="w-fit rounded-full border border-hairline px-3 py-1 text-xs text-accent">
                    {a.tag}
                  </span>
                  <h3 className="mt-5 flex-1 text-lg font-semibold leading-snug">
                    {a.title}
                  </h3>
                  <span className="mt-6 text-xs text-fg-subtle">{a.date}</span>
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
