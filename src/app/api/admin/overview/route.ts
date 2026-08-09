import { NextResponse } from "next/server";
import { getAdminClient, isAdminConfigured } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/adminAuth";
import {
  DEMO_OVERVIEW,
  computeOverview,
  type AdminClientRow,
  type ActivityItem,
} from "@/lib/adminData";

export const dynamic = "force-dynamic";

// Dashboard KPIs + 12-month signups + recent activity.
export async function GET(req: Request) {
  if (!isAdminConfigured) {
    return NextResponse.json({ demo: true, overview: DEMO_OVERVIEW });
  }

  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

  const svc = getAdminClient()!;

  // Clients (for counts + signups series).
  const { data: clientRows, error: clientErr } = await svc
    .from("portal_clients")
    .select("id, client_id, name, company, industry, status, created_at");
  if (clientErr) return NextResponse.json({ error: clientErr.message }, { status: 500 });

  const clients: AdminClientRow[] = (clientRows ?? []).map((c) => ({
    id: c.id,
    client_id: c.client_id,
    name: c.name,
    company: c.company ?? null,
    industry: c.industry ?? null,
    status: c.status === "suspended" ? "suspended" : "active",
    created_at: c.created_at,
  }));

  // Revenue this month — from succeeded payment transactions (reliable timestamps).
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const { data: txRows } = await svc
    .from("transactions")
    .select("amount, currency, kind, status, created_at")
    .eq("kind", "payment")
    .eq("status", "succeeded")
    .gte("created_at", monthStart);
  const revenueThisMonth = (txRows ?? []).reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const currency = txRows?.[0]?.currency ?? "USD";

  // Recent activity feed from the admin audit log.
  const { data: auditRows } = await svc
    .from("admin_audit")
    .select("id, action, entity, summary, created_at")
    .order("created_at", { ascending: false })
    .limit(8);
  const activity: ActivityItem[] = (auditRows ?? []).map((a) => ({
    id: a.id,
    type: a.action,
    title: a.summary || a.action,
    detail: a.entity ?? undefined,
    at: a.created_at,
  }));

  const overview = computeOverview(clients, { revenueThisMonth, currency, activity, now });
  return NextResponse.json({ demo: false, overview });
}
