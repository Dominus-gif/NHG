import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Ctx = { params: Promise<{ id: string }> };

// Returns a short-lived signed download URL for a document the signed-in client
// owns — but only if it's released (unlocked) or the client is fully paid up.
export async function GET(req: Request, { params }: Ctx) {
  const { id } = await params;
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";

  const admin = getAdminClient();
  if (!admin) return NextResponse.json({ error: "Server not configured." }, { status: 500 });

  const { data: userData, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !userData.user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  const uid = userData.user.id;

  const { data: doc } = await admin
    .from("portal_documents")
    .select("client_id, released, url, storage_path")
    .eq("id", id)
    .maybeSingle();
  if (!doc || doc.client_id !== uid) return NextResponse.json({ error: "Not found." }, { status: 404 });

  // Unlocked if explicitly released, or if the client has no outstanding invoices.
  let allowed = Boolean(doc.released);
  if (!allowed) {
    const { data: unpaid } = await admin
      .from("portal_invoices")
      .select("id")
      .eq("client_id", uid)
      .neq("status", "paid")
      .is("deleted_at", null)
      .limit(1);
    allowed = !unpaid || unpaid.length === 0;
  }
  if (!allowed) return NextResponse.json({ error: "This document is locked." }, { status: 403 });

  if (doc.storage_path) {
    const { data, error } = await admin.storage.from("documents").createSignedUrl(doc.storage_path, 3600);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ url: data.signedUrl });
  }
  if (doc.url) return NextResponse.json({ url: doc.url });
  return NextResponse.json({ error: "No file attached." }, { status: 404 });
}
