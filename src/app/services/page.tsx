import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import CtaBand from "@/components/sections/CtaBand";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: "Services — Nord Harton",
  description:
    "Custom web applications, business systems, branding, mobile, and cloud infrastructure engineered for enterprise scale.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Services engineered for enterprise scale"
        description="Every engagement begins with deep domain research and stakeholder alignment — and ends with measurable business outcomes."
      />

      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="divide-y divide-hairline">
            {services.map((service, i) => (
              <Reveal key={service.title} delay={0.05}>
                <article className="group grid gap-8 py-16 lg:grid-cols-12 lg:gap-12">
                  <div className="lg:col-span-5">
                    <div className="flex items-center gap-4">
                      <span className="font-heading text-4xl font-semibold tracking-tight text-fg-subtle transition-colors duration-300 group-hover:text-fg">
                        0{i + 1}
                      </span>
                      <span className="h-px w-14 bg-hairline-strong" />
                    </div>
                    <h2 className="mt-6 text-2xl font-semibold leading-tight sm:text-3xl">
                      {service.title}
                    </h2>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {service.keywords.map((kw) => (
                        <span
                          key={kw}
                          className="rounded-full border border-hairline px-3 py-1 text-xs text-fg-subtle"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="lg:col-span-7 lg:pt-2">
                    <p className="text-lg leading-relaxed text-fg-muted">
                      {service.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
