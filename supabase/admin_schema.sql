-- ============================================================================
-- Nord Harton — Admin Dashboard schema (Phase 1 foundation)
-- Run in Supabase → SQL Editor after portal_schema.sql.
--
-- Adds: a SEPARATE admin_users table (RBAC), a global service catalog, a
-- payments/transactions audit trail, in-app notifications, editable email
-- templates, an admin activity log, client status/industry columns, and a
-- private "documents" storage bucket for versioned tech docs.
--
-- All admin tables are locked with RLS and reachable ONLY via the service role
-- (i.e. from server API routes). No anon/authenticated policies are granted.
-- ============================================================================

-- 1) Admins — a dedicated identity store, separate from clients. -------------
--    An admin is a Supabase Auth user (real email + password) whose UID is
--    listed here. Server routes verify the caller's token, then confirm
--    membership in this table before doing anything privileged.
create table if not exists public.admin_users (
  id          uuid primary key references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  email       text not null,
  name        text,
  role        text not null default 'admin'   -- reserved for future finer roles
);

-- 2) Client management columns (for the searchable/filterable list). ---------
alter table public.portal_clients add column if not exists status   text not null default 'active';  -- 'active' | 'suspended'
alter table public.portal_clients add column if not exists industry text;

-- 2b) Document versioning columns (for the tech docs hub). --------------------
alter table public.portal_documents add column if not exists version      int not null default 1;
alter table public.portal_documents add column if not exists storage_path text;         -- object path in the 'documents' bucket
alter table public.portal_documents add column if not exists created_at    timestamptz not null default now();

-- 3) Global service catalog (name, description, price, billing cycle). -------
create table if not exists public.service_catalog (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text not null,
  description   text,
  price         numeric not null default 0,
  currency      text not null default 'USD',
  billing_cycle text not null default 'one_time',  -- 'one_time' | 'monthly' | 'quarterly' | 'yearly'
  active        boolean not null default true
);

-- 4) Payments / transactions audit trail. ------------------------------------
create table if not exists public.transactions (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  client_id   uuid references public.portal_clients(id)  on delete set null,
  invoice_id  uuid references public.portal_invoices(id) on delete set null,
  kind        text not null default 'payment',   -- 'payment' | 'refund' | 'invoice_created'
  provider    text,                              -- 'dodo' | 'stripe' | 'paypal' | 'manual'
  amount      numeric not null default 0,
  currency    text not null default 'USD',
  status      text not null default 'pending',   -- 'pending' | 'succeeded' | 'failed' | 'refunded'
  reference   text,                              -- provider checkout / payment id
  meta        jsonb
);

-- 5) In-app notifications. ---------------------------------------------------
create table if not exists public.notifications (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  type        text not null,                     -- 'client_onboarded' | 'invoice_paid' | 'invoice_overdue' | ...
  title       text not null,
  body        text,
  related_id  uuid,
  read        boolean not null default false
);

-- 6) Editable email templates. -----------------------------------------------
create table if not exists public.email_templates (
  key         text primary key,                  -- 'client_invite' | 'invoice_paid' | 'invoice_overdue'
  subject     text not null,
  body        text not null,
  updated_at  timestamptz not null default now()
);

-- 7) Admin activity / audit log (feeds the dashboard). -----------------------
create table if not exists public.admin_audit (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  admin_id    uuid references public.admin_users(id) on delete set null,
  action      text not null,                     -- 'client.created' | 'client.suspended' | 'invoice.created' | ...
  entity      text,                              -- 'client' | 'invoice' | 'service'
  entity_id   text,
  summary     text
);

-- 8) Task board / follow-ups (dashboard homepage). ---------------------------
create table if not exists public.admin_tasks (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  title       text not null,
  notes       text,
  category    text not null default 'task',      -- 'task' | 'follow_up' | 'invoice' | 'onboarding' | 'support'
  status      text not null default 'todo',      -- 'todo' | 'doing' | 'done'
  priority    text not null default 'medium',    -- 'low' | 'medium' | 'high'
  due_date    date,
  client_id   uuid references public.portal_clients(id) on delete set null
);
alter table public.admin_tasks enable row level security;
grant select, insert, update, delete on public.admin_tasks to service_role;

-- 9) Invoice payment-provider columns (Dodo Payments). -----------------------
alter table public.portal_invoices add column if not exists provider         text;   -- 'dodo' | 'manual'
alter table public.portal_invoices add column if not exists provider_session text;   -- Dodo checkout session id

-- 10) Soft-delete for invoices (restorable backup) + client notes. -----------
alter table public.portal_invoices add column if not exists deleted_at timestamptz;  -- set when "deleted"; row kept as backup
alter table public.portal_clients  add column if not exists notes      text;          -- internal onboarding notes

-- ----------------------------------------------------------------------------
-- Row Level Security: lock everything. With RLS enabled and NO policies for
-- anon/authenticated, only the service_role (server) can read or write these.
-- ----------------------------------------------------------------------------
alter table public.admin_users     enable row level security;
alter table public.service_catalog enable row level security;
alter table public.transactions    enable row level security;
alter table public.notifications   enable row level security;
alter table public.email_templates enable row level security;
alter table public.admin_audit     enable row level security;

-- ----------------------------------------------------------------------------
-- Storage: a PRIVATE bucket for versioned technical documents.
-- Objects are stored as documents/<client_id>/<service>/<version>/<filename>.
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- Grants — service role only for the admin tables.
-- ----------------------------------------------------------------------------
grant usage on schema public to service_role;
grant select, insert, update, delete on
  public.admin_users, public.service_catalog, public.transactions,
  public.notifications, public.email_templates, public.admin_audit
  to service_role;

-- ----------------------------------------------------------------------------
-- Seed default (editable) email templates.
-- ----------------------------------------------------------------------------
insert into public.email_templates (key, subject, body) values
  ('client_invite',  'Welcome to Nord Harton',
   E'Hi {{name}},\n\nYour client workspace is ready. Sign in with Client ID {{client_id}} using the temporary password provided, then set a new one.\n\n— Nord Harton'),
  ('invoice_paid',   'Payment received — {{number}}',
   E'Hi {{name}},\n\nWe have received your payment for invoice {{number}} ({{amount}}). Thank you.\n\n— Nord Harton'),
  ('invoice_overdue','Invoice {{number}} is overdue',
   E'Hi {{name}},\n\nInvoice {{number}} ({{amount}}) is now overdue. You can pay securely here: {{pay_url}}\n\n— Nord Harton')
on conflict (key) do nothing;

-- ============================================================================
-- Create the FIRST admin (run once, after this migration):
--   1) Supabase → Authentication → Users → Add user.
--      Use a real email + strong password (e.g. owner@nordharton.com). Copy UID.
--   2) Run:
--        insert into public.admin_users (id, email, name)
--        values ('<AUTH-USER-UID>', 'owner@nordharton.com', 'Owner');
--   That account can now sign in at /admin/login.
-- ============================================================================
