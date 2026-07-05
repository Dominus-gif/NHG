"use client";

import { useRef, useState, type ReactNode, type CSSProperties } from "react";
import { motion, useInView } from "framer-motion";
import CountUpInline from "@/components/site/CountUpInline";

const ease = [0.16, 1, 0.3, 1] as const;
const AXIS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

/* ============ Status pill — professional status indicator ============ */
export function StatusPill({ tone = "info", children, pulse }: { tone?: "success" | "info" | "warning" | "danger" | "neutral"; children: ReactNode; pulse?: boolean }) {
  const map = {
    success: ["var(--success)", "var(--success-soft)"],
    info: ["var(--accent-press)", "var(--accent-soft)"],
    warning: ["var(--warning)", "var(--warning-soft)"],
    danger: ["var(--danger)", "var(--danger-soft)"],
    neutral: ["var(--text-muted)", "var(--surface-subtle)"],
  } as const;
  const [c, soft] = map[tone];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "4px 10px 4px 8px", borderRadius: 999, background: soft, border: `1px solid ${soft}`, fontSize: 12, fontWeight: 500, color: c, whiteSpace: "nowrap" }}>
      <span style={{ position: "relative", width: 7, height: 7 }}>
        <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: c }} />
        {pulse && <span className="pulse-ring" style={{ position: "absolute", inset: -2, borderRadius: "50%", border: `1px solid ${c}` }} />}
      </span>
      {children}
    </span>
  );
}

/* ============ Trend badge (▲ +8%) ============ */
export function TrendBadge({ value, up = true }: { value: string; up?: boolean }) {
  const c = up ? "var(--success)" : "var(--danger)";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 8, background: up ? "var(--success-soft)" : "var(--danger-soft)", color: c, fontSize: 12, fontWeight: 600 }}>
      <span style={{ fontSize: 9 }}>{up ? "▲" : "▼"}</span>{value}
    </span>
  );
}

/* ============ Stat card — label, value, trend, sparkline ============ */
export function StatCard({ label, value, suffix, trend, up = true, spark = [30, 44, 38, 58, 50, 72, 66, 88], style }: { label: string; value: number; suffix?: string; trend?: string; up?: boolean; spark?: number[]; style?: CSSProperties }) {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 18, ...style }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{label}</span>
        {trend && <TrendBadge value={trend} up={up} />}
      </div>
      <div style={{ marginTop: 8, fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 600, letterSpacing: "-.02em", color: "var(--text-strong)" }}>
        <CountUpInline to={value} suffix={suffix} />
      </div>
      <div style={{ marginTop: 12, height: 40 }}><LineArea points={spark} /></div>
    </div>
  );
}

/* ============ Analytics — pro dashboard chart with grid + axis ============ */
export function AnalyticsChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const bars = [18, 26, 22, 34, 30, 42, 38, 52, 46, 60, 55, 70, 64, 80, 74, 92];
  const [hover, setHover] = useState<number | null>(null);
  const pts = bars.map((b, i) => `${(i / (bars.length - 1)) * 100},${100 - b}`).join(" ");
  const last = bars.length - 1;
  return (
    <div ref={ref}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, letterSpacing: ".08em", color: "var(--text-faint)" }}>DELIVERY VELOCITY</span>
        <StatusPill tone="success" pulse>Live</StatusPill>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16 }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 700, color: "var(--text-strong)" }}><CountUpInline to={750} dur={1600} /></span>
        <TrendBadge value="+8.2%" />
      </div>
      <div style={{ position: "relative", height: 190, borderBottom: "1px solid var(--border)" }}>
        {/* gridlines */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {[0, 25, 50, 75].map((t) => (
            <div key={t} style={{ position: "absolute", left: 0, right: 0, top: `${t}%`, borderTop: "1px dashed var(--border)", opacity: 0.6 }} />
          ))}
        </div>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", gap: "1.4%" }}>
          {bars.map((b, i) => (
            <div key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} style={{ flex: 1, height: "100%", display: "flex", alignItems: "flex-end", cursor: "pointer", position: "relative" }}>
              <motion.div
                initial={{ scaleY: 0 }}
                animate={inView ? { scaleY: b / 100 } : { scaleY: 0 }}
                transition={{ duration: 0.7, ease, delay: i * 0.035 }}
                style={{
                  width: "100%", height: "100%", transformOrigin: "bottom", borderRadius: "4px 4px 0 0",
                  background: i === last || hover === i
                    ? "linear-gradient(180deg, rgba(255,255,255,.9), rgba(255,255,255,.28))"
                    : "linear-gradient(180deg, rgba(255,255,255,.34), rgba(255,255,255,.05))",
                  opacity: hover === null || hover === i ? 1 : 0.45,
                  transition: "opacity .15s, background .15s",
                }}
              />
              {hover === i && (
                <div style={{ position: "absolute", bottom: `calc(${b}% + 8px)`, left: "50%", transform: "translateX(-50%)", background: "var(--surface-subtle)", border: "1px solid var(--border-strong)", borderRadius: 8, padding: "5px 9px", fontSize: 11.5, color: "var(--text-strong)", whiteSpace: "nowrap", boxShadow: "var(--shadow-md)", zIndex: 2 }}>{Math.round(b * 8.1)} deploys</div>
              )}
            </div>
          ))}
        </div>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
          <motion.polyline points={pts} fill="none" stroke="rgba(255,255,255,.8)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0, opacity: 0 }} animate={inView ? { pathLength: 1, opacity: 0.9 } : { pathLength: 0, opacity: 0 }} transition={{ duration: 1.4, ease, delay: 0.3 }} />
          <motion.circle cx={100} cy={100 - bars[last]} r="2.2" fill="rgba(255,255,255,.95)" vectorEffect="non-scaling-stroke" initial={{ scale: 0 }} animate={inView ? { scale: 1 } : { scale: 0 }} transition={{ duration: 0.4, delay: 1.5 }} />
        </svg>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--text-faint)" }}>
        {AXIS.map((a) => <span key={a}>{a}</span>)}
      </div>
    </div>
  );
}

/* ============ Donut — segments draw, center counts up ============ */
export function DonutChart({
  segments = [
    { label: "Delivered", value: 62, color: "rgba(255,255,255,0.9)" },
    { label: "In progress", value: 26, color: "rgba(255,255,255,0.42)" },
    { label: "Scoping", value: 12, color: "rgba(255,255,255,0.18)" },
  ],
  centerValue = 30,
  centerLabel = "Active",
}: {
  segments?: { label: string; value: number; color: string }[];
  centerValue?: number;
  centerLabel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const R = 42;
  const C = 2 * Math.PI * R;
  const total = segments.reduce((a, s) => a + s.value, 0);
  let offset = 0;
  return (
    <div ref={ref} style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
      <div style={{ position: "relative", width: 130, height: 130 }}>
        <svg viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="60" cy="60" r={R} fill="none" stroke="var(--border)" strokeWidth="12" />
          {segments.map((s, i) => {
            const len = (s.value / total) * C;
            const dash = `${len} ${C - len}`;
            const thisOffset = -offset;
            offset += len;
            return (
              <motion.circle
                key={i}
                cx="60" cy="60" r={R} fill="none"
                stroke={s.color} strokeWidth="12" strokeLinecap="round"
                strokeDasharray={dash}
                initial={{ strokeDashoffset: C }}
                animate={inView ? { strokeDashoffset: thisOffset } : { strokeDashoffset: C }}
                transition={{ duration: 1.1, ease, delay: 0.15 + i * 0.18 }}
              />
            );
          })}
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: "var(--text-strong)" }}><CountUpInline to={centerValue} /></span>
          <span style={{ fontSize: 11, color: "var(--text-faint)" }}>{centerLabel}</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 130 }}>
        {segments.map((s) => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, fontSize: 12.5 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--text-muted)" }}>
              <span style={{ width: 9, height: 9, borderRadius: 3, background: s.color }} />{s.label}
            </span>
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-strong)", fontWeight: 500 }}>{Math.round((s.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ Radar / polar — polygon scales in ============ */
export function RadarChart({
  axes = ["Web", "Systems", "Brand", "Mobile", "Cloud", "Strategy"],
  values = [0.92, 0.8, 0.7, 0.78, 0.85, 0.9],
  size = 240,
}: {
  axes?: string[];
  values?: number[];
  size?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const cx = size / 2, cy = size / 2, R = size / 2 - 34;
  const n = axes.length;
  const pt = (i: number, r: number) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  };
  const rings = [0.25, 0.5, 0.75, 1];
  const dataPts = values.map((v, i) => pt(i, R * v).join(",")).join(" ");
  return (
    <div ref={ref} style={{ display: "flex", justifyContent: "center" }}>
      <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size, maxWidth: "100%" }}>
        {rings.map((r, i) => (
          <polygon key={i} points={axes.map((_, k) => pt(k, R * r).join(",")).join(" ")} fill="none" stroke="rgba(255,255,255,.10)" strokeWidth="1" />
        ))}
        {axes.map((_, i) => { const [x, y] = pt(i, R); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,.08)" strokeWidth="1" />; })}
        <motion.polygon
          points={dataPts}
          fill="rgba(255,255,255,.16)" stroke="var(--accent)" strokeWidth="2"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 1, ease, delay: 0.2 }}
        />
        {values.map((v, i) => { const [x, y] = pt(i, R * v); return (
          <motion.circle key={i} cx={x} cy={y} r="3.5" fill="var(--accent)" initial={{ scale: 0 }} animate={inView ? { scale: 1 } : { scale: 0 }} transition={{ duration: 0.4, ease, delay: 0.6 + i * 0.07 }} />
        ); })}
        {axes.map((a, i) => { const [x, y] = pt(i, R + 18); return (
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="11" fill="var(--text-muted)" fontFamily="var(--font-body-sans)">{a}</text>
        ); })}
      </svg>
    </div>
  );
}

/* ============ Line / area — path draws ============ */
export function LineArea({ points = [30, 45, 38, 60, 52, 74, 68, 88], color = "rgba(255,255,255,0.6)" }: { points?: number[]; color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${(i / (points.length - 1)) * 100} ${100 - p}`).join(" ");
  const area = `${path} L 100 100 L 0 100 Z`;
  return (
    <div ref={ref} style={{ width: "100%", height: "100%" }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
        <motion.path d={area} fill={color} opacity={0.12} initial={{ opacity: 0 }} animate={inView ? { opacity: 0.12 } : { opacity: 0 }} transition={{ duration: 0.8, delay: 0.5 }} />
        <motion.path d={path} fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : { pathLength: 0 }} transition={{ duration: 1.3, ease }} />
      </svg>
    </div>
  );
}

/* ============ Gauge — arc sweeps ============ */
export function Gauge({ value = 92, label = "Delivery health" }: { value?: number; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const R = 52;
  const circ = Math.PI * R; // semicircle length
  const frac = value / 100;
  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <svg viewBox="0 0 140 84" style={{ width: 150, maxWidth: "100%" }}>
        <path d="M14 76 A52 52 0 0 1 126 76" fill="none" stroke="var(--border)" strokeWidth="11" strokeLinecap="round" />
        <motion.path d="M14 76 A52 52 0 0 1 126 76" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="11" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={inView ? { strokeDashoffset: circ * (1 - frac) } : { strokeDashoffset: circ }}
          transition={{ duration: 1.2, ease }} />
      </svg>
      <div style={{ marginTop: -10, fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: "var(--text-strong)" }}><CountUpInline to={value} suffix="%" /></div>
      <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 2 }}>{label}</div>
    </div>
  );
}

export function ChartLegend({ items }: { items: { label: string; color: string }[] }): ReactNode {
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      {items.map((it) => (
        <span key={it.label} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, color: "var(--text-muted)" }}>
          <span style={{ width: 9, height: 9, borderRadius: 3, background: it.color }} />{it.label}
        </span>
      ))}
    </div>
  );
}
