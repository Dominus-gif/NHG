"use client";

import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

/** Fetch an /api/admin/* endpoint with the signed-in user's access token
 *  attached as a Bearer header, so the server can enforce admin RBAC. */
export async function adminFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const sb = getSupabaseBrowser();
  const token = sb ? (await sb.auth.getSession()).data.session?.access_token : null;

  return fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
