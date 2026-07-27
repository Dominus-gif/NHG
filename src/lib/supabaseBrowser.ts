"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client used by the Client Portal for authentication and
 * RLS-protected data reads. Uses the public anon key (safe to expose); each
 * client can only ever read their own rows because of Row Level Security.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isPortalConfigured = Boolean(url && anonKey);

let cached: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient | null {
  if (!isPortalConfigured) return null;
  if (!cached) {
    cached = createClient(url as string, anonKey as string, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
    });
  }
  return cached;
}

/** Client ID → login email. Clients sign in with a Client ID; behind the scenes
 * that maps to a synthetic Supabase Auth email. An actual email is also accepted. */
export function clientIdToEmail(clientId: string): string {
  const v = clientId.trim();
  if (v.includes("@")) return v.toLowerCase();
  return `${v.toLowerCase().replace(/[^a-z0-9._-]/g, "")}@clients.nordhartongroup.com`;
}
