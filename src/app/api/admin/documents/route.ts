import { NextResponse } from "next/server";
import { getAdminClient, isAdminConfigured } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/adminAuth";
import { logAudit } from "@/lib/adminServer";
import { DEMO_DOCS, type AdminDocRow } from "@/lib/adminData";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAdminConfigured) return NextResponse.json({ demo: true, documents: DEMO_DOCS });
  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const svc = getAdminClient()!;
  const { data, error } = await svc
    .from("portal_documents")
    .select("id, client_id, title, kind, service, version, released, created_at, portal_clients(name, company)")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const documents: AdminDocRow[] = (data ?? []).map((r) => {
    const rc = r as unknown as { portal_clients?: { name?: string; company?: string } | null } & Record<string, unknown>;
    return {
      id: r.id,
      client_id: r.client_id,
      client_name: rc.portal_clients?.company || rc.portal_clients?.name || null,
      title: r.title,
      kind: r.kind || "File",
      service: r.service,
      version: Number(r.version) || 1,
      released: Boolean(r.released),
      created_at: r.created_at,
    };
  });
  return NextResponse.json({ demo: false, documents });
}

// Upload a document (multipart: file, client_id, title?, service?). A new upload
// under an existing title auto-increments the version.
export async function POST(req: Request) {
  if (!isAdminConfigured) return NextResponse.json({ demo: true, ok: true });
  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const svc = getAdminClient()!;

  const form = await req.formData();
  const file = form.get("file");
  const clientId = String(form.get("client_id") || "");
  if (!(file instanceof File)) return NextResponse.json({ error: "A file is required." }, { status: 400 });
  if (!clientId) return NextResponse.json({ error: "A client is required." }, { status: 400 });

  const filename = file.name || "document";
  const title = String(form.get("title") || filename.replace(/\.[^.]+$/, ""));
  const service = form.get("service") ? String(form.get("service")) : null;
  const ext = (filename.split(".").pop() || "file").toUpperCase();

  // Next version for this client + title.
  const { data: existing } = await svc
    .from("portal_documents")
    .select("version")
    .eq("client_id", clientId)
    .eq("title", title)
    .order("version", { ascending: false })
    .limit(1);
  const version = (existing?.[0]?.version ?? 0) + 1;

  const path = `${clientId}/${title.replace(/[^a-z0-9._-]/gi, "_")}/v${version}-${filename}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: upErr } = await svc.storage.from("documents").upload(path, buffer, {
    contentType: file.type || "application/octet-stream",
    upsert: true,
  });
  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

  const { error: insErr } = await svc.from("portal_documents").insert({
    client_id: clientId,
    title,
    kind: ext,
    service,
    version,
    storage_path: path,
    released: false,
  });
  if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 });

  await logAudit(svc, gate.admin.id, "document.uploaded", "document", clientId, `Uploaded ${title} v${version}`);
  return NextResponse.json({ demo: false, ok: true, version });
}
