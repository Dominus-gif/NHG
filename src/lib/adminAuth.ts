import { createClient } from "@supabase/supabase-js";
import { getAdminClient, isAdminConfigured } from "@/lib/supabaseAdmin";

/**
 * Server-side RBAC gate for /api/admin/* routes.
 *
 * Flow: the browser sends the signed-in user's access token as a Bearer header.
 * We (1) verify that token against Supabase Auth to get the user id, then
 * (2) confirm — using the service role — that the id exists in `admin_users`.
 * Only then is the caller treated as an admin. A client-side route guard is UX
 * only; THIS is the real boundary.
 */

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export type AdminUser = { id: string; email: string; name: string | null; role: string };

export type AdminGate =
  | { ok: true; admin: AdminUser }
  | { ok: false; status: number; error: string };

function bearer(req: Request): string | null {
  const h = req.headers.get("authorization") || req.headers.get("Authorization") || "";
  return h.startsWith("Bearer ") ? h.slice(7).trim() : null;
}

export async function requireAdmin(req: Request): Promise<AdminGate> {
  if (!isAdminConfigured || !url || !anonKey) {
    return { ok: false, status: 503, error: "Admin backend is not configured." };
  }

  const token = bearer(req);
  if (!token) return { ok: false, status: 401, error: "Not signed in." };

  // 1) Verify the token → resolve the user.
  const authClient = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: userData, error: userErr } = await authClient.auth.getUser(token);
  if (userErr || !userData?.user) {
    return { ok: false, status: 401, error: "Invalid or expired session." };
  }

  // 2) Confirm the user is a registered admin (service role bypasses RLS).
  const svc = getAdminClient();
  if (!svc) return { ok: false, status: 503, error: "Admin backend is not configured." };

  const { data: adminRow, error: adminErr } = await svc
    .from("admin_users")
    .select("id, email, name, role")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (adminErr) return { ok: false, status: 500, error: adminErr.message };
  if (!adminRow) return { ok: false, status: 403, error: "This account is not an administrator." };

  return { ok: true, admin: adminRow as AdminUser };
}
