import { NextResponse } from "next/server";
import { getAdminClient, isAdminConfigured } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/adminAuth";
import { logAudit, notify } from "@/lib/adminServer";
import { createDodoCheckout, isDodoConfigured } from "@/lib/dodo";

export const dynamic = "force-dynamic";
type Ctx = { params: Promise<{ id: string }> };

const todayISO = () => new Date().toISOString().slice(0, 10);

// Update an invoice's status (mark paid / pending / overdue). Marking paid
// records a succeeded payment transaction and raises an "invoice paid" alert.
export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as { status?: string; restore?: boolean };

  // Restore a soft-deleted invoice.
  if (body.restore) {
    if (!isAdminConfigured) return NextResponse.json({ demo: true, ok: true });
    const rgate = await requireAdmin(req);
    if (!rgate.ok) return NextResponse.json({ error: rgate.error }, { status: rgate.status });
    const rsvc = getAdminClient()!;
    const { error } = await rsvc.from("portal_invoices").update({ deleted_at: null }).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    await logAudit(rsvc, rgate.admin.id, "invoice.restored", "invoice", id, "Invoice restored");
    return NextResponse.json({ demo: false, ok: true });
  }

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

// Generate / refresh a Dodo Payments checkout link for this invoice.
export async function POST(req: Request, { params }: Ctx) {
  const { id } = await params;
  if (!isAdminConfigured) return NextResponse.json({ demo: true, pay_url: "#" });
  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  if (!isDodoConfigured()) return NextResponse.json({ error: "Dodo Payments is not configured." }, { status: 400 });
  const svc = getAdminClient()!;

  const { data: inv } = await svc
    .from("portal_invoices")
    .select("id, number, amount, client_id, portal_clients(name, crm_email)")
    .eq("id", id)
    .maybeSingle();
  if (!inv) return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  const cl = (inv as unknown as { portal_clients?: { name?: string; crm_email?: string } | null }).portal_clients;

  try {
    const checkout = await createDodoCheckout({
      amount: Number(inv.amount) || 0,
      email: cl?.crm_email ?? null,
      name: cl?.name ?? null,
      metadata: { invoice_number: inv.number },
    });
    await svc.from("portal_invoices").update({ pay_url: checkout.checkout_url, provider: "dodo", provider_session: checkout.session_id }).eq("id", id);
    return NextResponse.json({ demo: false, ok: true, pay_url: checkout.checkout_url });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Checkout failed." }, { status: 502 });
  }
}

// Soft-delete: the row is kept (with deleted_at set) as a restorable backup,
// and an audit-log entry is written. Nothing is permanently removed.
export async function DELETE(req: Request, { params }: Ctx) {
  const { id } = await params;
  if (!isAdminConfigured) return NextResponse.json({ demo: true, ok: true });
  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const svc = getAdminClient()!;
  const { error } = await svc.from("portal_invoices").update({ deleted_at: new Date().toISOString() }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await logAudit(svc, gate.admin.id, "invoice.deleted", "invoice", id, "Invoice deleted (archived, restorable)");
  return NextResponse.json({ demo: false, ok: true });
}
