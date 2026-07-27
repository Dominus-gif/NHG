// Shared types + demo data for the Client Portal. Demo data renders when
// Supabase isn't configured (or on the ?demo=1 preview) so the dashboard is
// fully viewable before the backend is wired up.

export type ClientProfile = {
  client_id: string;
  name: string;
  company: string;
  crm_name: string;
  crm_role: string;
  crm_email: string;
  crm_phone: string;
  crm_telegram: string; // @username, used for the "Open in Telegram" deep link
};

export type Service = {
  id: string;
  name: string;
  description: string;
  status: "Active" | "In progress" | "Planning" | "Completed" | "On hold";
};

export type Task = {
  id: string;
  title: string;
  service: string;
  status: "Not started" | "In progress" | "In review" | "Blocked" | "Done";
  progress: number; // 0–100
};

export type DocItem = {
  id: string;
  title: string;
  kind: string; // e.g. "PDF", "Figma", "Repo", "Spec"
  service: string;
  url: string;
  released?: boolean; // CRM can release a doc regardless of payment status
};

export type Invoice = {
  id: string;
  number: string;
  amount: number;
  currency: string; // e.g. "USD"
  status: "paid" | "pending" | "overdue";
  issued: string;
  due: string;
  pay_url?: string; // hosted payment link (Stripe, etc.)
};

export type Message = {
  id: string;
  sender: "client" | "crm";
  body: string;
  created_at: string;
};

export const DEMO_PROFILE: ClientProfile = {
  client_id: "NHG-2048",
  name: "Alex Morgan",
  company: "Vertex Retail Group",
  crm_name: "Elena Whitmore",
  crm_role: "Client Relationship Manager",
  crm_email: "elena.whitmore@nordhartongroup.com",
  crm_phone: "+44 20 7946 1180",
  crm_telegram: "@nhg_elena",
};

export const DEMO_SERVICES: Service[] = [
  { id: "s1", name: "Custom Web Application", description: "Multi-tenant commerce platform with a bespoke admin console and headless storefront.", status: "In progress" },
  { id: "s2", name: "Cloud & Infrastructure", description: "AWS architecture, CI/CD pipelines, observability, and a zero-downtime deployment setup.", status: "Active" },
  { id: "s3", name: "Web Experience & Branding", description: "Marketing site redesign and a reusable design system aligned to the new brand.", status: "Planning" },
];

export const DEMO_TASKS: Task[] = [
  { id: "t1", title: "Storefront checkout rebuild", service: "Custom Web Application", status: "In progress", progress: 65 },
  { id: "t2", title: "Admin console — inventory module", service: "Custom Web Application", status: "In review", progress: 90 },
  { id: "t3", title: "Production CI/CD pipeline", service: "Cloud & Infrastructure", status: "Done", progress: 100 },
  { id: "t4", title: "Observability & alerting", service: "Cloud & Infrastructure", status: "In progress", progress: 40 },
  { id: "t5", title: "Design system foundations", service: "Web Experience & Branding", status: "Not started", progress: 0 },
];

export const DEMO_DOCS: DocItem[] = [
  { id: "d1", title: "Solution Architecture (v3)", kind: "PDF", service: "Custom Web Application", url: "#", released: true },
  { id: "d2", title: "API Reference & Contracts", kind: "Spec", service: "Custom Web Application", url: "#", released: false },
  { id: "d3", title: "Staging Environment", kind: "Link", service: "Cloud & Infrastructure", url: "#", released: true },
  { id: "d4", title: "Infrastructure Diagram", kind: "PDF", service: "Cloud & Infrastructure", url: "#", released: false },
  { id: "d5", title: "Brand & UI Kit", kind: "Figma", service: "Web Experience & Branding", url: "#", released: false },
];

export const DEMO_INVOICES: Invoice[] = [
  { id: "i1", number: "INV-1042", amount: 24000, currency: "USD", status: "paid", issued: "Apr 1, 2026", due: "Apr 15, 2026" },
  { id: "i2", number: "INV-1067", amount: 18500, currency: "USD", status: "pending", issued: "Jun 1, 2026", due: "Jun 30, 2026", pay_url: "#" },
  { id: "i3", number: "INV-1071", amount: 9200, currency: "USD", status: "overdue", issued: "May 5, 2026", due: "May 20, 2026", pay_url: "#" },
];

export const DEMO_MESSAGES: Message[] = [
  { id: "m1", sender: "crm", body: "Hi Alex — the checkout rebuild is on track for next week. I'll share a staging link shortly.", created_at: "2026-07-05T09:12:00Z" },
  { id: "m2", sender: "client", body: "Great, thanks Elena. Can we also review the inventory module together?", created_at: "2026-07-05T09:20:00Z" },
  { id: "m3", sender: "crm", body: "Absolutely — I'll set up a call and drop the notes in your documents.", created_at: "2026-07-05T09:24:00Z" },
];

export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}
