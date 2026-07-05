"use client";

import { useState, useRef, useEffect, type CSSProperties, type ReactNode, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "inverse";
type Size = "sm" | "md" | "lg";

export function Button({
  variant = "primary",
  size = "md",
  iconRight,
  iconLeft,
  full,
  children,
  style = {},
  ...p
}: {
  variant?: Variant;
  size?: Size;
  iconRight?: ReactNode;
  iconLeft?: ReactNode;
  full?: boolean;
  children: ReactNode;
  style?: CSSProperties;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const [h, setH] = useState(false);
  const [a, setA] = useState(false);
  const sizes = {
    sm: { h: 38, pad: "0 18px", fs: 14, r: "var(--radius-pill)" },
    md: { h: 47, pad: "0 24px", fs: 14.5, r: "var(--radius-pill)" },
    lg: { h: 56, pad: "0 30px", fs: 16, r: "var(--radius-pill)" },
  }[size];
  const base: Record<Variant, CSSProperties> = {
    primary: { background: "#FFFFFF", color: "#0E0E0E", borderWidth: 1, borderStyle: "solid", borderColor: "transparent", boxShadow: "var(--shadow-sm)" },
    secondary: { background: "var(--surface)", color: "var(--text-strong)", borderWidth: 1, borderStyle: "solid", borderColor: "var(--border-strong)", boxShadow: "var(--shadow-xs)" },
    ghost: { background: "transparent", color: "var(--text-body)", borderWidth: 1, borderStyle: "solid", borderColor: "transparent" },
    inverse: { background: "#fff", color: "#0E0E0E", borderWidth: 1, borderStyle: "solid", borderColor: "transparent", boxShadow: "var(--shadow-md)" },
  };
  const hov: CSSProperties = h
    ? variant === "primary"
      ? { background: "#ECECEC" }
      : variant === "secondary"
        ? { borderColor: "var(--accent)", color: "var(--accent-press)" }
        : variant === "ghost"
          ? { background: "var(--surface-subtle)", color: "var(--text-strong)" }
          : { background: "#EAEAEA" }
    : {};
  return (
    <button
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => { setH(false); setA(false); }}
      onMouseDown={() => setA(true)}
      onMouseUp={() => setA(false)}
      style={{
        display: full ? "flex" : "inline-flex",
        width: full ? "100%" : "auto",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        height: sizes.h,
        padding: sizes.pad,
        borderRadius: sizes.r,
        fontFamily: "var(--font-body-sans)",
        fontSize: sizes.fs,
        fontWeight: 600,
        cursor: "pointer",
        whiteSpace: "nowrap",
        transform: a ? "scale(.97)" : "none",
        transition: "all var(--dur-fast) var(--ease-out)",
        ...base[variant],
        ...hov,
        ...style,
      }}
      {...p}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}

export function Eyebrow({
  children,
  light,
  style = {},
}: {
  children: ReactNode;
  light?: boolean;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "var(--font-body-sans)",
        fontSize: 13,
        fontWeight: 500,
        color: light ? "rgba(244,244,245,0.72)" : "var(--text-muted)",
        border: "1px solid var(--border-strong)",
        borderRadius: 999,
        padding: "6px 14px",
        background: "rgba(255,255,255,0.03)",
        ...style,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />
      {children}
    </span>
  );
}

type Tone = "neutral" | "accent" | "success" | "glass";

export function Badge({
  tone = "neutral",
  dot,
  children,
  style = {},
}: {
  tone?: Tone;
  dot?: boolean;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const t: Record<Tone, [string, string, string]> = {
    neutral: ["var(--surface-subtle)", "var(--text-muted)", "var(--neutral-400)"],
    accent: ["var(--accent-soft)", "var(--accent-press)", "var(--accent)"],
    success: ["var(--success-soft)", "var(--success)", "var(--success)"],
    glass: ["rgba(255,255,255,.12)", "#fff", "var(--accent)"],
  };
  const c = t[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 12px",
        background: c[0],
        color: c[1],
        fontFamily: "var(--font-body-sans)",
        fontSize: 12.5,
        fontWeight: 600,
        borderRadius: 999,
        ...style,
      }}
    >
      {dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: c[2] }} />}
      {children}
    </span>
  );
}

export function FeatureCard({
  icon,
  title,
  description,
  chips = [],
}: {
  icon: ReactNode;
  title: string;
  description: string;
  chips?: string[];
}) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: 28,
        background: "var(--surface)",
        border: `1px solid ${h ? "var(--accent-soft-2)" : "var(--border)"}`,
        borderRadius: "var(--radius-xl)",
        boxShadow: h ? "var(--shadow-lg)" : "var(--shadow-sm)",
        transform: h ? "translateY(-3px)" : "none",
        transition: "all var(--dur-base) var(--ease-out)",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 50,
          height: 50,
          borderRadius: "var(--radius-md)",
          background: h ? "var(--accent)" : "var(--accent-soft)",
          color: h ? "var(--on-accent)" : "var(--accent-press)",
          transition: "all var(--dur-base) var(--ease-out)",
        }}
      >
        {icon}
      </span>
      <h3 style={{ marginTop: 20, fontSize: 21, fontWeight: 600, color: "var(--text-strong)" }}>{title}</h3>
      <p style={{ marginTop: 10, fontSize: 14.5, lineHeight: 1.6, color: "var(--text-muted)", flex: 1 }}>{description}</p>
      {chips.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18 }}>
          {chips.map((c) => (
            <span
              key={c}
              style={{ padding: "4px 11px", background: "var(--surface-subtle)", color: "var(--text-muted)", fontSize: 11.5, fontWeight: 500, borderRadius: 999 }}
            >
              {c}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function Accordion({ items, defaultOpen = 0 }: { items: { q: string; a: string }[]; defaultOpen?: number }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            style={{
              background: "var(--surface)",
              border: `1px solid ${isOpen ? "var(--accent-soft-2)" : "var(--border)"}`,
              borderRadius: "var(--radius-lg)",
              boxShadow: isOpen ? "var(--shadow-md)" : "var(--shadow-xs)",
              overflow: "hidden",
              transition: "border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)",
            }}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                padding: "18px 22px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left",
                fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--text-strong)",
              }}
            >
              {it.q}
              <span
                style={{
                  flex: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26,
                  borderRadius: "50%", background: isOpen ? "var(--accent)" : "var(--surface-subtle)",
                  color: isOpen ? "var(--on-accent)" : "var(--text-muted)", fontSize: 18, lineHeight: 1,
                  transition: "background var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)",
                  transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                }}
              >
                +
              </span>
            </button>
            <div style={{ maxHeight: isOpen ? 240 : 0, opacity: isOpen ? 1 : 0, transition: "max-height var(--dur-slow) var(--ease-out), opacity var(--dur-base) var(--ease-out)" }}>
              <p style={{ padding: "0 22px 20px", fontSize: 14, lineHeight: 1.65, color: "var(--text-muted)" }}>{it.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function CountUp({ end, suffix, dur = 1400 }: { end: number; suffix?: ReactNode; dur?: number }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let raf = 0;
    let started = false;
    const obs = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting && !started) {
            started = true;
            const t0 = performance.now();
            const tick = (t: number) => {
              const p = Math.min((t - t0) / dur, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              setV(Math.round(eased * end));
              if (p < 1) raf = requestAnimationFrame(tick);
            };
            raf = requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.5 }
    );
    obs.observe(node);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [end, dur]);
  return (
    <span ref={ref}>
      {v}
      {suffix}
    </span>
  );
}
