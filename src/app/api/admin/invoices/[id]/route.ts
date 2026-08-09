import { NextResponse } from "next/server";
import { getAdminClient, isAdminConfigured } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/adminAuth";
import { logAudit, notify } from "@/lib/adminServer";

export const dynamic = "force-dynamic";
type Ctx = { params: Promise<{ id: string }> };

const todayISO = () => new Date().toISOString().slice(0, 10);

// Update an invoice's status (mark paid / pending / overdue). Marking paid
// records a succeeded payment transaction and raises an "invoice paid" alert.
export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as { status?: string };
  const status = body.status;
  if (!status || !["paid", "pending", "overdue"].includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }
  if (!isAdminConfigured) return NextResponse.json({ demo: true, ok: true });

  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const svc = getAdminClient()!;

  const patch: Record<string, unknown> = { status };
  if (status === "paid") patch.paid_on = todayISO();

  const { data: inv, error } = await svc
    .from("portal_invoices")
    .update(patch)
    .eq("id", id)
    .select("id, client_id, number, amount, currency")
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (status === "paid" && inv) {
    await svc.from("transactions").insert({
      client_id: inv.client_id,
      invoice_id: inv.id,
      kind: "payment",
      provider: "manual",
      amount: Number(inv.amount) || 0,
      currency: inv.currency || "USD",
      status: "succeeded",
      reference: inv.number,
    });
    await notify(svc, "invoice_paid", `Invoice ${inv.number} paid`, `${inv.currency} ${inv.amount}`, inv.id);
  } else if (status === "overdue" && inv) {
    await notify(svc, "invoice_overdue", `Invoice ${inv.number} overdue`, `${inv.currency} ${inv.amount}`, inv.id);
  }
  await logAudit(svc, gate.admin.id, `invoice.${status}`, "invoice", id, `Invoice marked ${status}`);

  return NextResponse.json({ demo: false, ok: true });
}
