"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, UserPlus, ChevronLeft, ChevronRight } from "lucide-react";
import { adminFetch } from "@/lib/adminClient";
import type { AdminClientRow } from "@/lib/adminData";

const PER = 25;

function StatusBadge({ status }: { status: string }) {
  const active = status === "active";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${active ? "bg-[color:var(--success-soft)] text-[color:var(--success)]" : "bg-[color:var(--danger-soft)] text-[color:var(--danger)]"}`}>
      {status}
    </span>
  );
}
const fmtDate = (iso: string) => { const d = new Date(iso); return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); };

export default function AdminClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<AdminClientRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"" | "active" | "suspended">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchPage = useCallback((p: number, q: string, s: string) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), per: String(PER) });
    if (q) params.set("q", q);
    if (s) params.set("status", s);
    adminFetch(`/api/admin/clients?${params.toString()}`)
      .then(async (r) => { if (!r.ok) throw new Error((await r.json()).error || "Failed"); return r.json(); })
      .then((d) => { setClients(d.clients || []); setTotal(d.total ?? (d.clients?.length || 0)); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchPage(page, query, status); }, [page, status, fetchPage]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced search resets to page 1.
  const onSearch = (v: string) => {
    setQuery(v);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => { setPage(1); fetchPage(1, v, status); }, 300);
  };

  const pages = Math.max(1, Math.ceil(total / PER));
  const selectClass = "h-9 rounded-lg border border-hairline-strong bg-elevated px-3 text-sm text-fg outline-none focus:border-accent";

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-fg sm:text-3xl">Clients</h1>
          <p className="mt-1 text-sm text-fg-muted">{loading ? "Loading…" : `${total} client${total === 1 ? "" : "s"}`}</p>
        </div>
        <Link href="/admin/onboarding" className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent"><UserPlus size={15} /> New client</Link>
      </header>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle" />
          <input value={query} onChange={(e) => onSearch(e.target.value)} placeholder="Search name, company, Client ID, or industry" className="h-9 w-full rounded-lg border border-hairline-strong bg-elevated pl-9 pr-3 text-sm text-fg outline-none focus:border-accent" />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value as typeof status); setPage(1); }} style={{ colorScheme: "dark" }} className={selectClass}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      {!error && (
        <>
          <div className="overflow-x-auto rounded-2xl border border-hairline">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead><tr className="border-b border-hairline text-xs uppercase tracking-wider text-fg-subtle">
                <th className="px-5 py-3 font-medium">Client</th><th className="px-5 py-3 font-medium">Company</th><th className="px-5 py-3 font-medium">Industry</th><th className="px-5 py-3 font-medium">Status</th><th className="px-5 py-3 font-medium">Created</th>
              </tr></thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id} onClick={() => router.push(`/admin/clients/${c.id}`)} className="cursor-pointer border-b border-hairline/60 last:border-0 transition-colors hover:bg-elevated/40">
                    <td className="px-5 py-3.5"><div className="font-medium text-fg">{c.name}</div><div className="font-mono text-[11px] text-fg-subtle">{c.client_id}</div></td>
                    <td className="px-5 py-3.5 text-fg-muted">{c.company || "—"}</td>
                    <td className="px-5 py-3.5 text-fg-muted">{c.industry || "—"}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={c.status} /></td>
                    <td className="px-5 py-3.5 text-fg-muted">{fmtDate(c.created_at)}</td>
                  </tr>
                ))}
                {!loading && clients.length === 0 && <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-fg-subtle">No clients match your search.</td></tr>}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between text-sm text-fg-muted">
            <span>Page {page} of {pages}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="inline-flex items-center gap-1 rounded-lg border border-hairline-strong px-3 py-1.5 transition-colors hover:text-fg disabled:opacity-40"><ChevronLeft size={15} /> Prev</button>
              <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page >= pages} className="inline-flex items-center gap-1 rounded-lg border border-hairline-strong px-3 py-1.5 transition-colors hover:text-fg disabled:opacity-40">Next <ChevronRight size={15} /></button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
