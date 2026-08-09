import { NextResponse } from "next/server";
import { getAdminClient, isAdminConfigured } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/adminAuth";
import { DEMO_CLIENTS, type AdminClientRow } from "@/lib/adminData";

export const dynamic = "force-dynamic";

// Read-only client list for the management view. CRUD arrives in a later phase.
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
