import { Reveal } from "@/components/ui/Reveal";
import PageHeader from "@/components/layout/PageHeader";
import CtaBand from "@/components/sections/CtaBand";

export type LegalSection = {
  heading: string;
  body: string[];
  bullets?: string[];
};

export default function LegalDoc({
  eyebrow,
  title,
  intro,
  lastUpdated,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  lastUpdated: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={intro} />

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <Reveal>
            <p className="mb-12 text-sm text-fg-subtle">Last updated: {lastUpdated}</p>
          </Reveal>

          {sections.map((section, i) => (
            <Reveal key={section.heading} delay={i * 0.03}>
              <div className="mb-10">
                <h2 className="text-xl font-semibold tracking-tight text-fg sm:text-2xl">
                  {i + 1}. {section.heading}
                </h2>
                {section.body.map((para, j) => (
                  <p key={j} className="mt-4 leading-relaxed text-fg-muted">
                    {para}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="mt-4 flex flex-col gap-3">
                    {section.bullets.map((b, k) => (
                      <li key={k} className="flex gap-3 leading-relaxed text-fg-muted">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}

          <Reveal>
            <div className="mt-4 rounded-2xl border border-hairline bg-elevated/60 p-6 text-sm leading-relaxed text-fg-muted">
              Questions about this document? Contact us at{" "}
              <a href="mailto:legal@nordhartongroup.com" className="text-accent hover:underline">
                legal@nordhartongroup.com
              </a>
              .
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
