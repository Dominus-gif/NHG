"use client";

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { motion, useScroll, useTransform, AnimatePresence, type Variants } from "framer-motion";
import { Button } from "@/components/site/primitives";
import { ArrowRight, Check, Workflow, Shield, Code2, Network, Palette, Smartphone, Cloud } from "@/components/site/icons";
import { useContactModal } from "@/components/providers/ContactModalProvider";
import { submitEmailLead } from "@/lib/submissions";
import { AnalyticsChart, DonutChart, Gauge, LineArea, StatCard, StatusPill } from "@/components/site/charts";
import CountUpInline from "@/components/site/CountUpInline";

const ease = [0.16, 1, 0.3, 1] as const;
const wrap: CSSProperties = { maxWidth: 1200, margin: "0 auto", padding: "0 24px" };
const card: CSSProperties = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20 };

/* ---------- motion helpers ---------- */
function Reveal({ children, delay = 0, y = 34, style }: { children: ReactNode; delay?: number; y?: number; style?: CSSProperties }) {
  return (
    <motion.div style={style} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.75, ease, delay }}>{children}</motion.div>
  );
}
const containerV: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } };
const itemV: Variants = { hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.65, ease } } };
function Stagger({ children, style, className }: { children: ReactNode; style?: CSSProperties; className?: string }) {
  return <motion.div className={className} style={style} variants={containerV} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-70px" }}>{children}</motion.div>;
}
function Item({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <motion.div style={style} variants={itemV}>{children}</motion.div>;
}

/** Floating card with scroll-linked parallax. */
function Parallax({ children, from = 60, style }: { children: ReactNode; from?: number; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [from, -from]);
  return <motion.div ref={ref} style={{ y, ...style }}>{children}</motion.div>;
}

const Label = ({ children }: { children: ReactNode }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12.5, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--text-muted)" }}>
    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--text-strong)" }} />{children}
  </span>
);
const SectionHead = ({ label, title, sub, center = true }: { label?: string; title: string; sub?: string; center?: boolean }) => (
  <Reveal style={{ maxWidth: 720, margin: center ? "0 auto" : undefined, textAlign: center ? "center" : "left" }}>
    {label && <div style={{ marginBottom: 16 }}><Label>{label}</Label></div>}
    <h2 style={{ fontSize: "clamp(30px,4vw,50px)", color: "var(--text-strong)", letterSpacing: "-.025em", lineHeight: 1.08, fontWeight: 500 }}>{title}</h2>
    {sub && <p style={{ marginTop: 16, color: "var(--text-muted)", fontSize: 18, lineHeight: 1.6 }}>{sub}</p>}
  </Reveal>
);

/* ===================== Hero ===================== */
export function Hero() {
  return (
    <section id="top" style={{ position: "relative", padding: "80px 24px 40px", overflow: "hidden" }}>
      <motion.div className="blob" style={{ width: 640, height: 640, left: "50%", top: -260, marginLeft: -320, background: "radial-gradient(circle, var(--accent-glow), transparent 62%)" }} animate={{ opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />
      <div style={{ ...wrap, position: "relative", zIndex: 1, textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(40px,6.6vw,82px)", fontWeight: 500, lineHeight: 1.16, letterSpacing: "-.03em", color: "var(--text-strong)", maxWidth: "15ch", margin: "0 auto" }}>
          {["Explore", "the", "reality", "of", "digital", "execution"].map((w, i) => (
            <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", marginRight: ".24em", paddingBottom: ".16em", marginBottom: "-.16em" }}>
              <motion.span style={{ display: "inline-block", ...(w === "execution" ? { backgroundImage: "var(--accent-grad)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" } : {}) }} initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.8, ease, delay: 0.1 + i * 0.06 }}>{w}</motion.span>
            </span>
          ))}
        </h1>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease, delay: 0.5 }} style={{ maxWidth: "52ch", margin: "22px auto 0", color: "var(--text-muted)", fontSize: 18, lineHeight: 1.6 }}>
          Say goodbye to complexity. We transform how your business operates — turning complex requirements into elegant systems that scale.
        </motion.p>
        <HeroEmailForm />
      </div>
      <HeroCards />
    </section>
  );
}

function HeroEmailForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await submitEmailLead(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        style={{ margin: "30px auto 0", maxWidth: 440, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "var(--surface)", border: "1px solid var(--border-strong)", borderRadius: 999, padding: "14px 22px" }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "50%", background: "var(--success-soft)", color: "var(--success)", flexShrink: 0 }}>
          <Check size={15} />
        </span>
        <span style={{ fontSize: 14.5, fontWeight: 500, color: "var(--text-strong)" }}>Thanks — we&apos;ll reach out to you shortly.</span>
      </motion.div>
    );
  }

  return (
    <>
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease, delay: 0.6 }}
        className="hero-email"
        style={{ margin: "30px auto 0", maxWidth: 440, display: "flex", gap: 8, background: "var(--surface)", border: "1px solid var(--border-strong)", borderRadius: 999, padding: 6, transition: "border-color .25s var(--ease-out), box-shadow .25s var(--ease-out)" }}
      >
        <input
          className="lyn-field"
          type="email"
          placeholder="Enter your work email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--text-strong)", fontSize: 14.5, padding: "0 16px", borderRadius: 999 }}
        />
        <Button type="submit" iconRight={<ArrowRight size={16} />} disabled={submitting}>
          {submitting ? "Sending…" : "Get Started"}
        </Button>
      </motion.form>
      {error && <p style={{ marginTop: 10, fontSize: 13, color: "var(--danger)" }}>{error}</p>}
    </>
  );
}

function HeroCards() {
  return (
    <div className="hero-cards" style={{ position: "relative", maxWidth: 1140, margin: "56px auto 0", display: "grid", gridTemplateColumns: "1fr 1.3fr 1fr", gap: 20, alignItems: "center" }}>
      <Parallax from={50}>
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }}>
          <StatCard label="Shipped this quarter" value={18} trend="+12%" spark={[24, 40, 34, 56, 48, 72, 66, 90]} style={{ padding: 22 }} />
        </motion.div>
      </Parallax>
      <Parallax from={90}>
        <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease, delay: 0.1 }} style={{ ...card, padding: 24 }}>
          <AnalyticsChart />
        </motion.div>
      </Parallax>
      <Parallax from={50}>
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease, delay: 0.2 }} style={{ ...card, padding: 22, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>Delivery health</span>
            <StatusPill tone="success">On track</StatusPill>
          </div>
          <Gauge value={91} label="On-time delivery rate" />
        </motion.div>
      </Parallax>
    </div>
  );
}

/* ===================== Logos ===================== */
const LOGOS = ["Adobe", "NordVPN", "Trello", "Notion", "XMCG"];
export function Logos() {
  return (
    <section style={{ padding: "48px 24px 24px" }}>
      <Reveal>
        <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-faint)", marginBottom: 26 }}>Trusted by enterprises and teams across the world</p>
        <Stagger style={{ display: "flex", flexWrap: "wrap", gap: "18px 56px", justifyContent: "center", alignItems: "center" }}>
          {LOGOS.map((l) => <Item key={l}><span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 21, color: "#FFFFFF", opacity: 0.85 }}>{l}</span></Item>)}
        </Stagger>
      </Reveal>
    </section>
  );
}

/* ===================== Feature intro ===================== */
export function FeatureIntro() {
  return (
    <section style={{ padding: "88px 24px 32px", borderTop: "1px solid var(--border)" }}>
      <SectionHead title="Build with complete confidence" sub="Strategy, design, and engineering under one accountable partner — so nothing gets lost between idea and impact." />
    </section>
  );
}

/* ===================== Feature blocks (alternating + parallax) ===================== */
const BLOCKS = [
  { title: "See delivery velocity in real time", body: "A clear snapshot of how every engagement trends week to week — so you can spot patterns, track growth, and make smarter decisions.", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=70", chart: "line" },
  { title: "Highlight the moments that matter", body: "We surface the few signals worth acting on — turning noise into a focused view of what moves your business forward.", img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=70", chart: "donut" },
  { title: "Plan for scale from day one", body: "We architect for growth — so your platform expands cleanly across teams, markets, and millions of users without a rebuild.", img: "https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=900&q=70", chart: "gauge" },
];
export function FeatureBlocks() {
  const { open } = useContactModal();
  return (
    <section style={{ padding: "8px 24px 88px" }}>
      <div style={{ ...wrap, display: "flex", flexDirection: "column", gap: 20 }}>
        {BLOCKS.map((b, i) => {
          const reversed = i % 2 === 1;
          return (
            <Reveal key={b.title}>
              <div className="feature-block" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, ...card, borderRadius: 26, overflow: "hidden" }}>
                <div style={{ padding: 40, display: "flex", flexDirection: "column", justifyContent: "center", order: reversed ? 2 : 1 }}>
                  <h3 style={{ fontSize: "clamp(24px,2.6vw,34px)", color: "var(--text-strong)", letterSpacing: "-.02em", fontWeight: 500, lineHeight: 1.15 }}>{b.title}</h3>
                  <p style={{ marginTop: 14, color: "var(--text-muted)", fontSize: 15.5, lineHeight: 1.6, maxWidth: "42ch" }}>{b.body}</p>
                  <div style={{ marginTop: 26 }}><Button variant="secondary" onClick={open} iconRight={<ArrowRight size={15} />}>Learn more</Button></div>
                </div>
                <div style={{ order: reversed ? 1 : 2, background: "var(--surface-subtle)", display: "flex", flexDirection: "column", padding: 24, gap: 14, minHeight: 360, borderLeft: reversed ? "none" : "1px solid var(--border)", borderRight: reversed ? "1px solid var(--border)" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    {[0, 1, 2].map((k) => <i key={k} style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--border-strong)", display: "inline-block" }} />)}
                    <span style={{ marginLeft: 8, fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--text-faint)" }}>lynstad.group/console</span>
                  </div>
                  <div style={{ flex: 1, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 22, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    {b.chart === "line" && (<><div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}><span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>Delivery velocity</span><span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 24, color: "var(--text-strong)" }}>$15,437</span></div><div style={{ marginTop: 16, height: 130 }}><LineArea points={[26, 42, 34, 58, 50, 76, 66, 90]} /></div></>)}
                    {b.chart === "donut" && (<><div style={{ fontSize: 12.5, color: "var(--text-muted)", marginBottom: 14 }}>Projects by status</div><DonutChart centerValue={30} centerLabel="Active" /></>)}
                    {b.chart === "gauge" && (<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}><Gauge value={91} label="On-time delivery" /></div>)}
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ===================== Two-col features ===================== */
export function TwoCol() {
  const cards = [
    { icon: <Workflow size={22} />, title: "Ship faster, together", body: "Tight delivery loops and working software you can steer every step of the way." },
    { icon: <Shield size={22} />, title: "Organize every engagement", body: "One clear view of scope, progress, and outcomes — no black boxes, ever." },
  ];
  return (
    <section style={{ padding: "88px 24px", borderTop: "1px solid var(--border)" }}>
      <div style={wrap}>
        <SectionHead label="How we work" title="Streamline delivery, zero hassle" sub="We respond quickly, tackle what matters, and stay dedicated to your success." />
        <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 44 }} className="split">
          {cards.map((c) => (
            <Item key={c.title}>
              <div className="card-hover" style={{ ...card, borderRadius: 24, padding: 34, minHeight: 220, display: "flex", flexDirection: "column", justifyContent: "flex-end", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.05), transparent 70%)", opacity: 0.8 }} />
                <div style={{ position: "relative", width: 46, height: 46, borderRadius: 12, background: "var(--surface-subtle)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-strong)", marginBottom: "auto" }}>{c.icon}</div>
                <h3 style={{ marginTop: 20, fontSize: 22, color: "var(--text-strong)", fontWeight: 500 }}>{c.title}</h3>
                <p style={{ marginTop: 8, color: "var(--text-muted)", fontSize: 15 }}>{c.body}</p>
              </div>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ===================== Testimonials carousel ===================== */
const QUOTES = [
  { q: "Partnering with Lynstad was the best decision we made this year. They unified twelve legacy systems into one platform — on time, and beyond what we scoped.", name: "Marcus Chen", role: "CEO, Meridian Capital", initials: "MC" },
  { q: "Lynstad turned a tangle of manual workflows into one clean platform. Sharp, fast, and genuinely invested in our outcomes.", name: "Lucia Romero", role: "COO, Northwind", initials: "LR" },
  { q: "The team shipped faster than our internal roadmap predicted, and the quality was extraordinary. A true partner.", name: "Sara Reyes", role: "CTO, Aurora", initials: "SR" },
  { q: "They understood our business before writing a line of code. That's rare — and it showed in every deliverable.", name: "Liam Nguyen", role: "VP Product, Helix", initials: "LN" },
];
export function Testimonials() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const go = (n: number) => { setDir(n); setI((p) => (p + n + QUOTES.length) % QUOTES.length); };
  const t = QUOTES[i];

  // Auto-advance every 5s (rotating left). Re-runs on i change so manual
  // navigation resets the timer; pauses while hovered.
  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => {
      setDir(1);
      setI((p) => (p + 1) % QUOTES.length);
    }, 3000);
    return () => clearTimeout(id);
  }, [i, paused]);

  return (
    <section style={{ padding: "88px 24px", borderTop: "1px solid var(--border)" }}>
      <div style={{ ...wrap, maxWidth: 900 }}>
        <SectionHead label="Customer stories" title="Trusted by leaders who ship" />
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          style={{ ...card, borderRadius: 26, padding: "44px 40px", marginTop: 40, position: "relative", overflow: "hidden", minHeight: 240 }}
        >
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={i} custom={dir} initial={{ opacity: 0, x: dir * 64 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir * -64 }} transition={{ duration: 0.55, ease }}>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(19px,2.2vw,26px)", lineHeight: 1.4, color: "var(--text-strong)", letterSpacing: "-.01em" }}>&ldquo;{t.q}&rdquo;</p>
              <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--surface-subtle)", border: "1px solid var(--border)", color: "var(--text-strong)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 600 }}>{t.initials}</span>
                <div><div style={{ fontWeight: 500, color: "var(--text-strong)" }}>{t.name}</div><div style={{ fontSize: 13.5, color: "var(--text-muted)" }}>{t.role}</div></div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 32 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => go(-1)} aria-label="Previous" style={arrowBtn}><ArrowRight size={16} style={{ transform: "rotate(180deg)" }} /></button>
              <button onClick={() => go(1)} aria-label="Next" style={arrowBtn}><ArrowRight size={16} /></button>
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)" }}>{i + 1} / {QUOTES.length}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
const arrowBtn: CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 42, height: 42, borderRadius: "50%", background: "var(--surface-subtle)", border: "1px solid var(--border-strong)", color: "var(--text-strong)", cursor: "pointer" };

/* ===================== FAQ ===================== */
const FAQ = [
  { q: "How do engagements with Lynstad start?", a: "Every engagement begins with a discovery session where we map goals, constraints, and users — then shape a clear plan with measurable outcomes before any build begins." },
  { q: "What kind of projects do you take on?", a: "Custom web applications, business systems, branding, mobile apps, and cloud infrastructure — from first strategy session through global scale." },
  { q: "How quickly can we get going?", a: "Most projects move from first conversation to kickoff within two weeks. We'll give you a clear timeline during discovery." },
  { q: "Why should we choose Lynstad?", a: "One accountable partner across strategy, design, and engineering — tied to your KPIs, invested long after launch." },
];
export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section style={{ padding: "88px 24px", borderTop: "1px solid var(--border)" }}>
      <div style={{ ...wrap, display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 60, alignItems: "start" }} className="split">
        <Reveal>
          <div style={{ ...card, borderRadius: 26, height: 300, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, var(--accent-glow), transparent 65%)" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mark.svg" width={72} height={72} alt="Lynstad" style={{ position: "relative", borderRadius: 18 }} />
          </div>
        </Reveal>
        <div>
          <SectionHead center={false} title="Frequently asked questions" />
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column" }}>
            {FAQ.map((f, idx) => {
              const isOpen = open === idx;
              return (
                <div key={f.q} style={{ borderBottom: "1px solid var(--border)" }}>
                  <button onClick={() => setOpen(isOpen ? -1 : idx)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "20px 0", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 500, color: "var(--text-strong)" }}>
                    {f.q}
                    <span style={{ flex: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: "50%", background: isOpen ? "#FFFFFF" : "var(--surface-subtle)", color: isOpen ? "#0E0F11" : "var(--text-muted)", fontSize: 18, transition: "all .25s var(--ease-out)", transform: isOpen ? "rotate(45deg)" : "none" }}>+</span>
                  </button>
                  <div style={{ maxHeight: isOpen ? 200 : 0, opacity: isOpen ? 1 : 0, overflow: "hidden", transition: "max-height .4s var(--ease-out), opacity .3s var(--ease-out)" }}>
                    <p style={{ padding: "0 0 20px", fontSize: 14.5, lineHeight: 1.65, color: "var(--text-muted)" }}>{f.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================== Capabilities — collapsible tiles ===================== */
const CAPS = [
  { icon: <Code2 size={18} />, dot: "var(--c-blue)", title: "Custom Web Applications", body: "Bespoke platforms engineered for enterprise complexity, data, and scale — advanced interfaces, complex workflows, and seamless integrations." },
  { icon: <Network size={18} />, dot: "var(--c-green)", title: "Business System Design", body: "ERP, CRM, and workflow automation tailored to how your organization runs, with custom management portals and reporting." },
  { icon: <Palette size={18} />, dot: "var(--c-lavender)", title: "Website & Branding", body: "Conversion-driven design and digital experiences that elevate brand authority, from corporate sites to full e-commerce." },
  { icon: <Smartphone size={18} />, dot: "var(--c-pink)", title: "Mobile Applications", body: "Native and cross-platform apps from concept through deployment across iOS and Android, with ongoing support." },
  { icon: <Cloud size={18} />, dot: "var(--c-orange)", title: "Cloud & Infrastructure", body: "Scalable architecture, APIs, and microservices built for performance — with DevOps pipelines and enterprise integration." },
  { icon: <Shield size={18} />, dot: "var(--c-cyan)", title: "Security & Compliance", body: "Hardened systems and audit-ready workflows for regulated industries, with end-to-end encryption and monitoring." },
];
function CapCard({ c, idx }: { c: (typeof CAPS)[number]; idx: number }) {
  const [hover, setHover] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.7, ease, delay: idx * 0.09 }}
      style={{ height: "100%" }}
    >
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          ...card,
          position: "relative",
          height: "100%",
          borderRadius: 18,
          padding: "28px 26px",
          background: hover ? "var(--surface-subtle)" : "var(--surface)",
          borderColor: hover ? "var(--border-strong)" : "var(--border)",
          transform: hover ? "translateY(-4px)" : "translateY(0)",
          boxShadow: hover ? "var(--shadow-md)" : "0 1px 2px rgba(0,0,0,0.20)",
          transition: "transform .55s var(--ease-out), border-color .55s var(--ease-out), box-shadow .55s var(--ease-out), background-color .55s var(--ease-out)",
        }}
      >
        <span
          style={{
            position: "relative",
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "var(--surface-subtle)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-strong)",
            transition: "color .55s var(--ease-out)",
          }}
        >
          {c.icon}
          <span style={{ position: "absolute", top: -3, right: -3, width: 8, height: 8, borderRadius: "50%", background: c.dot }} />
        </span>
        <h3 style={{ marginTop: 16, fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 500, color: "var(--text-strong)", letterSpacing: "-.01em" }}>{c.title}</h3>
        <div
          style={{
            display: "grid",
            gridTemplateRows: hover ? "1fr" : "0fr",
            transition: "grid-template-rows .55s var(--ease-out)",
          }}
        >
          <div style={{ overflow: "hidden" }}>
            <p
              style={{
                marginTop: 12,
                fontSize: 14,
                lineHeight: 1.6,
                color: "var(--text-muted)",
                opacity: hover ? 1 : 0,
                transform: hover ? "translateY(0)" : "translateY(8px)",
                transition: "opacity .5s var(--ease-out) .08s, transform .5s var(--ease-out) .08s",
              }}
            >
              {c.body}
            </p>
            <span
              style={{
                marginTop: 14,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13.5,
                fontWeight: 500,
                color: "var(--accent-press)",
                opacity: hover ? 1 : 0,
                transform: hover ? "translateY(0)" : "translateY(8px)",
                transition: "opacity .5s var(--ease-out) .16s, transform .5s var(--ease-out) .16s",
              }}
            >
              Learn more
              <span style={{ display: "inline-flex", transform: hover ? "translateX(2px)" : "translateX(0)", transition: "transform .5s var(--ease-out) .16s" }}>
                <ArrowRight size={14} />
              </span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Capabilities() {
  return (
    <section id="services" style={{ padding: "88px 24px", borderTop: "1px solid var(--border)" }}>
      <div style={wrap}>
        <SectionHead label="What we build" title="Everything you need, under one roof" sub="Six disciplines, one accountable partner — from first strategy session to global scale." />
        <div
          className="caps-grid"
          style={{
            maxWidth: 1000,
            margin: "48px auto 0",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            alignItems: "start",
            gap: 16,
          }}
        >
          {CAPS.map((c, idx) => (
            <CapCard key={c.title} c={c} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================== Stats band ===================== */
const STATS = [
  { value: 15, suffix: "+", label: "Years of expertise", color: "var(--c-blue)" },
  { value: 100, suffix: "+", label: "Projects delivered", color: "var(--c-green)" },
  { value: 50, suffix: "+", label: "Countries reached", color: "var(--c-lavender)" },
  { value: 98, suffix: "%", label: "Client retention", color: "var(--c-orange)" },
];
export function Stats() {
  return (
    <section style={{ padding: "88px 24px", borderTop: "1px solid var(--border)" }}>
      <div style={wrap}>
        <div style={{ ...card, borderRadius: 26, padding: "48px 40px", background: "var(--surface-inverse)", position: "relative", overflow: "hidden" }}>
          <motion.div className="blob" style={{ width: 420, height: 420, top: -180, right: -80, background: "radial-gradient(circle, var(--accent-glow), transparent 65%)" }} animate={{ opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />
          <Stagger className="stats-grid" style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
            {STATS.map((s) => (
              <Item key={s.label}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 52, letterSpacing: "-.03em", color: "var(--text-strong)", lineHeight: 1 }}>
                  <CountUpInline to={s.value} suffix={s.suffix} /><span style={{ color: "var(--text-faint)" }}>.</span>
                </div>
                <div style={{ marginTop: 8, fontSize: 14.5, color: "var(--text-muted)" }}>{s.label}</div>
              </Item>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
