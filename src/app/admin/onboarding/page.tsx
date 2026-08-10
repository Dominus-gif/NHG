"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Copy, Upload, ArrowRight, ArrowLeft, UserPlus } from "lucide-react";
import { adminFetch } from "@/lib/adminClient";
import { formatMoney } from "@/lib/portal";
import type { ServiceCatalogItem } from "@/lib/adminData";

const field =
  "h-10 w-full rounded-lg border border-hairline-strong bg-elevated px-3 text-sm text-fg outline-none transition-colors focus:border-accent";
const labelCls = "flex flex-col gap-1.5 text-sm";

type Result = { client_id: string; temp_password: string; auth_email?: string };

function Credential({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-fg-subtle">{label}</div>
      <div className="mt-1 flex items-center gap-2">
        <code className="rounded-md border border-hairline bg-base px-2 py-1 font-mono text-sm text-fg">{value}</code>
        <button
          onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1200); }}
          className="text-fg-subtle transition-colors hover:text-fg"
          title="Copy"
        >
          {copied ? <Check size={15} className="text-[color:var(--success)]" /> : <Copy size={15} />}
        </button>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const [tab, setTab] = useState<"single" | "bulk">("single");

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-fg sm:text-3xl">Onboard a client</h1>
        <p className="mt-1 text-sm text-fg-muted">Create an account, assign services, and generate secure credentials.</p>
      </header>

      <div className="mb-6 inline-flex rounded-lg border border-hairline bg-elevated/60 p-1 text-sm">
        <button onClick={() => setTab("single")} className={`rounded-md px-3 py-1.5 ${tab === "single" ? "bg-elevated text-fg" : "text-fg-muted"}`}>
          Single
        </button>
        <button onClick={() => setTab("bulk")} className={`rounded-md px-3 py-1.5 ${tab === "bulk" ? "bg-elevated text-fg" : "text-fg-muted"}`}>
          Bulk (CSV)
        </button>
      </div>

      {tab === "single" ? <Wizard /> : <BulkImport />}
    </div>
  );
}

/* --------------------------------- wizard -------------------------------- */

function Wizard() {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [name, setName] = useState("");
  const [crmName, setCrmName] = useState("");
  const [crmEmail, setCrmEmail] = useState("");
  const [crmPhone, setCrmPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [idMode, setIdMode] = useState<"auto" | "custom">("auto");
  const [clientId, setClientId] = useState("");
  const [catalog, setCatalog] = useState<ServiceCatalogItem[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    adminFetch("/api/admin/services").then((r) => r.json()).then((d) => setCatalog(d.services || [])).catch(() => {});
  }, []);

  const steps = ["Company", "Contact", "Services", "Review"];
  const toggle = (id: string) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const create = async () => {
    setSaving(true);
    setError("");
    const services = catalog.filter((c) => selected.has(c.id)).map((c) => ({ name: c.name, description: c.description || "" }));
    const res = await adminFetch("/api/admin/clients", {
      method: "POST",
      body: JSON.stringify({
        name, company, industry, crm_name: crmName, crm_email: crmEmail, crm_phone: crmPhone, notes, services,
        ...(idMode === "custom" && clientId.trim() ? { client_id: clientId.trim() } : {}),
      }),
    });
    setSaving(false);
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Could not create the client."); return; }
    setResult({ client_id: data.client_id, temp_password: data.temp_password, auth_email: data.auth_email });
  };

  if (result) {
    return (
      <div className="max-w-xl rounded-2xl border border-hairline bg-elevated/60 p-7">
        <div className="flex items-center gap-2 text-[color:var(--success)]">
          <Check size={18} /> <span className="font-medium">Client created</span>
        </div>
        <p className="mt-2 text-sm text-fg-muted">
          Share these credentials with <span className="text-fg">{name || "the client"}</span>. They sign in at{" "}
          <span className="font-mono text-fg">/portal</span> and should change the password on first login.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Credential label="Client ID" value={result.client_id} />
          <Credential label="Temporary password" value={result.temp_password} />
        </div>
        <div className="mt-6 flex gap-3">
          <Link href="/admin/clients" className="rounded-lg border border-hairline-strong px-4 py-2 text-sm text-fg-muted transition-colors hover:text-fg">
            View clients
          </Link>
          <button
            onClick={() => { setResult(null); setStep(0); setCompany(""); setIndustry(""); setName(""); setCrmName(""); setCrmEmail(""); setCrmPhone(""); setNotes(""); setClientId(""); setIdMode("auto"); setSelected(new Set()); }}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent"
          >
            Onboard another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      {/* Steps */}
      <ol className="mb-6 flex flex-wrap items-center gap-2 text-xs">
        {steps.map((s, i) => (
          <li key={s} className={`flex items-center gap-2 rounded-full border px-3 py-1 ${i === step ? "border-accent text-fg" : i < step ? "border-hairline text-fg-muted" : "border-hairline text-fg-subtle"}`}>
            <span className="font-mono">{i + 1}</span> {s}
          </li>
        ))}
      </ol>

      <div className="rounded-2xl border border-hairline bg-elevated/60 p-7">
        {step === 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelCls}><span className="font-medium text-fg">Company</span><input className={field} value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Vertex Retail Group" /></label>
            <label className={labelCls}><span className="font-medium text-fg">Industry</span><input className={field} value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Retail" /></label>
            <div className="sm:col-span-2">
              <span className="text-sm font-medium text-fg">Client ID</span>
              <div className="mt-1.5 inline-flex rounded-lg border border-hairline bg-elevated p-1 text-sm">
                <button type="button" onClick={() => setIdMode("auto")} className={`rounded-md px-3 py-1 ${idMode === "auto" ? "bg-base text-fg" : "text-fg-muted"}`}>Auto-generate</button>
                <button type="button" onClick={() => setIdMode("custom")} className={`rounded-md px-3 py-1 ${idMode === "custom" ? "bg-base text-fg" : "text-fg-muted"}`}>Set custom</button>
              </div>
              {idMode === "custom" ? (
                <input className={`${field} mt-2`} value={clientId} onChange={(e) => setClientId(e.target.value)} placeholder="e.g. NHG-2048 or ACME-001" />
              ) : (
                <p className="mt-2 text-xs text-fg-subtle">A unique Client ID will be generated automatically.</p>
              )}
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelCls}><span className="font-medium text-fg">Primary contact name *</span><input className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Morgan" /></label>
            <label className={labelCls}><span className="font-medium text-fg">Relationship manager</span><input className={field} value={crmName} onChange={(e) => setCrmName(e.target.value)} placeholder="Elena Whitmore" /></label>
            <label className={labelCls}><span className="font-medium text-fg">Contact email</span><input className={field} value={crmEmail} onChange={(e) => setCrmEmail(e.target.value)} placeholder="alex@vertex.com" /></label>
            <label className={labelCls}><span className="font-medium text-fg">Contact phone</span><input className={field} value={crmPhone} onChange={(e) => setCrmPhone(e.target.value)} placeholder="+44 20 7946 1180" /></label>
            <label className={`${labelCls} sm:col-span-2`}><span className="font-medium text-fg">Notes (optional)</span>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Internal notes about this client, scope, or context" className="w-full rounded-lg border border-hairline-strong bg-elevated px-3 py-2 text-sm text-fg outline-none transition-colors focus:border-accent" />
            </label>
          </div>
        )}
        {step === 2 && (
          <div>
            <p className="mb-3 text-sm text-fg-muted">Assign services from the catalog (optional — you can add more later).</p>
            {catalog.length === 0 && <p className="text-sm text-fg-subtle">No catalog services yet. Add some under Service catalog.</p>}
            <div className="grid gap-2">
              {catalog.map((c) => (
                <label key={c.id} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${selected.has(c.id) ? "border-accent bg-base" : "border-hairline hover:border-hairline-strong"}`}>
                  <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggle(c.id)} className="mt-1 accent-[color:var(--accent)]" />
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-fg">{c.name} <span className="text-fg-subtle">· {formatMoney(c.price, c.currency)}</span></div>
                    {c.description && <div className="truncate text-xs text-fg-subtle">{c.description}</div>}
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="text-sm">
            <p className="text-fg-muted">Review before creating the account.</p>
            <dl className="mt-4 grid gap-2">
              <Row k="Company" v={company || "—"} />
              <Row k="Industry" v={industry || "—"} />
              <Row k="Primary contact" v={name || "—"} />
              <Row k="Relationship manager" v={crmName || "—"} />
              <Row k="Services" v={catalog.filter((c) => selected.has(c.id)).map((c) => c.name).join(", ") || "None"} />
            </dl>
            <p className="mt-4 text-xs text-fg-subtle">A Client ID and secure temporary password will be generated automatically.</p>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-danger">{error}</p>}

        <div className="mt-7 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-hairline-strong px-3 py-2 text-sm text-fg-muted transition-colors hover:text-fg disabled:opacity-40"
          >
            <ArrowLeft size={15} /> Back
          </button>
          {step < 3 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 1 && !name.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent disabled:opacity-50"
            >
              Next <ArrowRight size={15} />
            </button>
          ) : (
            <button onClick={create} disabled={saving || !name.trim()} className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent disabled:opacity-50">
              <UserPlus size={15} /> {saving ? "Creating…" : "Create client"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-3 border-b border-hairline/60 py-1.5 last:border-0">
      <dt className="w-40 shrink-0 text-fg-subtle">{k}</dt>
      <dd className="text-fg">{v}</dd>
    </div>
  );
}

/* ------------------------------ bulk import ------------------------------ */

type ImportResult = { name: string; ok: boolean; client_id?: string; temp_password?: string; error?: string };

function BulkImport() {
  const [rows, setRows] = useState<{ name: string; company?: string; industry?: string; crm_email?: string }[]>([]);
  const [results, setResults] = useState<ImportResult[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const parseCsv = (text: string) => {
    const lines = text.trim().split(/\r?\n/).filter(Boolean);
    if (lines.length === 0) return [];
    const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const idx = (k: string) => header.indexOf(k);
    const hasHeader = header.includes("name");
    const body = hasHeader ? lines.slice(1) : lines;
    return body.map((line) => {
      const cells = line.split(",").map((c) => c.trim());
      return hasHeader
        ? { name: cells[idx("name")] || "", company: cells[idx("company")] || "", industry: cells[idx("industry")] || "", crm_email: cells[idx("email")] ?? cells[idx("crm_email")] ?? "" }
        : { name: cells[0] || "", company: cells[1] || "", industry: cells[2] || "", crm_email: cells[3] || "" };
    }).filter((r) => r.name);
  };

  const onFile = async (f: File) => {
    setError("");
    setResults(null);
    setRows(parseCsv(await f.text()));
  };

  const run = async () => {
    setBusy(true); setError("");
    const res = await adminFetch("/api/admin/clients/import", { method: "POST", body: JSON.stringify({ rows }) });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) { setError(data.error || "Import failed."); return; }
    setResults(data.results);
  };

  return (
    <div className="max-w-2xl">
      <div className="rounded-2xl border border-hairline bg-elevated/60 p-7">
        <p className="text-sm text-fg-muted">
          Upload a CSV with a header row: <code className="rounded bg-base px-1.5 py-0.5 font-mono text-xs">name, company, industry, email</code>. Each row becomes a client with generated credentials.
        </p>
        <label className="mt-4 flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-hairline-strong px-4 py-2 text-sm text-fg-muted transition-colors hover:text-fg">
          <Upload size={15} /> Choose CSV
          <input type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        </label>

        {rows.length > 0 && !results && (
          <div className="mt-5">
            <p className="text-sm text-fg">{rows.length} client{rows.length === 1 ? "" : "s"} ready to import.</p>
            <button onClick={run} disabled={busy} className="mt-3 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent disabled:opacity-50">
              {busy ? "Importing…" : `Import ${rows.length}`}
            </button>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-danger">{error}</p>}

        {results && (
          <div className="mt-5 overflow-x-auto rounded-xl border border-hairline">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead><tr className="border-b border-hairline text-xs uppercase tracking-wider text-fg-subtle">
                <th className="px-4 py-2 font-medium">Name</th><th className="px-4 py-2 font-medium">Client ID</th><th className="px-4 py-2 font-medium">Temp password</th><th className="px-4 py-2 font-medium">Status</th>
              </tr></thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i} className="border-b border-hairline/60 last:border-0">
                    <td className="px-4 py-2 text-fg">{r.name}</td>
                    <td className="px-4 py-2 font-mono text-xs text-fg-muted">{r.client_id || "—"}</td>
                    <td className="px-4 py-2 font-mono text-xs text-fg-muted">{r.temp_password || "—"}</td>
                    <td className="px-4 py-2">{r.ok ? <span className="text-[color:var(--success)]">Created</span> : <span className="text-danger" title={r.error}>Failed</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
