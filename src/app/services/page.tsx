import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import CtaBand from "@/components/sections/CtaBand";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: "Services — The Lynstad Group",
  description:
    "Custom web applications, business systems, branding, mobile, and cloud infrastructure engineered for enterprise scale.",
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
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <Reveal key={service.title} delay={0.05}>
                  <article className="grid gap-8 py-14 lg:grid-cols-12">
                    <div className="lg:col-span-1">
                      <span className="font-heading text-2xl font-semibold text-fg-subtle">
                        0{i + 1}
                      </span>
                    </div>
                    <div className="lg:col-span-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-hairline bg-elevated text-accent">
                        <Icon size={22} strokeWidth={1.75} />
                      </div>
                      <h2 className="mt-5 text-2xl font-semibold">{service.title}</h2>
                    </div>
                    <div className="lg:col-span-7">
                      <p className="leading-relaxed text-fg-muted">
                        {service.description}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
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
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
