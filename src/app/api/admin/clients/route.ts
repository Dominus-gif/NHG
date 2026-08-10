import { NextResponse } from "next/server";
import { getAdminClient, isAdminConfigured } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/adminAuth";
import { clientAuthEmail, generateClientId, generateTempPassword, logAudit, notify } from "@/lib/adminServer";
import { DEMO_CLIENTS, type AdminClientRow } from "@/lib/adminData";

export const dynamic = "force-dynamic";

// ---- List clients (paginated + searchable, built to scale) -----------------
export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10) || 1);
  const per = Math.min(100, Math.max(5, parseInt(url.searchParams.get("per") || "25", 10) || 25));
  const q = (url.searchParams.get("q") || "").trim();
  const status = url.searchParams.get("status") || "";
  const from = (page - 1) * per;

  if (!isAdminConfigured) {
    let rows = DEMO_CLIENTS;
    if (q) { const s = q.toLowerCase(); rows = rows.filter((c) => c.name.toLowerCase().includes(s) || (c.company || "").toLowerCase().includes(s) || c.client_id.toLowerCase().includes(s) || (c.industry || "").toLowerCase().includes(s)); }
    if (status === "active" || status === "suspended") rows = rows.filter((c) => c.status === status);
    return NextResponse.json({ demo: true, clients: rows.slice(from, from + per), total: rows.length, page, per });
  }

  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const svc = getAdminClient()!;

  let query = svc
    .from("portal_clients")
    .select("id, client_id, name, company, industry, status, created_at", { count: "exact" })
    .order("created_at", { ascending: false });
  if (q) query = query.or(`name.ilike.%${q}%,company.ilike.%${q}%,client_id.ilike.%${q}%,industry.ilike.%${q}%`);
  if (status === "active" || status === "suspended") query = query.eq("status", status);
  query = query.range(from, from + per - 1);

  const { data, error, count } = await query;
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
  return NextResponse.json({ demo: false, clients, total: count ?? clients.length, page, per });
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
  notes?: string;
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
    user_metadata: { must_set_password: true, client_id: clientId },
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
    notes: body.notes?.trim() || null,
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
