import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TABLES = ["email_leads", "consultation_requests", "job_applications"] as const;

/**
 * Diagnostic endpoint. Visit /api/health on your deployment to see, without
 * guessing, exactly what's configured and whether the database is reachable.
 * Returns booleans and error strings only — never the secret values themselves.
 */
export async function GET() {
  const hasUrl = Boolean(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasServiceRoleKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  const result: Record<string, unknown> = { hasUrl, hasServiceRoleKey };

  const supabase = getAdminClient();
  if (!supabase) {
    result.status = "not_configured";
    result.hint =
      "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel → Settings → Environment Variables, then REDEPLOY.";
    return NextResponse.json(result);
  }

  // Live read check per table (service role bypasses RLS). Confirms the URL/key
  // point at the right project AND that the tables actually exist.
  const tables: Record<string, unknown> = {};
  let allOk = true;
  for (const table of TABLES) {
    const { error } = await supabase.from(table).select("id", { head: true, count: "exact" });
    if (error) {
      allOk = false;
      tables[table] = { ok: false, error: error.message };
    } else {
      tables[table] = { ok: true };
    }
  }
  result.tables = tables;

  // Storage bucket check
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  if (bucketError) {
    allOk = false;
    result.resumesBucket = { ok: false, error: bucketError.message };
  } else {
    const found = (buckets ?? []).some((b) => b.name === "resumes");
    if (!found) allOk = false;
    result.resumesBucket = { ok: found, error: found ? undefined : "bucket 'resumes' not found" };
  }

  result.status = allOk ? "ok" : "error";
  if (!allOk) {
    result.hint =
      "Some tables or the storage bucket are missing. Run supabase/schema.sql in the Supabase SQL Editor of THIS project.";
  }
  return NextResponse.json(result);
}
