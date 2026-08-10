import { NextResponse } from "next/server";
import { getAdminClient, isAdminConfigured } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/adminAuth";
import { DEMO_ADMIN_TASKS } from "@/lib/adminData";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAdminConfigured) return NextResponse.json({ demo: true, tasks: DEMO_ADMIN_TASKS });
  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const svc = getAdminClient()!;
  const { data, error } = await svc
    .from("admin_tasks")
    .select("id, created_at, title, notes, category, status, priority, due_date, client_id")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ demo: false, tasks: data ?? [] });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  if (!String(body.title || "").trim()) return NextResponse.json({ error: "Title is required." }, { status: 400 });
  if (!isAdminConfigured) return NextResponse.json({ demo: true, ok: true });
  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const svc = getAdminClient()!;
  const { data, error } = await svc
    .from("admin_tasks")
    .insert({
      title: String(body.title).trim(),
      notes: body.notes ? String(body.notes) : null,
      category: String(body.category || "task"),
      status: String(body.status || "todo"),
      priority: String(body.priority || "medium"),
      due_date: body.due_date ? String(body.due_date) : null,
      client_id: body.client_id ? String(body.client_id) : null,
    })
    .select("id")
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ demo: false, ok: true, id: data?.id });
}
