"use client";

import { useEffect, useState } from "react";
import { Bell, Check, Save } from "lucide-react";
import { adminFetch } from "@/lib/adminClient";
import type { NotificationRow, EmailTemplate } from "@/lib/adminData";

export default function NotificationsPage() {
  const [notes, setNotes] = useState<NotificationRow[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [active, setActive] = useState(0);
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");

  const load = () => {
    adminFetch("/api/admin/notifications").then((r) => r.json()).then((d) => setNotes(d.notifications || [])).catch(() => {});
    adminFetch("/api/admin/templates").then((r) => r.json()).then((d) => setTemplates(d.templates || [])).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const markRead = async (id: string) => {
    const res = await adminFetch("/api/admin/notifications", { method: "PATCH", body: JSON.stringify({ id }) });
    if (res.ok) setNotes((xs) => xs.map((x) => (x.id === id ? { ...x, read: true } : x)));
  };
  const markAll = async () => {
    const res = await adminFetch("/api/admin/notifications", { method: "PATCH", body: JSON.stringify({ all: true }) });
    if (res.ok) setNotes((xs) => xs.map((x) => ({ ...x, read: true })));
  };

  const tpl = templates[active];
  const setTpl = (patch: Partial<EmailTemplate>) =>
    setTemplates((xs) => xs.map((t, i) => (i === active ? { ...t, ...patch } : t)));

  const saveTpl = async () => {
    if (!tpl) return;
    setSaved(""); setError("");
    const res = await adminFetch("/api/admin/templates", { method: "PUT", body: JSON.stringify({ key: tpl.key, subject: tpl.subject, body: tpl.body }) });
    if (res.ok) { setSaved("Saved."); setTimeout(() => setSaved(""), 1500); }
    else setError((await res.json()).error || "Save failed.");
  };

  const unread = notes.filter((n) => !n.read).length;

  return (
    <div className="max-w-5xl">
      <header className="mb-8">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-fg sm:text-3xl">Notifications & email templates</h1>
        <p className="mt-1 text-sm text-fg-muted">Key events and the editable emails sent to clients.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Notifications */}
        <section className="rounded-2xl border border-hairline bg-elevated/60 p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-fg-subtle">
              <Bell size={15} /> Alerts {unread > 0 && <span className="rounded-full bg-accent px-1.5 text-[10px] font-semibold text-on-accent">{unread}</span>}
            </h2>
            {unread > 0 && <button onClick={markAll} className="text-xs text-fg-muted hover:text-fg">Mark all read</button>}
          </div>
          {notes.length === 0 ? <p className="text-sm text-fg-subtle">No notifications.</p> : (
            <ul className="space-y-2">
              {notes.map((n) => (
                <li key={n.id} className={`rounded-lg border p-3 ${n.read ? "border-hairline" : "border-hairline-strong bg-base"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-fg">{n.title}</div>
                      {n.body && <div className="text-xs text-fg-subtle">{n.body}</div>}
                      <div className="mt-1 text-[11px] text-fg-subtle">{new Date(n.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                    </div>
                    {!n.read && <button onClick={() => markRead(n.id)} className="shrink-0 text-fg-subtle hover:text-fg" title="Mark read"><Check size={15} /></button>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Templates */}
        <section className="rounded-2xl border border-hairline bg-elevated/60 p-6 lg:col-span-3">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-fg-subtle">Email templates</h2>
          {templates.length === 0 ? <p className="text-sm text-fg-subtle">No templates.</p> : (
            <>
              <div className="mb-4 flex flex-wrap gap-2">
                {templates.map((t, i) => (
                  <button key={t.key} onClick={() => setActive(i)} className={`rounded-full border px-3 py-1 text-xs ${i === active ? "border-accent text-fg" : "border-hairline text-fg-muted hover:text-fg"}`}>
                    {t.key.replace(/_/g, " ")}
                  </button>
                ))}
              </div>
              {tpl && (
                <div className="space-y-3">
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-fg">Subject</span>
                    <input value={tpl.subject} onChange={(e) => setTpl({ subject: e.target.value })} className="h-10 w-full rounded-lg border border-hairline-strong bg-elevated px-3 text-sm text-fg outline-none focus:border-accent" />
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-fg">Body</span>
                    <textarea value={tpl.body} onChange={(e) => setTpl({ body: e.target.value })} rows={8} className="w-full rounded-lg border border-hairline-strong bg-elevated px-3 py-2 font-mono text-sm text-fg outline-none focus:border-accent" />
                  </label>
                  <p className="text-xs text-fg-subtle">Placeholders like <code className="rounded bg-base px-1 font-mono">{"{{name}}"}</code>, <code className="rounded bg-base px-1 font-mono">{"{{client_id}}"}</code>, <code className="rounded bg-base px-1 font-mono">{"{{number}}"}</code> are filled in when the email is sent.</p>
                  <div className="flex items-center gap-3">
                    <button onClick={saveTpl} className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent"><Save size={14} /> Save template</button>
                    {saved && <span className="text-sm text-[color:var(--success)]">{saved}</span>}
                    {error && <span className="text-sm text-danger">{error}</span>}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
