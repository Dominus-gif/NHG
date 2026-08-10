import { NextResponse } from "next/server";
import { getAdminClient, isAdminConfigured } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/adminAuth";
import { logAudit } from "@/lib/adminServer";
import { DEMO_CLIENTS, DEMO_INVOICES } from "@/lib/adminData";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

// ---- Client detail (profile + services + invoices) -------------------------
export async function GET(req: Request, { params }: Ctx) {
  const { id } = await params;

  if (!isAdminConfigured) {
    const client = DEMO_CLIENTS.find((c) => c.id === id) ?? DEMO_CLIENTS[0];
    return NextResponse.json({
      demo: true,
      client,
      services: [
        { id: "ds1", name: "Custom Web Application", description: "Commerce platform + admin console", status: "In progress" },
        { id: "ds2", name: "Cloud & Infrastructure", description: "AWS + CI/CD", status: "Active" },
      ],
      invoices: DEMO_INVOICES.filter((i) => i.client_id === client.id),
    });
  }

  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const svc = getAdminClient()!;

  const [{ data: client, error: cErr }, { data: services }, { data: invoices }] = await Promise.all([
    svc.from("portal_clients").select("id, client_id, name, company, industry, status, created_at, crm_name, crm_email, crm_phone, crm_telegram, notes").eq("id", id).maybeSingle(),
    svc.from("portal_services").select("id, name, description, status").eq("client_id", id),
    svc.from("portal_invoices").select("id, number, service, amount, currency, status, issued, due, paid_on, pay_url").eq("client_id", id).is("deleted_at", null).order("issued", { ascending: false }),
  ]);
  if (cErr) return NextResponse.json({ error: cErr.message }, { status: 500 });
  if (!client) return NextResponse.json({ error: "Client not found." }, { status: 404 });

  return NextResponse.json({ demo: false, client, services: services ?? [], invoices: invoices ?? [] });
}

// ---- Update / activate / suspend ------------------------------------------
export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  if (!isAdminConfigured) return NextResponse.json({ demo: true, ok: true });

  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const svc = getAdminClient()!;

  const allowed = ["name", "company", "industry", "status", "crm_name", "crm_email", "crm_phone", "crm_telegram", "notes"] as const;
  const patch: Record<string, unknown> = {};
  for (const k of allowed) if (k in body) patch[k] = body[k];
  if (Object.keys(patch).length === 0) return NextResponse.json({ error: "Nothing to update." }, { status: 400 });

  const { error } = await svc.from("portal_clients").update(patch).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (patch.status) {
    await logAudit(svc, gate.admin.id, `client.${patch.status === "suspended" ? "suspended" : "activated"}`, "client", id, `Account ${patch.status}`);
  } else {
    await logAudit(svc, gate.admin.id, "client.updated", "client", id, "Client details updated");
  }
  return NextResponse.json({ demo: false, ok: true });
}

// ---- Delete (removes the auth user + cascading rows) -----------------------
export async function DELETE(req: Request, { params }: Ctx) {
  const { id } = await params;

  if (!isAdminConfigured) return NextResponse.json({ demo: true, ok: true });

  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const svc = getAdminClient()!;

  // portal_clients rows cascade (services/tasks/docs/invoices/messages).
  const { error } = await svc.from("portal_clients").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await svc.auth.admin.deleteUser(id).catch(() => {});
  await logAudit(svc, gate.admin.id, "client.deleted", "client", id, "Client deleted");

  return NextResponse.json({ demo: false, ok: true });
}
