"use client";

import { useEffect, useState } from "react";
import { Users, UserCheck, UserX, DollarSign, TrendingUp, ZoomIn, ZoomOut, RotateCcw, ArrowUpRight } from "lucide-react";
import { adminFetch } from "@/lib/adminClient";
import { formatMoney } from "@/lib/portal";
import type { AdminOverview } from "@/lib/adminData";
import TaskBoard from "@/components/admin/TaskBoard";

function Kpi({ icon: Icon, label, value, sub, tone }: { icon: typeof Users; label: string; value: string; sub?: string; tone: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-hairline bg-elevated/60 p-5">
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: `linear-gradient(90deg, ${tone}, transparent)` }} />
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-fg-subtle">{label}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `color-mix(in oklab, ${tone} 15%, transparent)`, color: tone }}>
          <Icon size={17} />
        </span>
      </div>
      <div className="mt-4 font-heading text-[2rem] font-semibold leading-none tracking-tight text-fg">{value}</div>
      {sub && <div className="mt-1.5 text-xs text-fg-subtle">{sub}</div>}
    </div>
  );
}

function AreaChart({ data }: { data: { month: string; count: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const n = Math.max(2, data.length);
  const pts = data.map((d, i) => ({ x: (i / (n - 1)) * 100, y: 38 - (d.count / max) * 32 }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
  const area = `${line} L100,40 L0,40 Z`;
  return (
    <div>
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-40 w-full">
        <defs>
          <linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#areaG)" />
        <path d={line} fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mt-2 flex justify-between font-mono text-[9px] text-fg-subtle">
        {data.filter((_, i) => i % 2 === 0).map((d, i) => <span key={i}>{d.month}</span>)}
      </div>
    </div>
  );
}

function Donut({ active, suspended }: { active: number; suspended: number }) {
  const total = active + suspended || 1;
  const r = 40, C = 2 * Math.PI * r;
  const activeLen = (active / total) * C;
  return (
    <div className="flex items-center gap-5">
      <div className="relative h-32 w-32 shrink-0">
        <svg viewBox="0 0 100 100" className="h-32 w-32 -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="var(--surface-subtle)" strokeWidth="12" />
          <circle cx="50" cy="50" r={r} fill="none" stroke="var(--success)" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${activeLen} ${C - activeLen}`} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading text-2xl font-semibold text-fg">{total}</span>
          <span className="text-[10px] uppercase tracking-wider text-fg-subtle">clients</span>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--success)" }} /><span className="text-fg-muted">Active</span><span className="ml-auto font-medium text-fg">{active}</span></div>
        <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--surface-subtle)" }} /><span className="text-fg-muted">Suspended</span><span className="ml-auto font-medium text-fg">{suspended}</span></div>
      </div>
    </div>
  );
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Date.now() - then;
  const day = 86_400_000;
  if (diff < day) return "today";
  const days = Math.floor(diff / day);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const ZOOMS = [0.9, 1, 1.1, 1.25];

export default function AdminDashboard() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [error, setError] = useState("");
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    adminFetch("/api/admin/overview")
      .then(async (res) => { if (!res.ok) throw new Error((await res.json()).error || "Failed to load"); return res.json(); })
      .then((d) => setOverview(d.overview))
      .catch((e) => setError(e.message));
  }, []);

  const zoomBy = (dir: 1 | -1) => setZoom((z) => ZOOMS[Math.min(ZOOMS.length - 1, Math.max(0, ZOOMS.indexOf(z) + dir))] ?? 1);

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-fg sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-fg-muted">Clients, revenue, tasks, and recent activity at a glance.</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-hairline bg-elevated/60 p-1">
          <button onClick={() => zoomBy(-1)} disabled={zoom === ZOOMS[0]} className="rounded-md p-1.5 text-fg-muted transition-colors hover:bg-elevated hover:text-fg disabled:opacity-40" title="Zoom out"><ZoomOut size={15} /></button>
          <span className="w-10 text-center font-mono text-xs text-fg-muted">{Math.round(zoom * 100)}%</span>
          <button onClick={() => zoomBy(1)} disabled={zoom === ZOOMS[ZOOMS.length - 1]} className="rounded-md p-1.5 text-fg-muted transition-colors hover:bg-elevated hover:text-fg disabled:opacity-40" title="Zoom in"><ZoomIn size={15} /></button>
          <button onClick={() => setZoom(1)} className="rounded-md p-1.5 text-fg-muted transition-colors hover:bg-elevated hover:text-fg" title="Reset"><RotateCcw size={14} /></button>
        </div>
      </header>

      {error && <p className="mb-6 text-sm text-danger">{error}</p>}
      {!overview && !error && <p className="text-sm text-fg-muted">Loading…</p>}

      {overview && (
        <div style={{ zoom }} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi icon={Users} label="Total clients" value={String(overview.totalClients)} tone="var(--accent)" />
            <Kpi icon={UserCheck} label="Active" value={String(overview.activeClients)} sub="In good standing" tone="var(--success)" />
            <Kpi icon={UserX} label="Suspended" value={String(overview.suspendedClients)} tone="var(--danger)" />
            <Kpi icon={DollarSign} label="Revenue this month" value={formatMoney(overview.revenueThisMonth, overview.currency)} sub="Succeeded payments" tone="var(--warning)" />
          </div>

          {/* Charts row */}
          <div className="grid gap-6 lg:grid-cols-5">
            <section className="rounded-2xl border border-hairline bg-elevated/60 p-6 lg:col-span-3">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-fg-subtle"><TrendingUp size={16} className="text-accent" /> New signups</h2>
                <span className="inline-flex items-center gap-1 text-xs text-fg-subtle"><ArrowUpRight size={13} /> last 12 months</span>
              </div>
              <AreaChart data={overview.signups} />
            </section>
            <section className="rounded-2xl border border-hairline bg-elevated/60 p-6 lg:col-span-2">
              <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-fg-subtle">Client status</h2>
              <Donut active={overview.activeClients} suspended={overview.suspendedClients} />
            </section>
          </div>

          <TaskBoard />

          <section className="rounded-2xl border border-hairline bg-elevated/60 p-6">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-fg-subtle">Recent activity</h2>
            {overview.activity.length === 0 ? <p className="text-sm text-fg-subtle">No activity yet.</p> : (
              <ul className="grid gap-4 sm:grid-cols-2">
                {overview.activity.map((a) => (
                  <li key={a.id} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <div className="min-w-0">
                      <div className="text-sm text-fg">{a.title}</div>
                      {a.detail && <div className="truncate text-xs text-fg-subtle">{a.detail}</div>}
                      <div className="mt-0.5 text-[11px] text-fg-subtle">{timeAgo(a.at)}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
