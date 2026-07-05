import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FIELDS = [
  "full_name",
  "work_email",
  "company",
  "job_title",
  "project_domain",
  "company_size",
  "global_presence",
  "industry",
  "estimated_budget",
  "project_details",
] as const;

export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const row: Record<string, string> = {};
  for (const key of FIELDS) {
    const v = body[key];
    row[key] = typeof v === "string" ? v.trim() : "";
  }

  if (!row.full_name || !row.work_email) {
    return NextResponse.json({ error: "Full name and work email are required." }, { status: 400 });
  }

  const supabase = getAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Server not configured: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY." },
      { status: 500 },
    );
  }

  const { error } = await supabase.from("consultation_requests").insert(row);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
