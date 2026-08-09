import { randomBytes, randomInt } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Synthetic auth email for a Client ID. Must match the portal login mapping
 *  (clientIdToEmail) so onboarded clients can sign in. Internal only. */
export function clientAuthEmail(clientId: string): string {
  return `${clientId.toLowerCase().replace(/[^a-z0-9._-]/g, "")}@clients.nordhartongroup.com`;
}

/** A readable, unique-ish Client ID, e.g. "NHG-4821". */
export function generateClientId(): string {
  return `NHG-${randomInt(1000, 9999)}`;
}

/** A strong temporary password (URL-safe, ~14 chars). */
export function generateTempPassword(): string {
  return randomBytes(12).toString("base64url").slice(0, 14);
}

/** Record an admin action (feeds the dashboard activity log). Best-effort. */
export async function logAudit(
  svc: SupabaseClient,
  adminId: string,
  action: string,
  entity: string,
  entityId: string | null,
  summary: string,
): Promise<void> {
  try {
    await svc.from("admin_audit").insert({ admin_id: adminId, action, entity, entity_id: entityId, summary });
  } catch {
    /* non-fatal */
  }
}

/** Raise an in-app notification. Best-effort. */
export async function notify(
  svc: SupabaseClient,
  type: string,
  title: string,
  body?: string,
  relatedId?: string,
): Promise<void> {
  try {
    await svc.from("notifications").insert({ type, title, body: body ?? null, related_id: relatedId ?? null });
  } catch {
    /* non-fatal */
  }
}
