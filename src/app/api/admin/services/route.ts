import { NextResponse } from "next/server";
import { getAdminClient, isAdminConfigured } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/adminAuth";
import { logAudit } from "@/lib/adminServer";
import { DEMO_CATALOG } from "@/lib/adminData";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAdminConfigured) return NextResponse.json({ demo: true, services: DEMO_CATALOG });
  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const svc = getAdminClient()!;
  const { data, error } = await svc
    .from("service_catalog")
    .select("id, name, description, price, currency, billing_cycle, active")
    .order("created_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ demo: false, services: data ?? [] });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  if (!String(body.name || "").trim()) return NextResponse.json({ error: "Name is required." }, { status: 400 });
  if (!isAdminConfigured) return NextResponse.json({ demo: true, ok: true });

  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const svc = getAdminClient()!;
  const { data, error } = await svc
    .from("service_catalog")
    .insert({
      name: String(body.name).trim(),
      description: body.description ? String(body.description) : null,
      price: Number(body.price) || 0,
      currency: String(body.currency || "USD"),
      billing_cycle: String(body.billing_cycle || "one_time"),
      active: body.active !== false,
    })
    .select("id")
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await logAudit(svc, gate.admin.id, "service.created", "service", data?.id ?? null, `Added service ${String(body.name).trim()}`);
  return NextResponse.json({ demo: false, ok: true, id: data?.id });
}
