import { NextResponse } from "next/server";
import { getAdminClient, isAdminConfigured } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/adminAuth";
import { clientAuthEmail, logAudit } from "@/lib/adminServer";

export const dynamic = "force-dynamic";
type Ctx = { params: Promise<{ id: string }> };

// Change a client's login username (their Client ID). Updates both the
// portal_clients.client_id and the Supabase Auth email so they sign in with it.
export async function POST(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as { username?: string };
  const username = (body.username || "").trim();
  if (!username || username.includes("@") || username.length < 3) {
    return NextResponse.json({ error: "Enter a username of at least 3 characters (no @)." }, { status: 400 });
  }
  if (!isAdminConfigured) return NextResponse.json({ demo: true, ok: true, client_id: username });

  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const svc = getAdminClient()!;

  // Ensure the new Client ID isn't taken by someone else.
  const { data: existing } = await svc.from("portal_clients").select("id").eq("client_id", username).maybeSingle();
  if (existing && existing.id !== id) {
    return NextResponse.json({ error: "That username is already in use." }, { status: 409 });
  }

  // Update the auth email first (this is what they actually log in with).
  const { error: authErr } = await svc.auth.admin.updateUserById(id, {
    email: clientAuthEmail(username),
    email_confirm: true,
    user_metadata: { client_id: username },
  });
  if (authErr) return NextResponse.json({ error: authErr.message }, { status: 500 });

  const { error: profErr } = await svc.from("portal_clients").update({ client_id: username }).eq("id", id);
  if (profErr) return NextResponse.json({ error: profErr.message }, { status: 500 });

  await logAudit(svc, gate.admin.id, "client.username_changed", "client", id, `Login username set to ${username}`);
  return NextResponse.json({ demo: false, ok: true, client_id: username });
}
