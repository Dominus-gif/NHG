import { NextResponse } from "next/server";
import { getAdminClient, isAdminConfigured } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/adminAuth";
import { DEMO_TRANSACTIONS, type TransactionRow } from "@/lib/adminData";

export const dynamic = "force-dynamic";

// Payment / invoice audit trail.
export async function GET(req: Request) {
  if (!isAdminConfigured) return NextResponse.json({ demo: true, transactions: DEMO_TRANSACTIONS });
  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const svc = getAdminClient()!;
  const { data, error } = await svc
    .from("transactions")
    .select("id, created_at, kind, provider, amount, currency, status, reference, portal_clients(name, company)")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const transactions: TransactionRow[] = (data ?? []).map((r) => {
    const rc = r as unknown as { portal_clients?: { name?: string; company?: string } | null } & Record<string, unknown>;
    return {
      id: r.id,
      created_at: r.created_at,
      client_name: rc.portal_clients?.company || rc.portal_clients?.name || null,
      kind: r.kind,
      provider: r.provider,
      amount: Number(r.amount) || 0,
      currency: r.currency || "USD",
      status: r.status,
      reference: r.reference,
    };
  });
  return NextResponse.json({ demo: false, transactions });
}
