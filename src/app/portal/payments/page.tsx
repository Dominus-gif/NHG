"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import { DEMO_INVOICES, formatMoney, formatDate, MONTH_LABELS, type Invoice } from "@/lib/portal";

type Tone = "green" | "amber" | "red" | "muted";
function toneFor(status: string): Tone {
  const s = status.toLowerCase();
  if (["paid"].includes(s)) return "green";
  if (["pending"].includes(s)) return "amber";
  if (["overdue"].includes(s)) return "red";
  return "muted";
}
const toneStyles: Record<Tone, string> = {
  green: "bg-[color:var(--success-soft)] text-[color:var(--success)]",
  amber: "bg-[color:var(--warning-soft)] text-[color:var(--warning)]",
  red: "bg-[color:var(--danger-soft)] text-[color:var(--danger)]",
  muted: "bg-surface-subtle text-fg-muted",
};
function Badge({ status }: { status: string }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${toneStyles[toneFor(status)]}`}>{status}</span>;
}

export default function PortalPayments() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selYear, setSelYear] = useState<number | null>(null);

  const loadDemo = useCallback(() => {
    setInvoices(DEMO_INVOICES);
    setLoading(false);
  }, []);

  useEffect(() => {
    const forceDemo = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("demo") === "1";
    const sb = getSupabaseBrowser();
    if (!sb || forceDemo) {
      loadDemo();
      return;
    }
    (async () => {
      const { data: { session } } = await sb.auth.getSession();
      if (!session) {
        router.replace("/portal");
        return;
      }
      const { data } = await sb.from("portal_invoices").select("*").eq("client_id", session.user.id);
      setInvoices((data as Invoice[]) ?? []);
      setLoading(false);
    })();
  }, [loadDemo, router]);

  const currency = invoices[0]?.currency ?? "USD";
  const paid = useMemo(() => invoices.filter((i) => i.status === "paid" && i.paid_on), [invoices]);
  const totalPaid = paid.reduce((s, i) => s + i.amount, 0);
  const outstanding = invoices.filter((i) => i.status !== "paid").reduce((s, i) => s + i.amount, 0);

  const byYear = useMemo(() => {
    const m: Record<number, number> = {};
    paid.forEach((i) => {
      const y = new Date(i.paid_on as string).getUTCFullYear();
      m[y] = (m[y] || 0) + i.amount;
    });
    return m;
  }, [paid]);
  const years = Object.keys(byYear).map(Number).sort((a, b) => a - b);
  const maxYear = Math.max(1, ...Object.values(byYear));
  const activeYear = selYear ?? years[years.length - 1] ?? new Date().getUTCFullYear();

  const byMonth = useMemo(() => {
    const arr = new Array(12).fill(0);
    paid.forEach((i) => {
      const d = new Date(i.paid_on as string);
      if (d.getUTCFullYear() === activeYear) arr[d.getUTCMonth()] += i.amount;
    });
    return arr as number[];
  }, [paid, activeYear]);
  const maxMonth = Math.max(1, ...byMonth);

  const sorted = useMemo(
    () => [...invoices].sort((a, b) => (b.paid_on ?? b.issued ?? "").localeCompare(a.paid_on ?? a.issued ?? "")),
    [invoices],
  );

  if (loading) {
    return <div className="flex min-h-[70vh] items-center justify-center text-sm text-fg-muted">Loading payments…</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-28 lg:px-12">
      <Link href="/portal/dashboard" className="text-sm text-fg-muted transition hover:text-accent">← Back to dashboard</Link>
      <div className="mt-4 border-b border-hairline pb-8">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Payments</span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Billing & payment history</h1>
        <p className="mt-1 text-sm text-fg-muted">Every invoice, when it was paid, and how your spend breaks down over time.</p>
      </div>

      {/* Summary tiles */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total paid", value: formatMoney(totalPaid, currency), sub: `${paid.length} invoices` },
          { label: "Outstanding", value: formatMoney(outstanding, currency), sub: `${invoices.filter((i) => i.status !== "paid").length} unpaid` },
          { label: "Lifetime billed", value: formatMoney(totalPaid + outstanding, currency), sub: `${invoices.length} total` },
        ].map((t) => (
          <div key={t.label} className="rounded-2xl border border-hairline bg-elevated/60 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">{t.label}</p>
            <p className="mt-2 font-heading text-3xl font-semibold tracking-tight text-fg">{t.value}</p>
            <p className="mt-1 text-xs text-fg-subtle">{t.sub}</p>
          </div>
        ))}
      </div>

      {/* Analysis */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-hairline bg-elevated/60 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-fg-subtle">Paid by year</h2>
          <div className="mt-5 flex flex-col gap-4">
            {years.map((y) => (
              <div key={y}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-mono text-fg">{y}</span>
                  <span className="text-fg-muted">{formatMoney(byYear[y], currency)}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-subtle">
                  <div className="h-full rounded-full bg-white transition-all duration-500" style={{ width: `${(byYear[y] / maxYear) * 100}%` }} />
                </div>
              </div>
            ))}
            {years.length === 0 && <p className="text-sm text-fg-muted">No payments recorded yet.</p>}
          </div>
        </section>

        <section className="rounded-2xl border border-hairline bg-elevated/60 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-fg-subtle">Monthly breakdown</h2>
            <div className="flex gap-1">
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => setSelYear(y)}
                  className={`rounded-full px-2.5 py-1 font-mono text-xs transition ${y === activeYear ? "bg-white text-[#0E0E0E]" : "text-fg-muted hover:text-fg"}`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6 flex h-40 items-end gap-1.5">
            {byMonth.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t bg-white/85 transition-all duration-500"
                    style={{ height: `${v > 0 ? Math.max((v / maxMonth) * 100, 4) : 0}%` }}
                    title={v > 0 ? formatMoney(v, currency) : ""}
                  />
                </div>
                <span className="text-[10px] text-fg-subtle">{MONTH_LABELS[i][0]}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Full ledger */}
      <section className="mt-6 rounded-2xl border border-hairline bg-elevated/60 p-6">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-fg-subtle">All invoices</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-hairline text-xs uppercase tracking-wider text-fg-subtle">
                <th className="pb-3 pr-4 font-medium">Invoice</th>
                <th className="pb-3 pr-4 font-medium">Service</th>
                <th className="pb-3 pr-4 font-medium">Issued</th>
                <th className="pb-3 pr-4 font-medium">Paid on</th>
                <th className="pb-3 pr-4 font-medium">Amount</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {sorted.map((inv) => (
                <tr key={inv.id}>
                  <td className="py-3 pr-4 font-mono text-fg">{inv.number}</td>
                  <td className="py-3 pr-4 text-fg-muted">{inv.service ?? "—"}</td>
                  <td className="py-3 pr-4 text-fg-muted">{inv.issued}</td>
                  <td className="py-3 pr-4 text-fg-muted">{inv.status === "paid" ? formatDate(inv.paid_on) : "—"}</td>
                  <td className="py-3 pr-4 font-mono text-fg">{formatMoney(inv.amount, inv.currency)}</td>
                  <td className="py-3 pr-4"><Badge status={inv.status} /></td>
                  <td className="py-3">
                    {inv.status !== "paid" && (
                      <a href={inv.pay_url || "#"} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0E0E0E] transition hover:bg-[#ECECEC]">
                        Pay now
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
