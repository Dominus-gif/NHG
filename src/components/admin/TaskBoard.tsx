"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, X, ChevronRight, ChevronLeft, Flag } from "lucide-react";
import { adminFetch } from "@/lib/adminClient";
import { TASK_CATEGORIES, type AdminTask, type TaskCategory, type TaskStatus } from "@/lib/adminData";

const STATUSES: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "To do" },
  { value: "doing", label: "In progress" },
  { value: "done", label: "Done" },
];

const catMeta = (c: string) => TASK_CATEGORIES.find((x) => x.value === c) ?? TASK_CATEGORIES[TASK_CATEGORIES.length - 1];
const priorityColor: Record<string, string> = { high: "var(--danger)", medium: "var(--warning)", low: "var(--text-subtle)" };

function isOverdue(due: string | null, status: TaskStatus) {
  if (!due || status === "done") return false;
  const d = new Date(due);
  return !Number.isNaN(d.getTime()) && d.getTime() < Date.now() - 86_400_000;
}

export default function TaskBoard() {
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<TaskCategory>("follow_up");
  const [due, setDue] = useState("");

  const load = () =>
    adminFetch("/api/admin/tasks").then((r) => r.json()).then((d) => setTasks(d.tasks || [])).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!title.trim()) return;
    const optimistic: AdminTask = { id: `tmp-${Date.now()}`, created_at: new Date().toISOString(), title: title.trim(), notes: null, category, status: "todo", priority: "medium", due_date: due || null };
    setTasks((t) => [optimistic, ...t]);
    setTitle(""); setDue("");
    const res = await adminFetch("/api/admin/tasks", { method: "POST", body: JSON.stringify({ title: optimistic.title, category, due_date: due || null }) });
    if (res.ok) load();
  };

  const move = async (t: AdminTask, dir: 1 | -1) => {
    const order: TaskStatus[] = ["todo", "doing", "done"];
    const next = order[Math.min(2, Math.max(0, order.indexOf(t.status) + dir))];
    setTasks((xs) => xs.map((x) => (x.id === t.id ? { ...x, status: next } : x)));
    await adminFetch(`/api/admin/tasks/${t.id}`, { method: "PATCH", body: JSON.stringify({ status: next }) });
  };

  const remove = async (t: AdminTask) => {
    setTasks((xs) => xs.filter((x) => x.id !== t.id));
    await adminFetch(`/api/admin/tasks/${t.id}`, { method: "DELETE" });
  };

  const columns = useMemo(() => STATUSES.map((s) => ({ ...s, items: tasks.filter((t) => t.status === s.value) })), [tasks]);

  return (
    <section className="rounded-2xl border border-hairline bg-elevated/60 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-fg-subtle">Task board &amp; follow-ups</h2>
        <span className="text-xs text-fg-subtle">{tasks.filter((t) => t.status !== "done").length} open</span>
      </div>

      {/* Quick add */}
      <div className="mb-5 flex flex-col gap-2 sm:flex-row">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add a task or follow-up…"
          className="h-9 flex-1 rounded-lg border border-hairline-strong bg-elevated px-3 text-sm text-fg outline-none focus:border-accent"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value as TaskCategory)} style={{ colorScheme: "dark" }} className="h-9 rounded-lg border border-hairline-strong bg-elevated px-2 text-sm text-fg outline-none focus:border-accent">
          {TASK_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <input type="date" value={due} onChange={(e) => setDue(e.target.value)} style={{ colorScheme: "dark" }} className="h-9 rounded-lg border border-hairline-strong bg-elevated px-2 text-sm text-fg outline-none focus:border-accent" />
        <button onClick={add} className="inline-flex h-9 items-center justify-center gap-1 rounded-lg bg-accent px-3 text-sm font-medium text-on-accent"><Plus size={15} /> Add</button>
      </div>

      {loading ? <p className="text-sm text-fg-muted">Loading…</p> : (
        <div className="grid gap-4 lg:grid-cols-3">
          {columns.map((col) => (
            <div key={col.value} className="rounded-xl border border-hairline bg-base/40 p-3">
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">{col.label}</span>
                <span className="text-[11px] text-fg-subtle">{col.items.length}</span>
              </div>
              <div className="space-y-2">
                {col.items.map((t) => {
                  const cm = catMeta(t.category);
                  const overdue = isOverdue(t.due_date, t.status);
                  return (
                    <div key={t.id} className="group rounded-lg border border-hairline bg-elevated p-3" style={{ borderLeft: `3px solid ${cm.color}` }}>
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm leading-snug text-fg">{t.title}</p>
                        <button onClick={() => remove(t)} className="shrink-0 text-fg-subtle opacity-0 transition-opacity hover:text-danger group-hover:opacity-100" title="Delete"><X size={14} /></button>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                        <span className="rounded-full px-1.5 py-0.5" style={{ background: "var(--surface-subtle)", color: cm.color }}>{cm.label}</span>
                        <Flag size={11} style={{ color: priorityColor[t.priority] }} />
                        {t.due_date && <span className={overdue ? "text-[color:var(--danger)]" : "text-fg-subtle"}>{overdue ? "Overdue · " : "Due "}{new Date(t.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>}
                        <span className="ml-auto flex items-center gap-1 text-fg-subtle">
                          {t.status !== "todo" && <button onClick={() => move(t, -1)} title="Back" className="hover:text-fg"><ChevronLeft size={14} /></button>}
                          {t.status !== "done" && <button onClick={() => move(t, 1)} title="Advance" className="hover:text-fg"><ChevronRight size={14} /></button>}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {col.items.length === 0 && <p className="px-1 py-3 text-center text-xs text-fg-subtle">—</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
