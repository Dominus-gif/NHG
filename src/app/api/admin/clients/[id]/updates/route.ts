import { NextResponse } from "next/server";
import { getAdminClient, isAdminConfigured } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/adminAuth";
import { logAudit } from "@/lib/adminServer";

export const dynamic = "force-dynamic";
type Ctx = { params: Promise<{ id: string }> };

const DEMO = [
  { id: "u1", created_at: "2026-08-06T10:00:00Z", body: "Checkout rebuild deployed to staging — please review.", service_id: null },
  { id: "u2", created_at: "2026-08-01T09:00:00Z", body: "Kicked off the infrastructure workstream.", service_id: null },
];

export async function GET(req: Request, { params }: Ctx) {
  const { id } = await params;
  if (!isAdminConfigured) return NextResponse.json({ demo: true, updates: DEMO });
  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const svc = getAdminClient()!;
  const { data, error } = await svc
    .from("service_updates")
    .select("id, created_at, body, service_id")
    .eq("client_id", id)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ demo: false, updates: data ?? [] });
}

export async function POST(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as { body?: string; service_id?: string };
  if (!body.body?.trim()) return NextResponse.json({ error: "Write an update first." }, { status: 400 });
  if (!isAdminConfigured) return NextResponse.json({ demo: true, ok: true });
  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const svc = getAdminClient()!;
  const { data, error } = await svc
    .from("service_updates")
    .insert({ client_id: id, service_id: body.service_id || null, body: body.body.trim() })
    .select("id, created_at, body, service_id")
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await logAudit(svc, gate.admin.id, "service.update_posted", "client", id, "Posted a client update");
  return NextResponse.json({ demo: false, ok: true, update: data });
}
