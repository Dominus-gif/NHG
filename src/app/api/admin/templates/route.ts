import { NextResponse } from "next/server";
import { getAdminClient, isAdminConfigured } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/adminAuth";
import { logAudit } from "@/lib/adminServer";
import { DEMO_TEMPLATES } from "@/lib/adminData";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAdminConfigured) return NextResponse.json({ demo: true, templates: DEMO_TEMPLATES });
  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const svc = getAdminClient()!;
  const { data, error } = await svc.from("email_templates").select("key, subject, body, updated_at").order("key");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ demo: false, templates: data ?? [] });
}

// Update a template's subject/body (body: { key, subject, body }).
export async function PUT(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { key?: string; subject?: string; body?: string };
  if (!body.key) return NextResponse.json({ error: "Template key is required." }, { status: 400 });
  if (!isAdminConfigured) return NextResponse.json({ demo: true, ok: true });

  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const svc = getAdminClient()!;
  const { error } = await svc
    .from("email_templates")
    .update({ subject: body.subject ?? "", body: body.body ?? "", updated_at: new Date().toISOString() })
    .eq("key", body.key);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await logAudit(svc, gate.admin.id, "template.updated", "template", body.key, `Edited ${body.key} template`);
  return NextResponse.json({ demo: false, ok: true });
}
