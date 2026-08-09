import { NextResponse } from "next/server";
import { isAdminConfigured } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/adminAuth";
import { DEMO_ADMIN } from "@/lib/adminData";

export const dynamic = "force-dynamic";

// Returns the signed-in admin's profile, or 401/403. Used by the /admin shell
// to gate the UI. In demo mode (no backend) it returns a demo admin so the
// dashboard is viewable locally.
export async function GET(req: Request) {
  if (!isAdminConfigured) {
    return NextResponse.json({ demo: true, admin: DEMO_ADMIN });
  }
  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  return NextResponse.json({ demo: false, admin: gate.admin });
}
