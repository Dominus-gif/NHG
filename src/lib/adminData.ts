// Types, demo fixtures, and shared computation for the Admin Dashboard.
// Demo data renders whenever the admin backend isn't configured (local/preview),
// mirroring the client portal's demo mode so the UI is fully viewable pre-wiring.

export type AdminProfile = { id: string; email: string; name: string | null; role: string };

export type AdminClientRow = {
  id: string;
  client_id: string;
  name: string;
  company: string | null;
  industry: string | null;
  status: "active" | "suspended";
  created_at: string;
};

export type ActivityItem = {
  id: string;
  type: string;
  title: string;
  detail?: string;
  at: string;
};

export type Signup = { month: string; count: number };

export type AdminOverview = {
  totalClients: number;
  activeClients: number;
  suspendedClients: number;
  revenueThisMonth: number;
  currency: string;
  signups: Signup[];
  activity: ActivityItem[];
};

/* --------------------------------- demo ---------------------------------- */

export const DEMO_ADMIN: AdminProfile = {
  id: "demo-admin",
  email: "owner@nordharton.com",
  name: "Owner (demo)",
  role: "admin",
};

export const DEMO_CLIENTS: AdminClientRow[] = [
  { id: "c1", client_id: "NHG-2048", name: "Alex Morgan", company: "Vertex Retail Group", industry: "Retail", status: "active", created_at: "2025-09-14T10:00:00Z" },
  { id: "c2", client_id: "NHG-2051", name: "Priya Anand", company: "Helix Technologies", industry: "Technology", status: "active", created_at: "2025-11-02T10:00:00Z" },
  { id: "c3", client_id: "NHG-2060", name: "Marco Bianchi", company: "NorthRidge Services", industry: "Logistics", status: "active", created_at: "2026-01-20T10:00:00Z" },
  { id: "c4", client_id: "NHG-2064", name: "Sara Lindqvist", company: "Auriel Consultants", industry: "Consulting", status: "suspended", created_at: "2026-02-11T10:00:00Z" },
  { id: "c5", client_id: "NHG-2071", name: "David Okoro", company: "Meridian Capital", industry: "Finance", status: "active", created_at: "2026-03-28T10:00:00Z" },
  { id: "c6", client_id: "NHG-2078", name: "Yuki Tanaka", company: "Sakura Manufacturing", industry: "Manufacturing", status: "active", created_at: "2026-05-06T10:00:00Z" },
  { id: "c7", client_id: "NHG-2083", name: "Emma Rossi", company: "Coastline Media", industry: "Media", status: "suspended", created_at: "2026-06-19T10:00:00Z" },
];

export const DEMO_ACTIVITY: ActivityItem[] = [
  { id: "a1", type: "invoice_paid", title: "Invoice INV-1042 paid", detail: "Vertex Retail Group · $24,000", at: "2026-08-06T14:20:00Z" },
  { id: "a2", type: "client_onboarded", title: "New client onboarded", detail: "Coastline Media", at: "2026-06-19T09:00:00Z" },
  { id: "a3", type: "invoice_overdue", title: "Invoice INV-1071 overdue", detail: "Vertex Retail Group · $9,200", at: "2026-05-21T00:00:00Z" },
  { id: "a4", type: "client_suspended", title: "Account suspended", detail: "Auriel Consultants", at: "2026-04-30T11:00:00Z" },
  { id: "a5", type: "service_added", title: "Service assigned", detail: "Cloud & Infrastructure · Meridian Capital", at: "2026-03-29T15:30:00Z" },
];

/* ------------------------------ computation ------------------------------ */

/** Last 12 months of signup counts, oldest → newest, from client created_at. */
export function computeSignups(clients: { created_at: string }[], now = new Date()): Signup[] {
  const series: Signup[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = d.toLocaleDateString("en-US", { month: "short" });
    const count = clients.filter((c) => {
      const cd = new Date(c.created_at);
      return !Number.isNaN(cd.getTime()) && cd.getFullYear() === d.getFullYear() && cd.getMonth() === d.getMonth();
    }).length;
    series.push({ month, count });
  }
  return series;
}

export function computeOverview(
  clients: AdminClientRow[],
  opts: { revenueThisMonth: number; currency?: string; activity: ActivityItem[]; now?: Date },
): AdminOverview {
  return {
    totalClients: clients.length,
    activeClients: clients.filter((c) => c.status === "active").length,
    suspendedClients: clients.filter((c) => c.status === "suspended").length,
    revenueThisMonth: opts.revenueThisMonth,
    currency: opts.currency ?? "USD",
    signups: computeSignups(clients, opts.now),
    activity: opts.activity,
  };
}

export const DEMO_OVERVIEW: AdminOverview = computeOverview(DEMO_CLIENTS, {
  revenueThisMonth: 24000,
  currency: "USD",
  activity: DEMO_ACTIVITY,
});
