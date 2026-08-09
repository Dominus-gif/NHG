import { NextResponse } from "next/server";
import { getAdminClient, isAdminConfigured } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/adminAuth";
import { logAudit } from "@/lib/adminServer";

export const dynamic = "force-dynamic";
type Ctx = { params: Promise<{ id: string }> };

// Signed download/preview URL (valid ~1 hour).
export async function GET(req: Request, { params }: Ctx) {
  const { id } = await params;
  if (!isAdminConfigured) return NextResponse.json({ demo: true, url: "#" });
  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const svc = getAdminClient()!;

  const { data: doc } = await svc.from("portal_documents").select("storage_path").eq("id", id).maybeSingle();
  if (!doc?.storage_path) return NextResponse.json({ error: "No file attached." }, { status: 404 });
  const { data, error } = await svc.storage.from("documents").createSignedUrl(doc.storage_path, 3600);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ demo: false, url: data.signedUrl });
}

// Toggle release (visibility to the client).
export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as { released?: boolean };
  if (!isAdminConfigured) return NextResponse.json({ demo: true, ok: true });
  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const svc = getAdminClient()!;
  const { error } = await svc.from("portal_documents").update({ released: Boolean(body.released) }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await logAudit(svc, gate.admin.id, "document.released", "document", id, body.released ? "Released to client" : "Unreleased");
  return NextResponse.json({ demo: false, ok: true });
}

export async function DELETE(req: Request, { params }: Ctx) {
  const { id } = await params;
  if (!isAdminConfigured) return NextResponse.json({ demo: true, ok: true });
  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const svc = getAdminClient()!;
  const { data: doc } = await svc.from("portal_documents").select("storage_path").eq("id", id).maybeSingle();
  if (doc?.storage_path) await svc.storage.from("documents").remove([doc.storage_path]).catch(() => {});
  const { error } = await svc.from("portal_documents").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ demo: false, ok: true });
}
