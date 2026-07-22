import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import CtaBand from "@/components/sections/CtaBand";
import { Award, Handshake, Lightbulb, Eye, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "About — Nord Harton Group",
  description:
    "Engineering digital transformation at scale. A global digital solutions enterprise built over 15 years to turn complexity into competitive advantage.",
};

const values = [
  {
    icon: Award,
    title: "Excellence Without Compromise",
    body: "For us, excellence is not an aspiration — it is our baseline expectation. Every deliverable undergoes rigorous review, every architecture plan defends its assumptions, and every project team operates under the principle that “good enough” never competes with Nord Harton quality.",
  },
  {
    icon: Handshake,
    title: "Strategic Partnership, Not Project Delivery",
    body: "Most IT providers build a feature set and hand over the keys. We build partnerships. Your success is our metric of performance — so we consult before coding, align technical decisions with business objectives at every stage, and stay involved long after launch to ensure outcomes are sustained.",
  },
  {
    icon: Lightbulb,
    title: "Innovation-Driven Methodology",
    body: "Technology moves faster than most organizations can adapt. We embrace emerging technologies — from AI and distributed cloud architecture to modern DevOps workflows — not as novelties, but as tools to build future-ready solutions your business won't outgrow in 18 months.",
  },
  {
    icon: Eye,
    title: "Transparent Execution Defined by Outcomes",
    body: "We believe the biggest risk in enterprise IT is opacity. Nord Harton operates with radical transparency: clear communication on blockers and risks, honest timelines backed by data, and measurable outcomes instead of vanity metrics. If a project needs course correction, we flag it early — always with a proposed solution.",
  },
  {
    icon: Target,
    title: "Client-Centric Technical Governance",
    body: "Your business objectives guide every technical decision. We don't deploy tech for the sake of technology; we architect solutions around your KPIs, user behaviors, and operational realities. Your mission is our blueprint at every project stage.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="Engineering digital transformation at scale"
        description="Founded 15 years ago on a single conviction: technology should simplify business, not complicate it. What began as a boutique consultancy has evolved into a global digital solutions enterprise."
      />

      <section className="border-b border-hairline py-24 lg:py-28">
        <div className="mx-auto max-w-3xl px-6 lg:px-12">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              From vision to reality
            </span>
            <p className="mt-6 text-lg leading-relaxed text-fg-muted">
              Nord Harton Group was founded 15 years ago on a single conviction:
              technology should simplify business, not complicate it. What began as
              a boutique consultancy has evolved into a global digital solutions
              enterprise, built by teams who have seen the full lifecycle of
              transformation — from the first line of code to board-level strategy
              implementation.
            </p>
            <p className="mt-5 text-lg leading-relaxed text-fg-muted">
              Today, we serve organizations worldwide, delivering the infrastructure
              and innovation that allow legacy enterprises to compete with agile
              startups and new companies to scale without technical debt. We don't
              just build software; we engineer competitive advantage.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-hairline py-24 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:gap-20 lg:px-12">
          <Reveal>
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Our mission: simplification as a strategy
            </h2>
            <p className="mt-4 leading-relaxed text-fg-muted">
              In an era of overwhelming technological choice, our role is to distill
              complexity into clarity. Nord Harton Group empowers organizations with
              innovative digital solutions that accelerate growth and create lasting
              value — not through the latest trend, but through strategic technology
              partnerships built for your specific business objectives.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Our vision: setting global standards in client success
            </h2>
            <p className="mt-4 leading-relaxed text-fg-muted">
              We aspire to be the most trusted partner for enterprises seeking
              transformative capabilities. By consistently delivering quality that
              exceeds industry standards and innovation that anticipates future
              needs, we set the benchmark for what a digital services partnership
              should look like across every market we serve.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-hairline py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <Reveal className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              What we stand for
            </span>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Core values</h2>
          </Reveal>
          <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <StaggerItem key={value.title}>
                  <div className="h-full rounded-2xl border border-hairline bg-elevated/60 p-7">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-hairline bg-base text-accent">
                      <Icon size={20} strokeWidth={1.75} />
                    </div>
                    <h3 className="mt-5 text-base font-semibold">{value.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                      {value.body}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
