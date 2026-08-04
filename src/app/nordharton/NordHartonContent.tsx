"use client";

import {
  Layers, Boxes, Cloud, ShieldCheck,
  Compass, PenTool, Hammer, Rocket, LifeBuoy,
  Eye, Users, Target, GitBranch, Lock,
  Radar, BellOff, Filter, CheckCircle2,
} from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Carousel } from "@/components/ui/carousel";
import ProcessCardStack from "@/components/ui/process-card-stack";
import CountUpInline from "@/components/site/CountUpInline";

/* ------------------------------------------------------------------ */

const WHAT = [
  { icon: Layers, kicker: "Build", title: "Custom platforms", body: "Bespoke web applications engineered for real complexity — advanced interfaces, dense data, and workflows off-the-shelf tools can't touch." },
  { icon: Boxes, kicker: "Modernize", title: "Business systems", body: "ERP, CRM, and workflow automation shaped around how your organization actually runs — and legacy modernization without halting the business." },
  { icon: Cloud, kicker: "Scale", title: "Cloud & infrastructure", body: "Scalable architecture, CI/CD, and observability built for performance and predictable cost — a foundation that just works." },
  { icon: ShieldCheck, kicker: "Protect", title: "Security & governance", body: "Hardened, audit-ready systems for regulated industries — security treated as a design constraint, not a clean-up task." },
];

const PROCESS = [
  { icon: Compass, name: "Discover", detail: "We start by understanding the business, not the brief. A focused discovery maps goals, constraints, and users, then forces a ranking: the one outcome that makes everything else easier." },
  { icon: PenTool, name: "Architect", detail: "We shape a clear plan with measurable outcomes before a line of code — data models, interfaces, and the trade-offs behind them, defended out loud." },
  { icon: Hammer, name: "Build", detail: "Small, reversible steps that keep value flowing. Rigorous review, meaningful tests, and the un-glamorous states — empty, loading, error, permission-denied — handled as first-class work." },
  { icon: Rocket, name: "Deliver", detail: "Zero-drama releases. We ship to production on a cadence you can steer, with a clear timeline and no surprises the week before launch." },
  { icon: LifeBuoy, name: "Sustain", detail: "We stay involved long after launch — monitoring, iterating, and making sure the outcomes hold. Modernization is a capability, not a project with an end date." },
];

const PRACTICES = [
  { icon: Eye, title: "Radical transparency", body: "Blockers surfaced early, with a proposed solution. A problem raised in week two costs a fraction of the same problem found in week twenty." },
  { icon: Users, title: "Senior-only teams", body: "No juniors learning on your project. The people who set the strategy are in the same room as the people who build it." },
  { icon: Target, title: "Outcomes over output", body: "Every technical decision is tied to a measurable business objective. We're paid to move your numbers, not to ship features." },
  { icon: GitBranch, title: "Reversible by design", body: "We favor small, reversible steps over big-bang bets — so the business keeps operating while the foundation is rebuilt underneath it." },
  { icon: Lock, title: "Secure by default", body: "Security and compliance are built into the platform from day one, so your product teams inherit them for free." },
  { icon: CheckCircle2, title: "Craft as a standard", body: "\"Good enough\" never competes with Nord Harton quality. Every deliverable earns its place through review." },
];

const METRICS = [
  { value: 98, suffix: "%", label: "On-time delivery", sub: "Shipped when we said we would." },
  { value: 98, suffix: "%", label: "Client retention", sub: "Partners who stay, engagement after engagement." },
  { value: 100, suffix: "+", label: "Projects delivered", sub: "Across industries and continents." },
  { value: 15, suffix: "+", label: "Years of expertise", sub: "Full-lifecycle, from first line to board strategy." },
];

const SILENT = [
  { icon: Radar, title: "We anticipate", body: "We understand what you expect before you have to spell it out — and plan for the edge cases you haven't thought of yet." },
  { icon: Filter, title: "We surface only what matters", body: "You get the few signals worth acting on, not a firehose of updates. Decisions come to you already framed." },
  { icon: BellOff, title: "We stay out of your way", body: "No constant check-ins, no hand-holding, no noise. The work moves forward while you run your business." },
  { icon: CheckCircle2, title: "No surprises", body: "Honest timelines, clear status, and outcomes delivered quietly and on schedule — the way you'd want it done." },
];

/* ------------------------------------------------------------------ */

export default function NordHartonContent() {
  return (
    <>
      {/* WHAT WE DO */}
      <Section eyebrow="What we do" title="One accountable partner, end to end" sub="Four ways we help — drag through, or use the arrows.">
        <Reveal className="pb-24 sm:pb-20">
          <Carousel slides={WHAT} />
        </Reveal>
      </Section>

      {/* HOW WE DO IT — animated card stack */}
      <Section eyebrow="How we do it" title="A method, not a mystery" sub="Five stages, each with a clear owner and a clear outcome. Step through the stack to see how we work.">
        <Reveal>
          <ProcessCardStack stages={PROCESS} />
        </Reveal>
      </Section>

      {/* PRACTICES */}
      <Section eyebrow="What we practice" title="The habits behind the results" sub="Principles we hold to on every engagement — the reason clients trust us with what matters.">
        <Reveal className="pb-24 sm:pb-20">
          <Carousel slides={PRACTICES} />
        </Reveal>
      </Section>

      {/* METRICS */}
      <Section eyebrow="What we measure" title="Numbers we hold ourselves to" sub="We don't hide behind vanity metrics. These are the outcomes we're accountable for.">
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((m) => (
            <StaggerItem key={m.label}>
              <div className="group h-full rounded-2xl border border-hairline bg-elevated/60 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40">
                <div className="font-heading text-4xl font-semibold tracking-tight text-fg">
                  <CountUpInline to={m.value} suffix={m.suffix} />
                </div>
                <div className="mt-3 text-sm font-medium text-fg">{m.label}</div>
                <div className="mt-1 text-xs leading-relaxed text-fg-subtle">{m.sub}</div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* DELIVER QUIETLY */}
      <Section eyebrow="How it feels to work with us" title="We deliver, quietly">
        <Reveal>
          <p className="-mt-4 mb-10 max-w-2xl text-lg leading-relaxed text-fg-muted">
            The best delivery is the kind you barely notice. We learn exactly what you expect, then make it happen —
            without meetings you don&apos;t need, updates you didn&apos;t ask for, or problems landing on your desk.
            You get the outcome; we absorb the complexity.
          </p>
        </Reveal>
        <Reveal className="pb-24 sm:pb-20">
          <Carousel slides={SILENT} />
        </Reveal>
      </Section>
    </>
  );
}

function Section({
  eyebrow,
  title,
  sub,
  children,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-hairline py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
          {sub && <p className="mt-4 max-w-2xl leading-relaxed text-fg-muted">{sub}</p>}
        </Reveal>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
