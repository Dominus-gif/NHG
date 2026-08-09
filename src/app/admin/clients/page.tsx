"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, UserPlus } from "lucide-react";
import { adminFetch } from "@/lib/adminClient";
import type { AdminClientRow } from "@/lib/adminData";

function StatusBadge({ status }: { status: string }) {
  const active = status === "active";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
        active
          ? "bg-[color:var(--success-soft)] text-[color:var(--success)]"
          : "bg-[color:var(--danger-soft)] text-[color:var(--danger)]"
      }`}
    >
      {status}
    </span>
  );
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<AdminClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "suspended">("all");
  const [industry, setIndustry] = useState("all");

  useEffect(() => {
    adminFetch("/api/admin/clients")
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error || "Failed to load");
        return res.json();
      })
      .then((d) => setClients(d.clients))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const industries = useMemo(
    () => [...new Set(clients.map((c) => c.industry).filter(Boolean))] as string[],
    [clients],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return clients.filter((c) => {
      if (status !== "all" && c.status !== status) return false;
      if (industry !== "all" && c.industry !== industry) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        (c.company || "").toLowerCase().includes(q) ||
        c.client_id.toLowerCase().includes(q)
      );
    });
  }, [clients, query, status, industry]);

  const selectClass =
    "h-9 rounded-lg border border-hairline-strong bg-elevated px-3 text-sm text-fg outline-none transition-colors focus:border-accent";

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-fg sm:text-3xl">Clients</h1>
          <p className="mt-1 text-sm text-fg-muted">
            {loading ? "Loading…" : `${filtered.length} of ${clients.length} clients`}
          </p>
        </div>
        <Link href="/admin/onboarding" className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent">
          <UserPlus size={15} /> New client
        </Link>
      </header>

      {/* Filters */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, company, or Client ID"
            className="h-9 w-full rounded-lg border border-hairline-strong bg-elevated pl-9 pr-3 text-sm text-fg outline-none transition-colors focus:border-accent"
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} style={{ colorScheme: "dark" }} className={selectClass}>
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
        <select value={industry} onChange={(e) => setIndustry(e.target.value)} style={{ colorScheme: "dark" }} className={selectClass}>
          <option value="all">All industries</option>
          {industries.map((ind) => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      {/* Table */}
      {!error && (
        <div className="overflow-x-auto rounded-2xl border border-hairline">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-hairline text-xs uppercase tracking-wider text-fg-subtle">
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Company</th>
                <th className="px-5 py-3 font-medium">Industry</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => router.push(`/admin/clients/${c.id}`)}
                  className="cursor-pointer border-b border-hairline/60 last:border-0 transition-colors hover:bg-elevated/40"
                >
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-fg">{c.name}</div>
                    <div className="font-mono text-[11px] text-fg-subtle">{c.client_id}</div>
                  </td>
                  <td className="px-5 py-3.5 text-fg-muted">{c.company || "—"}</td>
                  <td className="px-5 py-3.5 text-fg-muted">{c.industry || "—"}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={c.status} /></td>
                  <td className="px-5 py-3.5 text-fg-muted">{fmtDate(c.created_at)}</td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-fg-subtle">
                    No clients match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
