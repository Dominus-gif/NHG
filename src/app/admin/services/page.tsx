"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { adminFetch } from "@/lib/adminClient";
import type { ServiceCatalogItem } from "@/lib/adminData";

const field = "h-10 w-full rounded-lg border border-hairline-strong bg-elevated px-3 text-sm text-fg outline-none transition-colors focus:border-accent";

export default function ServiceCatalogPage() {
  const [items, setItems] = useState<ServiceCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const load = () =>
    adminFetch("/api/admin/services")
      .then(async (r) => { if (!r.ok) throw new Error((await r.json()).error || "Failed"); return r.json(); })
      .then((d) => setItems(d.services || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!name.trim()) return;
    const res = await adminFetch("/api/admin/services", {
      method: "POST",
      body: JSON.stringify({ name, description, active: true }),
    });
    if (res.ok) { setName(""); setDescription(""); setAdding(false); load(); }
    else setError((await res.json()).error || "Could not add.");
  };

  const toggleActive = async (it: ServiceCatalogItem) => {
    const res = await adminFetch(`/api/admin/services/${it.id}`, { method: "PATCH", body: JSON.stringify({ active: !it.active }) });
    if (res.ok) setItems((xs) => xs.map((x) => (x.id === it.id ? { ...x, active: !x.active } : x)));
  };

  const remove = async (it: ServiceCatalogItem) => {
    if (!confirm(`Remove "${it.name}" from the catalog?`)) return;
    const res = await adminFetch(`/api/admin/services/${it.id}`, { method: "DELETE" });
    if (res.ok) setItems((xs) => xs.filter((x) => x.id !== it.id));
  };

  return (
    <div className="max-w-4xl">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-fg sm:text-3xl">Service catalog</h1>
          <p className="mt-1 text-sm text-fg-muted">Everything we offer. Amounts are set per client at invoicing — no fixed pricing here.</p>
        </div>
        <button onClick={() => setAdding((v) => !v)} className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent">
          <Plus size={15} /> New service
        </button>
      </header>

      {adding && (
        <div className="mb-6 rounded-2xl border border-hairline bg-elevated/60 p-6">
          <div className="grid gap-4">
            <label className="flex flex-col gap-1.5 text-sm"><span className="font-medium text-fg">Name</span><input className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="Custom Web Application" /></label>
            <label className="flex flex-col gap-1.5 text-sm"><span className="font-medium text-fg">Description</span><input className={field} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What's included" /></label>
          </div>
          <button onClick={add} className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent">Add service</button>
        </div>
      )}

      {error && <p className="mb-4 text-sm text-danger">{error}</p>}
      {loading ? <p className="text-sm text-fg-muted">Loading…</p> : items.length === 0 ? (
        <p className="text-sm text-fg-subtle">No services yet. Add your first one.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((it) => (
            <div key={it.id} className={`rounded-2xl border p-5 ${it.active ? "border-hairline bg-elevated/60" : "border-hairline bg-elevated/30 opacity-70"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium text-fg">{it.name}</div>
                  {it.description && <div className="mt-0.5 text-xs text-fg-subtle">{it.description}</div>}
                </div>
                <button onClick={() => remove(it)} className="shrink-0 text-fg-subtle transition-colors hover:text-danger" title="Remove"><Trash2 size={15} /></button>
              </div>
              <div className="mt-4 flex items-center justify-end">
                <button onClick={() => toggleActive(it)} className="rounded-full border border-hairline px-2.5 py-1 text-xs text-fg-muted transition-colors hover:text-fg">
                  {it.active ? "Active" : "Inactive"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
