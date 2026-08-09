import { NextResponse } from "next/server";
import { getAdminClient, isAdminConfigured } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/adminAuth";
import { clientAuthEmail, generateClientId, generateTempPassword, logAudit, notify } from "@/lib/adminServer";
import { DEMO_CLIENTS, type AdminClientRow } from "@/lib/adminData";

export const dynamic = "force-dynamic";

// ---- List clients ----------------------------------------------------------
export async function GET(req: Request) {
  if (!isAdminConfigured) {
    return NextResponse.json({ demo: true, clients: DEMO_CLIENTS });
  }
  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

  const svc = getAdminClient()!;
  const { data, error } = await svc
    .from("portal_clients")
    .select("id, client_id, name, company, industry, status, created_at")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const clients: AdminClientRow[] = (data ?? []).map((c) => ({
    id: c.id,
    client_id: c.client_id,
    name: c.name,
    company: c.company ?? null,
    industry: c.industry ?? null,
    status: c.status === "suspended" ? "suspended" : "active",
    created_at: c.created_at,
  }));
  return NextResponse.json({ demo: false, clients });
}

// ---- Onboard a new client --------------------------------------------------
// Creates the auth user, the portal_clients row, and any assigned services,
// then returns the generated temporary credentials to share with the client.
type OnboardBody = {
  name?: string;
  company?: string;
  industry?: string;
  client_id?: string;
  crm_name?: string;
  crm_email?: string;
  crm_phone?: string;
  crm_telegram?: string;
  services?: { name: string; description?: string }[];
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as OnboardBody;
  const clientId = (body.client_id || generateClientId()).trim();
  const tempPassword = generateTempPassword();

  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Client name is required." }, { status: 400 });
  }

  if (!isAdminConfigured) {
    // Demo mode — simulate a successful onboard.
    return NextResponse.json({
      demo: true,
      client_id: clientId,
      temp_password: tempPassword,
      auth_email: clientAuthEmail(clientId),
    });
  }

  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const svc = getAdminClient()!;

  // 1) Create the auth user (email pre-confirmed so they can sign in at once).
  const authEmail = clientAuthEmail(clientId);
  const { data: created, error: authErr } = await svc.auth.admin.createUser({
    email: authEmail,
    password: tempPassword,
    email_confirm: true,
  });
  if (authErr || !created?.user) {
    return NextResponse.json({ error: authErr?.message || "Could not create the account." }, { status: 500 });
  }
  const uid = created.user.id;

  // 2) Client profile.
  const { error: profErr } = await svc.from("portal_clients").insert({
    id: uid,
    client_id: clientId,
    name: body.name.trim(),
    company: body.company?.trim() || null,
    industry: body.industry?.trim() || null,
    crm_name: body.crm_name?.trim() || null,
    crm_email: body.crm_email?.trim() || null,
    crm_phone: body.crm_phone?.trim() || null,
    crm_telegram: body.crm_telegram?.trim() || null,
    status: "active",
  });
  if (profErr) {
    // Roll back the auth user so we don't leave an orphan.
    await svc.auth.admin.deleteUser(uid).catch(() => {});
    return NextResponse.json({ error: profErr.message }, { status: 500 });
  }

  // 3) Assigned services (copied into the client's portal_services).
  const services = (body.services ?? []).filter((s) => s.name?.trim());
  if (services.length) {
    await svc.from("portal_services").insert(
      services.map((s) => ({ client_id: uid, name: s.name.trim(), description: s.description ?? null, status: "Active" })),
    );
  }

  await notify(svc, "client_onboarded", "New client onboarded", `${body.name.trim()} (${clientId})`, uid);
  await logAudit(svc, gate.admin.id, "client.created", "client", uid, `Onboarded ${body.name.trim()} (${clientId})`);

  return NextResponse.json({
    demo: false,
    client_id: clientId,
    temp_password: tempPassword,
    auth_email: authEmail,
    id: uid,
  });
}
