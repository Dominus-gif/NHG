import { NextResponse } from "next/server";
import { getAdminClient, isAdminConfigured } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/adminAuth";
import { DEMO_NOTIFICATIONS } from "@/lib/adminData";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAdminConfigured) return NextResponse.json({ demo: true, notifications: DEMO_NOTIFICATIONS });
  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const svc = getAdminClient()!;
  const { data, error } = await svc
    .from("notifications")
    .select("id, created_at, type, title, body, read")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ demo: false, notifications: data ?? [] });
}

// Mark one as read (body: { id }) or all (body: { all: true }).
export async function PATCH(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { id?: string; all?: boolean };
  if (!isAdminConfigured) return NextResponse.json({ demo: true, ok: true });
  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const svc = getAdminClient()!;
  const q = svc.from("notifications").update({ read: true });
  const { error } = body.all ? await q.eq("read", false) : await q.eq("id", body.id ?? "");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ demo: false, ok: true });
}
