// Dodo Payments — hosted checkout link creation for invoices.
// Uses the Checkout Sessions API (POST /checkouts). Custom invoice amounts
// require a "Pay What You Want" product in Dodo; its id goes in DODO_PRODUCT_ID.
//
// Env:
//   DODO_PAYMENTS_API_KEY   (required)  — server-only secret
//   DODO_PRODUCT_ID         (required)  — a PWYW-enabled product id
//   DODO_PAYMENTS_MODE      (optional)  — 'test' (default) | 'live'
//   DODO_RETURN_URL         (optional)  — where to send the payer after paying

export function isDodoConfigured(): boolean {
  return Boolean(process.env.DODO_PAYMENTS_API_KEY && process.env.DODO_PRODUCT_ID);
}

type CheckoutOpts = {
  amount: number; // in major units (e.g. dollars)
  email?: string | null;
  name?: string | null;
  metadata?: Record<string, string>;
};

export type DodoCheckout = { checkout_url: string; session_id: string };

export async function createDodoCheckout(opts: CheckoutOpts): Promise<DodoCheckout> {
  const key = process.env.DODO_PAYMENTS_API_KEY;
  const productId = process.env.DODO_PRODUCT_ID;
  if (!key || !productId) throw new Error("Dodo Payments is not configured.");

  const mode = (process.env.DODO_PAYMENTS_MODE || "test").toLowerCase();
  const base = mode === "live" ? "https://live.dodopayments.com" : "https://test.dodopayments.com";
  const returnUrl = process.env.DODO_RETURN_URL || "https://nordharton.com/portal";

  const res = await fetch(`${base}/checkouts`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      product_cart: [{ product_id: productId, quantity: 1, amount: Math.round(opts.amount * 100) }],
      ...(opts.email ? { customer: { email: opts.email, ...(opts.name ? { name: opts.name } : {}) } } : {}),
      return_url: returnUrl,
      ...(opts.metadata ? { metadata: opts.metadata } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Dodo Payments error ${res.status}: ${body.slice(0, 300)}`);
  }
  const data = (await res.json()) as { checkout_url?: string; session_id?: string };
  if (!data.checkout_url) throw new Error("Dodo Payments did not return a checkout URL.");
  return { checkout_url: data.checkout_url, session_id: data.session_id || "" };
}
