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

/* --------------------------- service catalog ----------------------------- */

export type BillingCycle = "one_time" | "monthly" | "quarterly" | "yearly";

export type ServiceCatalogItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  billing_cycle: BillingCycle;
  active: boolean;
};

export const BILLING_CYCLES: { value: BillingCycle; label: string }[] = [
  { value: "one_time", label: "One-time" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];

export const DEMO_CATALOG: ServiceCatalogItem[] = [
  { id: "sc1", name: "Custom Web Application", description: "Bespoke platform build — advanced UI, dense data, custom workflows.", price: 45000, currency: "USD", billing_cycle: "one_time", active: true },
  { id: "sc2", name: "Cloud & Infrastructure", description: "AWS architecture, CI/CD, observability, zero-downtime deploys.", price: 6000, currency: "USD", billing_cycle: "monthly", active: true },
  { id: "sc3", name: "Web Experience & Branding", description: "Marketing site + reusable design system.", price: 18000, currency: "USD", billing_cycle: "one_time", active: true },
  { id: "sc4", name: "Security & Governance", description: "Hardening, audit-readiness, and compliance support.", price: 4500, currency: "USD", billing_cycle: "monthly", active: true },
  { id: "sc5", name: "Managed Support (Retainer)", description: "Ongoing maintenance, monitoring, and iteration.", price: 3500, currency: "USD", billing_cycle: "monthly", active: false },
];

/* ------------------------------- invoices -------------------------------- */

export type AdminInvoiceRow = {
  id: string;
  client_id: string | null;
  client_name?: string | null;
  number: string;
  service: string | null;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "overdue";
  issued: string | null;
  due: string | null;
  paid_on: string | null;
  pay_url: string | null;
};

export const DEMO_INVOICES: AdminInvoiceRow[] = [
  { id: "inv5", client_id: "c1", client_name: "Vertex Retail Group", number: "INV-1042", service: "Custom Web Application", amount: 24000, currency: "USD", status: "paid", issued: "Apr 1, 2026", due: "Apr 15, 2026", paid_on: "2026-04-12", pay_url: null },
  { id: "inv6", client_id: "c3", client_name: "NorthRidge Services", number: "INV-1067", service: "Cloud & Infrastructure", amount: 18500, currency: "USD", status: "pending", issued: "Jun 1, 2026", due: "Jun 30, 2026", paid_on: null, pay_url: "#" },
  { id: "inv7", client_id: "c1", client_name: "Vertex Retail Group", number: "INV-1071", service: "Custom Web Application", amount: 9200, currency: "USD", status: "overdue", issued: "May 5, 2026", due: "May 20, 2026", paid_on: null, pay_url: "#" },
  { id: "inv8", client_id: "c5", client_name: "Meridian Capital", number: "INV-1080", service: "Security & Governance", amount: 4500, currency: "USD", status: "pending", issued: "Jul 1, 2026", due: "Jul 31, 2026", paid_on: null, pay_url: "#" },
];

export type TransactionRow = {
  id: string;
  created_at: string;
  client_name?: string | null;
  kind: string;
  provider: string | null;
  amount: number;
  currency: string;
  status: string;
  reference: string | null;
};

export const DEMO_TRANSACTIONS: TransactionRow[] = [
  { id: "tx1", created_at: "2026-04-12T10:02:00Z", client_name: "Vertex Retail Group", kind: "payment", provider: "dodo", amount: 24000, currency: "USD", status: "succeeded", reference: "dodo_ch_9F2A" },
  { id: "tx2", created_at: "2026-06-01T09:00:00Z", client_name: "NorthRidge Services", kind: "invoice_created", provider: "manual", amount: 18500, currency: "USD", status: "pending", reference: "INV-1067" },
  { id: "tx3", created_at: "2026-02-02T14:20:00Z", client_name: "Auriel Consultants", kind: "payment", provider: "dodo", amount: 8000, currency: "USD", status: "succeeded", reference: "dodo_ch_71Bd" },
];

/* ------------------------------ documents -------------------------------- */

export type AdminDocRow = {
  id: string;
  client_id: string | null;
  client_name?: string | null;
  title: string;
  kind: string;
  service: string | null;
  version: number;
  released: boolean;
  created_at?: string;
};

export const DEMO_DOCS: AdminDocRow[] = [
  { id: "doc1", client_id: "c1", client_name: "Vertex Retail Group", title: "Solution Architecture", kind: "PDF", service: "Custom Web Application", version: 3, released: true },
  { id: "doc2", client_id: "c1", client_name: "Vertex Retail Group", title: "API Reference & Contracts", kind: "Spec", service: "Custom Web Application", version: 1, released: false },
  { id: "doc3", client_id: "c3", client_name: "NorthRidge Services", title: "Infrastructure Diagram", kind: "PDF", service: "Cloud & Infrastructure", version: 2, released: true },
];

/* ---------------------------- notifications ------------------------------ */

export type NotificationRow = {
  id: string;
  created_at: string;
  type: string;
  title: string;
  body: string | null;
  read: boolean;
};

export const DEMO_NOTIFICATIONS: NotificationRow[] = [
  { id: "n1", created_at: "2026-08-06T14:20:00Z", type: "invoice_paid", title: "Invoice INV-1042 paid", body: "Vertex Retail Group paid $24,000.", read: false },
  { id: "n2", created_at: "2026-07-01T09:00:00Z", type: "client_onboarded", title: "New client onboarded", body: "Meridian Capital was added.", read: false },
  { id: "n3", created_at: "2026-05-21T00:00:00Z", type: "invoice_overdue", title: "Invoice INV-1071 overdue", body: "Vertex Retail Group · $9,200 is overdue.", read: true },
];

/* --------------------------- email templates ----------------------------- */

/* ------------------------------ task board ------------------------------- */

export type TaskCategory = "task" | "follow_up" | "invoice" | "onboarding" | "support";
export type TaskStatus = "todo" | "doing" | "done";
export type TaskPriority = "low" | "medium" | "high";

export type AdminTask = {
  id: string;
  created_at: string;
  title: string;
  notes: string | null;
  category: TaskCategory;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  client_id?: string | null;
};

export const TASK_CATEGORIES: { value: TaskCategory; label: string; color: string }[] = [
  { value: "follow_up", label: "Follow-up", color: "var(--warning)" },
  { value: "invoice", label: "Invoice", color: "var(--accent)" },
  { value: "onboarding", label: "Onboarding", color: "var(--success)" },
  { value: "support", label: "Support", color: "var(--danger)" },
  { value: "task", label: "Task", color: "var(--text-muted)" },
];

export const DEMO_ADMIN_TASKS: AdminTask[] = [
  { id: "k1", created_at: "2026-08-07T09:00:00Z", title: "Follow up with Meridian Capital on proposal", notes: "Sent revised scope; awaiting sign-off.", category: "follow_up", status: "todo", priority: "high", due_date: "2026-08-11" },
  { id: "k2", created_at: "2026-08-06T14:00:00Z", title: "Chase INV-1071 (overdue)", notes: "Vertex Retail Group · $9,200", category: "invoice", status: "doing", priority: "high", due_date: "2026-08-09" },
  { id: "k3", created_at: "2026-08-05T11:00:00Z", title: "Kick off onboarding for Coastline Media", notes: null, category: "onboarding", status: "todo", priority: "medium", due_date: "2026-08-14" },
  { id: "k4", created_at: "2026-08-04T16:00:00Z", title: "Resolve staging access ticket", notes: "NorthRidge Services", category: "support", status: "doing", priority: "medium", due_date: null },
  { id: "k5", created_at: "2026-08-01T10:00:00Z", title: "Send Q3 architecture review notes", notes: null, category: "task", status: "done", priority: "low", due_date: "2026-08-02" },
];

/* --------------------------- email templates ----------------------------- */

export type EmailTemplate = { key: string; subject: string; body: string; updated_at?: string };

export const DEMO_TEMPLATES: EmailTemplate[] = [
  { key: "client_invite", subject: "Welcome to Nord Harton", body: "Hi {{name}},\n\nYour client workspace is ready. Sign in with Client ID {{client_id}} using the temporary password provided, then set a new one.\n\n— Nord Harton" },
  { key: "invoice_paid", subject: "Payment received — {{number}}", body: "Hi {{name}},\n\nWe have received your payment for invoice {{number}} ({{amount}}). Thank you.\n\n— Nord Harton" },
  { key: "invoice_overdue", subject: "Invoice {{number}} is overdue", body: "Hi {{name}},\n\nInvoice {{number}} ({{amount}}) is now overdue. You can pay securely here: {{pay_url}}\n\n— Nord Harton" },
];
