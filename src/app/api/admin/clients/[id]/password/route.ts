import { NextResponse } from "next/server";
import { getAdminClient, isAdminConfigured } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/adminAuth";
import { generateTempPassword, logAudit } from "@/lib/adminServer";

export const dynamic = "force-dynamic";
type Ctx = { params: Promise<{ id: string }> };

// Set or reset a client's login password via Supabase Auth. If no password is
// supplied, a secure temporary one is generated and returned to share.
export async function POST(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as { password?: string };
  const password = (body.password && body.password.length >= 8) ? body.password : generateTempPassword();

  if (!isAdminConfigured) return NextResponse.json({ demo: true, password });

  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const svc = getAdminClient()!;

  const { error } = await svc.auth.admin.updateUserById(id, { password });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await logAudit(svc, gate.admin.id, "client.password_reset", "client", id, "Password set/reset");

  return NextResponse.json({ demo: false, ok: true, password });
}
