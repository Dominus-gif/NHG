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

  // A given service can only be assigned to a client once.
  const { data: dupe } = await svc
    .from("portal_services")
    .select("id")
    .eq("client_id", id)
    .eq("name", body.name.trim())
    .maybeSingle();
  if (dupe) return NextResponse.json({ error: "That service is already assigned to this client." }, { status: 409 });

  const { data, error } = await svc
    .from("portal_services")
    .insert({ client_id: id, name: body.name.trim(), description: body.description ?? null, status: body.status || "Active" })
    .select("id, name, description, status, progress")
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await logAudit(svc, gate.admin.id, "service.assigned", "client", id, `Assigned service ${body.name.trim()}`);
  return NextResponse.json({ demo: false, ok: true, service: data });
}

// Update an assigned service's progress/status (body: { service_id, progress, status }).
export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as { service_id?: string; progress?: number; status?: string };
  if (!body.service_id) return NextResponse.json({ error: "service_id is required." }, { status: 400 });
  if (!isAdminConfigured) return NextResponse.json({ demo: true, ok: true });

  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const svc = getAdminClient()!;
  const patch: Record<string, unknown> = {};
  if (typeof body.progress === "number") patch.progress = Math.max(0, Math.min(100, Math.round(body.progress)));
  if (body.status) patch.status = body.status;
  if (Object.keys(patch).length === 0) return NextResponse.json({ error: "Nothing to update." }, { status: 400 });

  const { error } = await svc.from("portal_services").update(patch).eq("id", body.service_id).eq("client_id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ demo: false, ok: true });
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
