"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Power, Trash2, KeyRound, Copy, Check, AtSign, Upload, Download, Send } from "lucide-react";
import { adminFetch } from "@/lib/adminClient";
import { formatMoney } from "@/lib/portal";

const PROFILE_FIELDS: (keyof Client)[] = ["name", "company", "industry", "crm_name", "crm_email", "crm_phone"];

type Client = {
  id: string; client_id: string; name: string; company: string | null; industry: string | null;
  status: string; created_at?: string; crm_name?: string | null; crm_email?: string | null; crm_phone?: string | null; notes?: string | null;
};
type Svc = { id: string; name: string; description: string | null; status: string; progress?: number };
type Catalog = { id: string; name: string; description: string | null };
type Doc = { id: string; title: string; kind: string; version: number; released: boolean };
type Update = { id: string; created_at: string; body: string; service_id: string | null };
type Inv = { id: string; number: string; service: string | null; amount: number; currency: string; status: string; due: string | null };

const field = "h-10 w-full rounded-lg border border-hairline-strong bg-elevated px-3 text-sm text-fg outline-none transition-colors focus:border-accent";

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [client, setClient] = useState<Client | null>(null);
  const [services, setServices] = useState<Svc[]>([]);
  const [invoices, setInvoices] = useState<Inv[]>([]);
  const [catalog, setCatalog] = useState<Catalog[]>([]);
  const [assignId, setAssignId] = useState("");
  const [username, setUsername] = useState("");
  const [unBusy, setUnBusy] = useState(false);
  const [unMsg, setUnMsg] = useState("");
  const [docs, setDocs] = useState<Doc[]>([]);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docTitle, setDocTitle] = useState("");
  const [docBusy, setDocBusy] = useState(false);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [updateBody, setUpdateBody] = useState("");
  const [updateSvc, setUpdateSvc] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [customPw, setCustomPw] = useState("");
  const [issuedPw, setIssuedPw] = useState("");
  const [pwBusy, setPwBusy] = useState(false);
  const [pwCopied, setPwCopied] = useState(false);

  const loadDocs = () => adminFetch("/api/admin/documents").then((r) => r.json()).then((d) => setDocs((d.documents || []).filter((x: { client_id?: string }) => x.client_id === id))).catch(() => {});
  const loadUpdates = () => adminFetch(`/api/admin/clients/${id}/updates`).then((r) => r.json()).then((d) => setUpdates(d.updates || [])).catch(() => {});

  useEffect(() => {
    adminFetch(`/api/admin/clients/${id}`)
      .then(async (r) => { if (!r.ok) throw new Error((await r.json()).error || "Failed"); return r.json(); })
      .then((d) => { setClient(d.client); setServices(d.services || []); setInvoices(d.invoices || []); setUsername(d.client?.client_id || ""); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    adminFetch("/api/admin/services").then((r) => r.json()).then((d) => setCatalog(d.services || [])).catch(() => {});
    loadDocs();
    loadUpdates();
  }, [id]);

  const saveUsername = async () => {
    setUnBusy(true); setUnMsg("");
    const res = await adminFetch(`/api/admin/clients/${id}/username`, { method: "POST", body: JSON.stringify({ username }) });
    const d = await res.json();
    setUnBusy(false);
    if (res.ok) { setUnMsg("Saved."); setClient((c) => (c ? { ...c, client_id: d.client_id } : c)); }
    else setUnMsg(d.error || "Could not update username.");
  };

  const uploadDoc = async () => {
    if (!docFile) return;
    setDocBusy(true);
    const fd = new FormData();
    fd.append("file", docFile); fd.append("client_id", id);
    if (docTitle) fd.append("title", docTitle);
    const res = await adminFetch("/api/admin/documents", { method: "POST", body: fd });
    setDocBusy(false);
    if (res.ok) { setDocFile(null); setDocTitle(""); loadDocs(); }
  };
  const downloadDoc = async (d: Doc) => {
    const res = await adminFetch(`/api/admin/documents/${d.id}`);
    const j = await res.json();
    if (res.ok && j.url && j.url !== "#") window.open(j.url, "_blank");
  };
  const setProgress = async (s: Svc, progress: number) => {
    setServices((xs) => xs.map((x) => (x.id === s.id ? { ...x, progress } : x)));
    await adminFetch(`/api/admin/clients/${id}/services`, { method: "PATCH", body: JSON.stringify({ service_id: s.id, progress }) });
  };
  const postUpdate = async () => {
    if (!updateBody.trim()) return;
    const res = await adminFetch(`/api/admin/clients/${id}/updates`, { method: "POST", body: JSON.stringify({ body: updateBody, service_id: updateSvc || undefined }) });
    const d = await res.json();
    if (res.ok) { setUpdateBody(""); setUpdateSvc(""); if (d.update) setUpdates((u) => [d.update, ...u]); else loadUpdates(); }
  };

  const assignService = async () => {
    const item = catalog.find((c) => c.id === assignId);
    if (!item) return;
    const res = await adminFetch(`/api/admin/clients/${id}/services`, { method: "POST", body: JSON.stringify({ name: item.name, description: item.description }) });
    const d = await res.json();
    if (res.ok && d.service) { setServices((s) => [...s, d.service]); setAssignId(""); }
  };
  const removeService = async (sid: string) => {
    const res = await adminFetch(`/api/admin/clients/${id}/services?service_id=${sid}`, { method: "DELETE" });
    if (res.ok) setServices((s) => s.filter((x) => x.id !== sid));
  };

  const set = (k: keyof Client) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setClient((c) => (c ? { ...c, [k]: e.target.value } : c));

  const save = async () => {
    if (!client) return;
    setSaving(true); setMsg(""); setError("");
    const res = await adminFetch(`/api/admin/clients/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        name: client.name, company: client.company, industry: client.industry,
        crm_name: client.crm_name, crm_email: client.crm_email, crm_phone: client.crm_phone, notes: client.notes,
      }),
    });
    setSaving(false);
    if (res.ok) setMsg("Saved."); else setError((await res.json()).error || "Save failed.");
  };

  const toggleStatus = async () => {
    if (!client) return;
    const next = client.status === "suspended" ? "active" : "suspended";
    const res = await adminFetch(`/api/admin/clients/${id}`, { method: "PATCH", body: JSON.stringify({ status: next }) });
    if (res.ok) setClient({ ...client, status: next });
  };

  const remove = async () => {
    if (!confirm("Delete this client and their login? This cannot be undone.")) return;
    const res = await adminFetch(`/api/admin/clients/${id}`, { method: "DELETE" });
    if (res.ok) router.push("/admin/clients");
    else setError((await res.json()).error || "Delete failed.");
  };

  const resetPassword = async (custom?: string) => {
    setPwBusy(true); setIssuedPw("");
    const res = await adminFetch(`/api/admin/clients/${id}/password`, { method: "POST", body: JSON.stringify(custom ? { password: custom } : {}) });
    const data = await res.json();
    setPwBusy(false);
    if (res.ok) { setIssuedPw(data.password); setCustomPw(""); }
    else setError(data.error || "Could not set password.");
  };

  if (loading) return <p className="text-sm text-fg-muted">Loading…</p>;
  if (error && !client) return <p className="text-sm text-danger">{error}</p>;
  if (!client) return null;

  const suspended = client.status === "suspended";
  const filled = PROFILE_FIELDS.filter((f) => String((client as Client)[f] ?? "").trim()).length;
  const completeness = Math.round((filled / PROFILE_FIELDS.length) * 100);

  return (
    <div className="max-w-3xl">
      <Link href="/admin/clients" className="inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-accent">
        <ArrowLeft size={15} /> All clients
      </Link>

      <header className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-fg sm:text-3xl">{client.name}</h1>
          <p className="mt-1 font-mono text-xs text-fg-subtle">{client.client_id}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={toggleStatus} className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors ${suspended ? "border-[color:var(--success)] text-[color:var(--success)]" : "border-hairline-strong text-fg-muted hover:text-fg"}`}>
            <Power size={14} /> {suspended ? "Activate" : "Suspend"}
          </button>
          <button onClick={remove} className="inline-flex items-center gap-1.5 rounded-lg border border-hairline-strong px-3 py-2 text-sm text-danger transition-colors hover:border-danger">
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </header>

      {suspended && <p className="mt-3 rounded-lg border border-hairline bg-elevated/60 px-3 py-2 text-xs text-[color:var(--danger)]">This account is suspended — the client cannot sign in.</p>}

      {/* Profile completeness */}
      <div className="mt-5 rounded-xl border border-hairline bg-elevated/60 px-4 py-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-fg-muted">Profile completeness</span>
          <span className={completeness === 100 ? "text-[color:var(--success)]" : "text-fg"}>{completeness}%{completeness < 100 ? " · complete the profile below" : ""}</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-subtle">
          <div className="h-full rounded-full transition-all" style={{ width: `${completeness}%`, background: completeness === 100 ? "var(--success)" : "var(--accent)" }} />
        </div>
      </div>

      {/* Edit form */}
      <section className="mt-6 rounded-2xl border border-hairline bg-elevated/60 p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-fg-subtle">Details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Label t="Contact name"><input className={field} value={client.name} onChange={set("name")} /></Label>
          <Label t="Company"><input className={field} value={client.company ?? ""} onChange={set("company")} /></Label>
          <Label t="Industry"><input className={field} value={client.industry ?? ""} onChange={set("industry")} /></Label>
          <Label t="Relationship manager"><input className={field} value={client.crm_name ?? ""} onChange={set("crm_name")} /></Label>
          <Label t="Contact email"><input className={field} value={client.crm_email ?? ""} onChange={set("crm_email")} /></Label>
          <Label t="Contact phone"><input className={field} value={client.crm_phone ?? ""} onChange={set("crm_phone")} /></Label>
          <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
            <span className="font-medium text-fg">Notes</span>
            <textarea value={client.notes ?? ""} onChange={(e) => setClient((c) => (c ? { ...c, notes: e.target.value } : c))} rows={3} placeholder="Internal notes about this client" className="w-full rounded-lg border border-hairline-strong bg-elevated px-3 py-2 text-sm text-fg outline-none transition-colors focus:border-accent" />
          </label>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent disabled:opacity-50">
            <Save size={14} /> {saving ? "Saving…" : "Save changes"}
          </button>
          {msg && <span className="text-sm text-[color:var(--success)]">{msg}</span>}
          {error && <span className="text-sm text-danger">{error}</span>}
        </div>
      </section>

      {/* Login & security */}
      <section className="mt-6 rounded-2xl border border-hairline bg-elevated/60 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-fg-subtle"><KeyRound size={15} /> Login &amp; security</h2>

        {/* Login username (changeable anytime) */}
        <div className="mb-5">
          <label className="text-sm font-medium text-fg">Login username</label>
          <p className="mt-0.5 text-xs text-fg-subtle">The client signs in with this. Changing it updates their login immediately.</p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <AtSign size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle" />
              <input value={username} onChange={(e) => setUsername(e.target.value)} className={`${field} pl-8`} placeholder="e.g. NHG-2048 or ACME-001" />
            </div>
            <button onClick={saveUsername} disabled={unBusy || !username.trim() || username === client.client_id} className="rounded-lg border border-hairline-strong px-4 py-2 text-sm text-fg-muted transition-colors hover:text-fg disabled:opacity-40">{unBusy ? "Saving…" : "Update username"}</button>
          </div>
          {unMsg && <p className={`mt-2 text-sm ${unMsg === "Saved." ? "text-[color:var(--success)]" : "text-danger"}`}>{unMsg}</p>}
        </div>

        <div className="mb-4 border-t border-hairline" />
        <p className="text-sm text-fg-muted">Reset the client&apos;s portal password.</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex flex-1 flex-col gap-1.5 text-sm">
            <span className="font-medium text-fg">Set a specific password (optional)</span>
            <input value={customPw} onChange={(e) => setCustomPw(e.target.value)} placeholder="Min 8 characters" className={field} />
          </label>
          <div className="flex gap-2">
            <button onClick={() => resetPassword(customPw)} disabled={pwBusy || customPw.length < 8} className="rounded-lg border border-hairline-strong px-4 py-2 text-sm text-fg-muted transition-colors hover:text-fg disabled:opacity-40">Set password</button>
            <button onClick={() => resetPassword()} disabled={pwBusy} className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent disabled:opacity-50"><KeyRound size={14} /> {pwBusy ? "Working…" : "Generate & reset"}</button>
          </div>
        </div>
        {issuedPw && (
          <div className="mt-4 rounded-lg border border-hairline bg-base p-3">
            <div className="text-xs uppercase tracking-wider text-fg-subtle">New password — share securely</div>
            <div className="mt-1 flex items-center gap-2">
              <code className="rounded-md border border-hairline bg-elevated px-2 py-1 font-mono text-sm text-fg">{issuedPw}</code>
              <button onClick={() => { navigator.clipboard.writeText(issuedPw); setPwCopied(true); setTimeout(() => setPwCopied(false), 1200); }} className="text-fg-subtle hover:text-fg">
                {pwCopied ? <Check size={15} className="text-[color:var(--success)]" /> : <Copy size={15} />}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Services + invoices */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-hairline bg-elevated/60 p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-fg-subtle">Services</h2>
          {services.length === 0 ? <p className="text-sm text-fg-subtle">No services assigned yet.</p> : (
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s.id} className="rounded-lg border border-hairline p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-fg">{s.name}</div>
                      {s.description && <div className="text-xs text-fg-subtle">{s.description}</div>}
                    </div>
                    <button onClick={() => removeService(s.id)} className="shrink-0 text-fg-subtle transition-colors hover:text-danger" title="Remove service"><Trash2 size={14} /></button>
                  </div>
                  <div className="mt-2.5 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-subtle">
                      <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${s.progress ?? 0}%` }} />
                    </div>
                    <input type="number" min={0} max={100} value={s.progress ?? 0} onChange={(e) => setProgress(s, Number(e.target.value))} className="h-7 w-14 rounded-md border border-hairline-strong bg-elevated px-2 text-xs text-fg outline-none focus:border-accent" />
                    <span className="text-xs text-fg-subtle">%</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {/* Assign from catalog */}
          <div className="mt-4 flex gap-2">
            <select value={assignId} onChange={(e) => setAssignId(e.target.value)} style={{ colorScheme: "dark" }} className="h-9 flex-1 rounded-lg border border-hairline-strong bg-elevated px-3 text-sm text-fg outline-none focus:border-accent">
              <option value="">Assign a service…</option>
              {catalog.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <button onClick={assignService} disabled={!assignId} className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-on-accent disabled:opacity-50">Assign</button>
          </div>
        </section>
        <section className="rounded-2xl border border-hairline bg-elevated/60 p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-fg-subtle">Invoices</h2>
          {invoices.length === 0 ? <p className="text-sm text-fg-subtle">No invoices.</p> : (
            <ul className="space-y-2">
              {invoices.map((i) => (
                <li key={i.id} className="flex items-center justify-between rounded-lg border border-hairline p-3">
                  <div>
                    <div className="text-sm font-medium text-fg">{i.number}</div>
                    <div className="text-xs text-fg-subtle">{formatMoney(i.amount, i.currency)} · {i.service || "—"}</div>
                  </div>
                  <span className="text-xs capitalize text-fg-muted">{i.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Updates & notes */}
      <section className="mt-6 rounded-2xl border border-hairline bg-elevated/60 p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-fg-subtle">Updates &amp; notes</h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <textarea value={updateBody} onChange={(e) => setUpdateBody(e.target.value)} rows={2} placeholder="Post an update for this client (visible in their portal)…" className="flex-1 rounded-lg border border-hairline-strong bg-elevated px-3 py-2 text-sm text-fg outline-none focus:border-accent" />
          <div className="flex flex-col gap-2">
            <select value={updateSvc} onChange={(e) => setUpdateSvc(e.target.value)} style={{ colorScheme: "dark" }} className="h-9 rounded-lg border border-hairline-strong bg-elevated px-2 text-sm text-fg outline-none focus:border-accent">
              <option value="">General</option>
              {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <button onClick={postUpdate} disabled={!updateBody.trim()} className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent disabled:opacity-50"><Send size={14} /> Post</button>
          </div>
        </div>
        <ul className="mt-5 space-y-3">
          {updates.map((u) => (
            <li key={u.id} className="rounded-lg border border-hairline p-3">
              <p className="text-sm text-fg">{u.body}</p>
              <p className="mt-1 text-[11px] text-fg-subtle">{new Date(u.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}{u.service_id ? ` · ${services.find((s) => s.id === u.service_id)?.name ?? "service"}` : ""}</p>
            </li>
          ))}
          {updates.length === 0 && <li className="text-sm text-fg-subtle">No updates yet.</li>}
        </ul>
      </section>

      {/* Documents (per client) */}
      <section className="mt-6 rounded-2xl border border-hairline bg-elevated/60 p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-fg-subtle">Documents</h2>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <label className="flex flex-col gap-1.5 text-sm sm:flex-1"><span className="font-medium text-fg">Title (optional)</span><input className={field} value={docTitle} onChange={(e) => setDocTitle(e.target.value)} placeholder="Defaults to the file name" /></label>
          <input type="file" onChange={(e) => setDocFile(e.target.files?.[0] || null)} className="text-sm text-fg-muted file:mr-3 file:rounded-lg file:border file:border-hairline-strong file:bg-elevated file:px-3 file:py-1.5 file:text-sm file:text-fg" />
          <button onClick={uploadDoc} disabled={!docFile || docBusy} className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent disabled:opacity-50"><Upload size={14} /> {docBusy ? "Uploading…" : "Upload"}</button>
        </div>
        <p className="mt-2 text-xs text-fg-subtle">Uploads here are attached to this client. The full library lives under Documents.</p>
        <ul className="mt-4 space-y-2">
          {docs.map((d) => (
            <li key={d.id} className="flex items-center justify-between rounded-lg border border-hairline p-3">
              <div className="min-w-0">
                <div className="text-sm font-medium text-fg">{d.title} <span className="font-mono text-[11px] text-fg-subtle">v{d.version}</span></div>
                <div className="text-xs text-fg-subtle">{d.kind}{d.released ? " · released" : " · internal"}</div>
              </div>
              <button onClick={() => downloadDoc(d)} className="text-fg-subtle transition-colors hover:text-fg" title="Download"><Download size={15} /></button>
            </li>
          ))}
          {docs.length === 0 && <li className="text-sm text-fg-subtle">No documents for this client yet.</li>}
        </ul>
      </section>
    </div>
  );
}

function Label({ t, children }: { t: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-fg">{t}</span>
      {children}
    </label>
  );
}
