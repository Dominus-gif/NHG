import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RESUME_BUCKET = "resumes";

const FIELDS = ["role", "full_name", "email", "country", "dial_code", "phone", "experience"] as const;

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const row: Record<string, string> = {};
  for (const key of FIELDS) {
    const v = form.get(key);
    row[key] = typeof v === "string" ? v.trim() : "";
  }

  if (!row.full_name || !row.email) {
    return NextResponse.json({ error: "Full name and email are required." }, { status: 400 });
  }

  const resume = form.get("resume");
  if (!(resume instanceof File) || resume.size === 0) {
    return NextResponse.json({ error: "A resume file is required." }, { status: 400 });
  }

  const supabase = getAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Server not configured: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY." },
      { status: 500 },
    );
  }

  const safeName = resume.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const resumePath = `${Date.now()}-${crypto.randomUUID()}-${safeName}`;
  const bytes = new Uint8Array(await resume.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(RESUME_BUCKET)
    .upload(resumePath, bytes, { contentType: resume.type || "application/octet-stream", upsert: false });
  if (uploadError) {
    return NextResponse.json({ error: `Resume upload failed: ${uploadError.message}` }, { status: 500 });
  }

  const { error } = await supabase.from("job_applications").insert({ ...row, resume_path: resumePath });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
