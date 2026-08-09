import { NextResponse } from "next/server";
import { getAdminClient, isAdminConfigured } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/adminAuth";
import { clientAuthEmail, generateClientId, generateTempPassword, logAudit, notify } from "@/lib/adminServer";

export const dynamic = "force-dynamic";

type ImportRow = { name?: string; company?: string; industry?: string; crm_email?: string };
type Result = { name: string; ok: boolean; client_id?: string; temp_password?: string; error?: string };

// Bulk-onboard clients parsed from a CSV (rows come from the browser already parsed).
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { rows?: ImportRow[] };
  const rows = (body.rows ?? []).filter((r) => r.name?.trim());
  if (rows.length === 0) return NextResponse.json({ error: "No valid rows found." }, { status: 400 });
  if (rows.length > 200) return NextResponse.json({ error: "Please import 200 rows or fewer at a time." }, { status: 400 });

  if (!isAdminConfigured) {
    return NextResponse.json({
      demo: true,
      results: rows.map((r) => ({ name: r.name!.trim(), ok: true, client_id: generateClientId(), temp_password: generateTempPassword() })),
    });
  }

  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const svc = getAdminClient()!;

  const results: Result[] = [];
  for (const r of rows) {
    const name = r.name!.trim();
    const clientId = generateClientId();
    const password = generateTempPassword();
    try {
      const { data: created, error: authErr } = await svc.auth.admin.createUser({
        email: clientAuthEmail(clientId),
        password,
        email_confirm: true,
      });
      if (authErr || !created?.user) throw new Error(authErr?.message || "auth failed");

      const { error: profErr } = await svc.from("portal_clients").insert({
        id: created.user.id,
        client_id: clientId,
        name,
        company: r.company?.trim() || null,
        industry: r.industry?.trim() || null,
        crm_email: r.crm_email?.trim() || null,
        status: "active",
      });
      if (profErr) {
        await svc.auth.admin.deleteUser(created.user.id).catch(() => {});
        throw new Error(profErr.message);
      }
      results.push({ name, ok: true, client_id: clientId, temp_password: password });
    } catch (e) {
      results.push({ name, ok: false, error: e instanceof Error ? e.message : "failed" });
    }
  }

  const created = results.filter((r) => r.ok).length;
  await notify(svc, "client_onboarded", "Bulk import complete", `${created} of ${rows.length} clients created.`);
  await logAudit(svc, gate.admin.id, "client.imported", "client", null, `Imported ${created}/${rows.length} clients`);

  return NextResponse.json({ demo: false, results });
}
