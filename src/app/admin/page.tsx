"use client";

import { useEffect, useState } from "react";
import { Users, UserCheck, UserX, DollarSign, TrendingUp, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { adminFetch } from "@/lib/adminClient";
import { formatMoney } from "@/lib/portal";
import type { AdminOverview } from "@/lib/adminData";
import TaskBoard from "@/components/admin/TaskBoard";

function Kpi({ icon: Icon, label, value, sub, tone }: { icon: typeof Users; label: string; value: string; sub?: string; tone?: string }) {
  return (
    <div className="rounded-2xl border border-hairline bg-elevated/60 p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-fg-subtle">{label}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-hairline bg-base" style={{ color: tone || "var(--accent)" }}>
          <Icon size={16} />
        </span>
      </div>
      <div className="mt-3 font-heading text-3xl font-semibold tracking-tight text-fg">{value}</div>
      {sub && <div className="mt-1 text-xs text-fg-subtle">{sub}</div>}
    </div>
  );
}

function SignupsChart({ data }: { data: { month: string; count: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div className="flex h-40 items-end gap-1.5 sm:gap-2">
      {data.map((d, i) => (
        <div key={i} className="flex min-w-0 flex-1 flex-col items-center gap-2">
          <div className="flex w-full flex-1 items-end">
            <div className="w-full rounded-t-md bg-accent/70 transition-all" style={{ height: `${Math.max(4, (d.count / max) * 100)}%` }} title={`${d.month}: ${d.count}`} />
          </div>
          <span className="w-full truncate text-center font-mono text-[9px] text-fg-subtle sm:text-[10px]">{d.month}</span>
        </div>
      ))}
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
            <Kpi icon={Users} label="Total clients" value={String(overview.totalClients)} />
            <Kpi icon={UserCheck} label="Active" value={String(overview.activeClients)} sub="In good standing" tone="var(--success)" />
            <Kpi icon={UserX} label="Suspended" value={String(overview.suspendedClients)} tone="var(--danger)" />
            <Kpi icon={DollarSign} label="Revenue this month" value={formatMoney(overview.revenueThisMonth, overview.currency)} sub="Succeeded payments" tone="var(--warning)" />
          </div>

          <TaskBoard />

          <div className="grid gap-6 lg:grid-cols-5">
            <section className="rounded-2xl border border-hairline bg-elevated/60 p-6 lg:col-span-3">
              <div className="mb-5 flex items-center gap-2">
                <TrendingUp size={16} className="text-accent" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-fg-subtle">New signups (12 months)</h2>
              </div>
              <SignupsChart data={overview.signups} />
            </section>

            <section className="rounded-2xl border border-hairline bg-elevated/60 p-6 lg:col-span-2">
              <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-fg-subtle">Recent activity</h2>
              {overview.activity.length === 0 ? <p className="text-sm text-fg-subtle">No activity yet.</p> : (
                <ul className="space-y-4">
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
        </div>
      )}
    </div>
  );
}
