import { NextResponse } from "next/server";
import { randomInt } from "crypto";
import { getAdminClient, isAdminConfigured } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/adminAuth";
import { logAudit } from "@/lib/adminServer";
import { DEMO_INVOICES, type AdminInvoiceRow } from "@/lib/adminData";

export const dynamic = "force-dynamic";

const today = () => new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

export async function GET(req: Request) {
  if (!isAdminConfigured) return NextResponse.json({ demo: true, invoices: DEMO_INVOICES });
  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const svc = getAdminClient()!;
  const { data, error } = await svc
    .from("portal_invoices")
    .select("id, client_id, number, service, amount, currency, status, issued, due, paid_on, pay_url, portal_clients(name, company)")
    .order("issued", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const invoices: AdminInvoiceRow[] = (data ?? []).map((r) => {
    const rc = r as unknown as { portal_clients?: { name?: string; company?: string } | null } & Record<string, unknown>;
    return {
      id: r.id,
      client_id: r.client_id,
      client_name: rc.portal_clients?.company || rc.portal_clients?.name || null,
      number: r.number,
      service: r.service,
      amount: Number(r.amount) || 0,
      currency: r.currency || "USD",
      status: (["paid", "pending", "overdue"].includes(r.status) ? r.status : "pending") as AdminInvoiceRow["status"],
      issued: r.issued,
      due: r.due,
      paid_on: r.paid_on,
      pay_url: r.pay_url,
    };
  });
  return NextResponse.json({ demo: false, invoices });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const amount = Number(body.amount) || 0;
  if (!body.client_id) return NextResponse.json({ error: "A client is required." }, { status: 400 });
  if (amount <= 0) return NextResponse.json({ error: "Amount must be greater than zero." }, { status: 400 });
  const number = String(body.number || `INV-${randomInt(1000, 9999)}`);

  if (!isAdminConfigured) return NextResponse.json({ demo: true, ok: true, number });

  const gate = await requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const svc = getAdminClient()!;

  // Placeholder hosted-checkout link — swap for a real Stripe/PayPal/Dodo session.
  const payUrl = String(body.pay_url || `https://checkout.nordharton.com/pay/${number}`);

  const { data, error } = await svc
    .from("portal_invoices")
    .insert({
      client_id: String(body.client_id),
      number,
      service: body.service ? String(body.service) : null,
      amount,
      currency: String(body.currency || "USD"),
      status: "pending",
      issued: today(),
      due: body.due ? String(body.due) : null,
      pay_url: payUrl,
    })
    .select("id")
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await svc.from("transactions").insert({
    client_id: String(body.client_id),
    invoice_id: data?.id ?? null,
    kind: "invoice_created",
    provider: "manual",
    amount,
    currency: String(body.currency || "USD"),
    status: "pending",
    reference: number,
  });
  await logAudit(svc, gate.admin.id, "invoice.created", "invoice", data?.id ?? null, `Created ${number} (${amount})`);

  return NextResponse.json({ demo: false, ok: true, id: data?.id, number, pay_url: payUrl });
}
