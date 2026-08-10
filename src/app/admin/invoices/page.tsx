"use client";

import { useEffect, useState } from "react";
import { Plus, ExternalLink, Copy, Trash2, RotateCcw, Link2 } from "lucide-react";
import { adminFetch } from "@/lib/adminClient";
import { formatMoney } from "@/lib/portal";
import type { AdminInvoiceRow, AdminClientRow, TransactionRow } from "@/lib/adminData";

const field = "h-10 w-full rounded-lg border border-hairline-strong bg-elevated px-3 text-sm text-fg outline-none transition-colors focus:border-accent";

const statusTone: Record<string, string> = {
  paid: "bg-[color:var(--success-soft)] text-[color:var(--success)]",
  pending: "bg-[color:var(--warning-soft)] text-[color:var(--warning)]",
  overdue: "bg-[color:var(--danger-soft)] text-[color:var(--danger)]",
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<AdminInvoiceRow[]>([]);
  const [clients, setClients] = useState<AdminClientRow[]>([]);
  const [txns, setTxns] = useState<TransactionRow[]>([]);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);

  const [clientId, setClientId] = useState("");
  const [service, setService] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [due, setDue] = useState("");
  const [payUrl, setPayUrl] = useState("");

  const load = (deleted = showDeleted) => {
    adminFetch(`/api/admin/invoices?deleted=${deleted}`).then((r) => r.json()).then((d) => setInvoices(d.invoices || [])).catch(() => {});
    adminFetch("/api/admin/transactions").then((r) => r.json()).then((d) => setTxns(d.transactions || [])).catch(() => {});
  };
  useEffect(() => {
    load(showDeleted);
    adminFetch("/api/admin/clients").then((r) => r.json()).then((d) => setClients(d.clients || [])).catch(() => {});
  }, [showDeleted]); // eslint-disable-line react-hooks/exhaustive-deps

  const create = async () => {
    if (!clientId || !(Number(amount) > 0)) { setError("Pick a client and enter an amount."); return; }
    const res = await adminFetch("/api/admin/invoices", {
      method: "POST",
      body: JSON.stringify({ client_id: clientId, service, amount: Number(amount), currency, due, pay_url: payUrl.trim() || undefined }),
    });
    if (res.ok) { setAdding(false); setClientId(""); setService(""); setAmount(""); setDue(""); setPayUrl(""); setError(""); load(); }
    else setError((await res.json()).error || "Could not create invoice.");
  };

  const markPaid = async (inv: AdminInvoiceRow) => {
    const res = await adminFetch(`/api/admin/invoices/${inv.id}`, { method: "PATCH", body: JSON.stringify({ status: "paid" }) });
    if (res.ok) load();
  };
  const del = async (inv: AdminInvoiceRow) => {
    if (!confirm(`Delete invoice ${inv.number}? It will be archived and can be restored.`)) return;
    const res = await adminFetch(`/api/admin/invoices/${inv.id}`, { method: "DELETE" });
    if (res.ok) load();
  };
  const restore = async (inv: AdminInvoiceRow) => {
    const res = await adminFetch(`/api/admin/invoices/${inv.id}`, { method: "PATCH", body: JSON.stringify({ restore: true }) });
    if (res.ok) load();
  };
  const setLinkFor = async (inv: AdminInvoiceRow) => {
    const url = window.prompt("Payment link for this invoice (the client clicks it to pay):", inv.pay_url || "");
    if (url === null) return;
    const res = await adminFetch(`/api/admin/invoices/${inv.id}`, { method: "PATCH", body: JSON.stringify({ pay_url: url }) });
    if (res.ok) load(); else setError((await res.json()).error || "Could not set link.");
  };
  const [copied, setCopied] = useState("");
  const copyLink = (inv: AdminInvoiceRow) => {
    if (!inv.pay_url) return;
    navigator.clipboard.writeText(inv.pay_url);
    setCopied(inv.id); setTimeout(() => setCopied(""), 1200);
  };

  return (
    <div className="max-w-5xl">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-fg sm:text-3xl">Invoicing</h1>
          <p className="mt-1 text-sm text-fg-muted">Generate invoices with a hosted-checkout link, track status, and review the audit trail.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowDeleted((v) => !v)} className={`rounded-lg border px-3 py-2 text-sm transition-colors ${showDeleted ? "border-accent text-fg" : "border-hairline-strong text-fg-muted hover:text-fg"}`}>
            {showDeleted ? "Active invoices" : "Deleted"}
          </button>
          {!showDeleted && (
            <button onClick={() => setAdding((v) => !v)} className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent">
              <Plus size={15} /> New invoice
            </button>
          )}
        </div>
      </header>
      {showDeleted && <p className="mb-4 rounded-lg border border-hairline bg-elevated/60 px-3 py-2 text-xs text-fg-muted">Deleted invoices are archived as a backup and can be restored.</p>}

      {adding && (
        <div className="mb-6 rounded-2xl border border-hairline bg-elevated/60 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm"><span className="font-medium text-fg">Client</span>
              <select value={clientId} onChange={(e) => setClientId(e.target.value)} style={{ colorScheme: "dark" }} className={field}>
                <option value="">Select a client…</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.company || c.name} ({c.client_id})</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-sm"><span className="font-medium text-fg">Service</span><input className={field} value={service} onChange={(e) => setService(e.target.value)} placeholder="Custom Web Application" /></label>
            <label className="flex flex-col gap-1.5 text-sm"><span className="font-medium text-fg">Amount</span><input className={field} type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="15000" /></label>
            <label className="flex flex-col gap-1.5 text-sm"><span className="font-medium text-fg">Currency</span><input className={field} value={currency} onChange={(e) => setCurrency(e.target.value)} /></label>
            <label className="flex flex-col gap-1.5 text-sm"><span className="font-medium text-fg">Due date</span><input className={field} value={due} onChange={(e) => setDue(e.target.value)} placeholder="Aug 31, 2026" /></label>
            <label className="flex flex-col gap-1.5 text-sm sm:col-span-2"><span className="font-medium text-fg">Payment link (optional)</span><input className={field} value={payUrl} onChange={(e) => setPayUrl(e.target.value)} placeholder="https://… — paste any payment link (Stripe, PayPal, Dodo, etc.)" /></label>
          </div>
          <button onClick={create} className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent">Create invoice</button>
          <p className="mt-2 text-xs text-fg-subtle">Paste a payment link and the client can pay from their portal directly. Leave it blank to add one later.</p>
        </div>
      )}

      {error && <p className="mb-4 text-sm text-danger">{error}</p>}

      {/* Invoices */}
      <div className="overflow-x-auto rounded-2xl border border-hairline">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead><tr className="border-b border-hairline text-xs uppercase tracking-wider text-fg-subtle">
            <th className="px-5 py-3 font-medium">Invoice</th><th className="px-5 py-3 font-medium">Client</th><th className="px-5 py-3 font-medium">Amount</th><th className="px-5 py-3 font-medium">Status</th><th className="px-5 py-3 font-medium">Due</th><th className="px-5 py-3 font-medium"></th>
          </tr></thead>
          <tbody>
            {invoices.map((i) => (
              <tr key={i.id} className="border-b border-hairline/60 last:border-0">
                <td className="px-5 py-3.5">
                  <div className="font-medium text-fg">{i.number}</div>
                  <div className="text-xs text-fg-subtle">{i.service || "—"}</div>
                </td>
                <td className="px-5 py-3.5 text-fg-muted">{i.client_name || "—"}</td>
                <td className="px-5 py-3.5 text-fg">{formatMoney(i.amount, i.currency)}</td>
                <td className="px-5 py-3.5"><span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusTone[i.status] || ""}`}>{i.status}</span></td>
                <td className="px-5 py-3.5 text-fg-muted">{i.due || "—"}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    {showDeleted ? (
                      <button onClick={() => restore(i)} className="inline-flex items-center gap-1 rounded-lg border border-hairline-strong px-2.5 py-1 text-xs text-fg-muted transition-colors hover:text-fg"><RotateCcw size={13} /> Restore</button>
                    ) : (
                      <>
                        {i.pay_url && i.status !== "paid" && (
                          <>
                            <a href={i.pay_url} target="_blank" rel="noopener noreferrer" className="text-fg-subtle transition-colors hover:text-accent" title="Open payment link"><ExternalLink size={14} /></a>
                            <button onClick={() => copyLink(i)} className="text-fg-subtle transition-colors hover:text-fg" title="Copy payment link">{copied === i.id ? <span className="text-[10px] text-[color:var(--success)]">Copied</span> : <Copy size={14} />}</button>
                          </>
                        )}
                        {i.status !== "paid" && <button onClick={() => setLinkFor(i)} className="text-fg-subtle transition-colors hover:text-fg" title={i.pay_url ? "Edit payment link" : "Set payment link"}><Link2 size={14} /></button>}
                        {i.status !== "paid" && <button onClick={() => markPaid(i)} className="rounded-lg border border-hairline-strong px-2.5 py-1 text-xs text-fg-muted transition-colors hover:text-fg">Mark paid</button>}
                        <button onClick={() => del(i)} className="inline-flex items-center gap-1 rounded-lg border border-hairline-strong px-2.5 py-1 text-xs text-fg-muted transition-colors hover:border-danger hover:text-danger" title="Delete (archives, restorable)"><Trash2 size={13} /> Delete</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-fg-subtle">No invoices yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Audit trail */}
      <h2 className="mb-3 mt-10 text-sm font-semibold uppercase tracking-wider text-fg-subtle">Transaction audit trail</h2>
      <div className="overflow-x-auto rounded-2xl border border-hairline">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead><tr className="border-b border-hairline text-xs uppercase tracking-wider text-fg-subtle">
            <th className="px-5 py-3 font-medium">When</th><th className="px-5 py-3 font-medium">Client</th><th className="px-5 py-3 font-medium">Kind</th><th className="px-5 py-3 font-medium">Provider</th><th className="px-5 py-3 font-medium">Amount</th><th className="px-5 py-3 font-medium">Status</th>
          </tr></thead>
          <tbody>
            {txns.map((t) => (
              <tr key={t.id} className="border-b border-hairline/60 last:border-0">
                <td className="px-5 py-3 text-fg-muted">{new Date(t.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                <td className="px-5 py-3 text-fg-muted">{t.client_name || "—"}</td>
                <td className="px-5 py-3 capitalize text-fg-muted">{t.kind.replace("_", " ")}</td>
                <td className="px-5 py-3 capitalize text-fg-subtle">{t.provider || "—"}</td>
                <td className="px-5 py-3 text-fg">{formatMoney(t.amount, t.currency)}</td>
                <td className="px-5 py-3 capitalize text-fg-muted">{t.status}</td>
              </tr>
            ))}
            {txns.length === 0 && <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-fg-subtle">No transactions yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
