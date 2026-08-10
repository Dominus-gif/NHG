"use client";

import { useEffect, useState } from "react";
import { Upload, Download, Trash2, Eye, EyeOff } from "lucide-react";
import { adminFetch } from "@/lib/adminClient";
import type { AdminClientRow, AdminDocRow } from "@/lib/adminData";

const field = "h-10 w-full rounded-lg border border-hairline-strong bg-elevated px-3 text-sm text-fg outline-none transition-colors focus:border-accent";

export default function DocumentsPage() {
  const [docs, setDocs] = useState<AdminDocRow[]>([]);
  const [clients, setClients] = useState<AdminClientRow[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [clientId, setClientId] = useState("");
  const [title, setTitle] = useState("");
  const [service, setService] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);

  const load = () => adminFetch("/api/admin/documents").then((r) => r.json()).then((d) => setDocs(d.documents || [])).catch(() => {});
  useEffect(() => {
    load();
    adminFetch("/api/admin/clients").then((r) => r.json()).then((d) => setClients(d.clients || [])).catch(() => {});
  }, []);

  const upload = async () => {
    if (!clientId || !file) { setError("Pick a client and a file."); return; }
    setBusy(true); setError("");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("client_id", clientId);
    if (title) fd.append("title", title);
    if (service) fd.append("service", service);
    const res = await adminFetch("/api/admin/documents", { method: "POST", body: fd });
    setBusy(false);
    if (res.ok) { setFile(null); setTitle(""); setService(""); load(); }
    else setError((await res.json()).error || "Upload failed.");
  };

  const download = async (d: AdminDocRow) => {
    const res = await adminFetch(`/api/admin/documents/${d.id}`);
    const data = await res.json();
    if (res.ok && data.url && data.url !== "#") window.open(data.url, "_blank");
    else setError(data.error || "No file to download.");
  };

  const toggleRelease = async (d: AdminDocRow) => {
    const res = await adminFetch(`/api/admin/documents/${d.id}`, { method: "PATCH", body: JSON.stringify({ released: !d.released }) });
    if (res.ok) setDocs((xs) => xs.map((x) => (x.id === d.id ? { ...x, released: !x.released } : x)));
  };

  const remove = async (d: AdminDocRow) => {
    if (!confirm(`Delete "${d.title}" v${d.version}?`)) return;
    const res = await adminFetch(`/api/admin/documents/${d.id}`, { method: "DELETE" });
    if (res.ok) setDocs((xs) => xs.filter((x) => x.id !== d.id));
  };

  return (
    <div className="max-w-4xl">
      <header className="mb-8">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-fg sm:text-3xl">Technical documents</h1>
        <p className="mt-1 text-sm text-fg-muted">Upload versioned docs per client. Release to make them visible in the client portal.</p>
      </header>

      {/* Upload */}
      <div className="mb-6 rounded-2xl border border-hairline bg-elevated/60 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm"><span className="font-medium text-fg">Client</span>
            <select value={clientId} onChange={(e) => setClientId(e.target.value)} style={{ colorScheme: "dark" }} className={field}>
              <option value="">Select a client…</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.company || c.name} ({c.client_id})</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm"><span className="font-medium text-fg">Title (optional)</span><input className={field} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Defaults to the file name" /></label>
          <label className="flex flex-col gap-1.5 text-sm"><span className="font-medium text-fg">Service (optional)</span><input className={field} value={service} onChange={(e) => setService(e.target.value)} placeholder="Custom Web Application" /></label>
        </div>

        {/* Drag & drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]); }}
          className={`mt-4 flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors ${dragging ? "border-accent bg-base" : "border-hairline"}`}
        >
          <Upload size={20} className="text-fg-subtle" />
          {file ? (
            <p className="mt-2 text-sm text-fg">{file.name} <button onClick={() => setFile(null)} className="ml-2 text-xs text-fg-subtle hover:text-danger">remove</button></p>
          ) : (
            <p className="mt-2 text-sm text-fg-muted">Drag a file here, or{" "}
              <label className="cursor-pointer text-accent hover:underline">browse<input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} /></label>
            </p>
          )}
        </div>
        <button onClick={upload} disabled={busy} className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent disabled:opacity-50">
          <Upload size={15} /> {busy ? "Uploading…" : "Upload"}
        </button>
        {error && <p className="mt-3 text-sm text-danger">{error}</p>}
        <p className="mt-2 text-xs text-fg-subtle">Uploading the same title again creates a new version automatically.</p>
      </div>

      {/* List */}
      <div className="overflow-x-auto rounded-2xl border border-hairline">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead><tr className="border-b border-hairline text-xs uppercase tracking-wider text-fg-subtle">
            <th className="px-5 py-3 font-medium">Document</th><th className="px-5 py-3 font-medium">Client</th><th className="px-5 py-3 font-medium">Version</th><th className="px-5 py-3 font-medium">Visibility</th><th className="px-5 py-3 font-medium"></th>
          </tr></thead>
          <tbody>
            {docs.map((d) => (
              <tr key={d.id} className="border-b border-hairline/60 last:border-0">
                <td className="px-5 py-3.5">
                  <div className="font-medium text-fg">{d.title}</div>
                  <div className="text-xs text-fg-subtle">{d.kind}{d.service ? ` · ${d.service}` : ""}</div>
                </td>
                <td className="px-5 py-3.5 text-fg-muted">{d.client_name || "—"}</td>
                <td className="px-5 py-3.5 font-mono text-xs text-fg-muted">v{d.version}</td>
                <td className="px-5 py-3.5">
                  <button onClick={() => toggleRelease(d)} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${d.released ? "bg-[color:var(--success-soft)] text-[color:var(--success)]" : "bg-surface-subtle text-fg-muted"}`}>
                    {d.released ? <Eye size={12} /> : <EyeOff size={12} />} {d.released ? "Released" : "Internal"}
                  </button>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-3 text-fg-subtle">
                    <button onClick={() => download(d)} className="transition-colors hover:text-fg" title="Download"><Download size={15} /></button>
                    <button onClick={() => remove(d)} className="transition-colors hover:text-danger" title="Delete"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {docs.length === 0 && <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-fg-subtle">No documents yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
