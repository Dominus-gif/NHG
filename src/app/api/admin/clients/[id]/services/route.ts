import { NextResponse } from "next/server";
import { getAdminClient, isAdminConfigured } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/adminAuth";
import { logAudit } from "@/lib/adminServer";

export const dynamic = "force-dynamic";
type Ctx = { params: Promise<{ id: string }> };

// Assign a service to this client (copied into their portal_services).
export async function POST(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as { name?: string; description?: string; status?: string };
  if (!body.name?.trim()) return NextResponse.json({ error: "Service name is required." }, { status: 400 });
  if (!isAdminConfigured) return NextResponse.json({ demo: true, ok: true });

  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const svc = getAdminClient()!;
  const { data, error } = await svc
    .from("portal_services")
    .insert({ client_id: id, name: body.name.trim(), description: body.description ?? null, status: body.status || "Active" })
    .select("id, name, description, status")
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await logAudit(svc, gate.admin.id, "service.assigned", "client", id, `Assigned service ${body.name.trim()}`);
  return NextResponse.json({ demo: false, ok: true, service: data });
}

// Remove a service assignment (?service_id=...).
export async function DELETE(req: Request, { params }: Ctx) {
  const { id } = await params;
  const serviceId = new URL(req.url).searchParams.get("service_id");
  if (!serviceId) return NextResponse.json({ error: "service_id is required." }, { status: 400 });
  if (!isAdminConfigured) return NextResponse.json({ demo: true, ok: true });

  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const svc = getAdminClient()!;
  const { error } = await svc.from("portal_services").delete().eq("id", serviceId).eq("client_id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await logAudit(svc, gate.admin.id, "service.unassigned", "client", id, "Removed a service");
  return NextResponse.json({ demo: false, ok: true });
}
