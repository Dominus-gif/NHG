-- ============================================================================
-- Nord Harton Group — Client Portal schema
-- Run in Supabase → SQL Editor. Creates the portal tables, locks them down with
-- Row Level Security (each client can read ONLY their own rows), and leaves all
-- writes to the server (service role). Identity is handled by Supabase Auth.
-- ============================================================================

-- Client profile — one row per authenticated client (id = auth user id).
create table if not exists public.portal_clients (
  id                     uuid primary key references auth.users(id) on delete cascade,
  created_at             timestamptz not null default now(),
  client_id              text unique not null,          -- e.g. "NHG-2048" (shown at login)
  name                   text not null,
  company                text,
  crm_name               text,
  crm_role               text default 'Client Relationship Manager',
  crm_email              text,
  crm_phone              text,
  crm_telegram           text,                          -- @username (deep link)
  crm_telegram_chat_id   text                           -- numeric chat id (server-only; used to forward chat)
);

create table if not exists public.portal_services (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid not null references public.portal_clients(id) on delete cascade,
  name         text not null,
  description  text,
  status       text default 'Active'
);

create table if not exists public.portal_tasks (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid not null references public.portal_clients(id) on delete cascade,
  title        text not null,
  service      text,
  status       text default 'In progress',
  progress     int  default 0 check (progress between 0 and 100)
);

create table if not exists public.portal_documents (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid not null references public.portal_clients(id) on delete cascade,
  title        text not null,
  kind         text default 'Link',
  service      text,
  url          text,
  released     boolean not null default false   -- CRM can release a doc regardless of payment status
);
-- If the table already existed, add the column:
alter table public.portal_documents add column if not exists released boolean not null default false;

create table if not exists public.portal_invoices (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid not null references public.portal_clients(id) on delete cascade,
  number       text not null,
  service      text,                                     -- what the invoice is for
  amount       numeric not null default 0,
  currency     text default 'USD',
  status       text default 'pending',                  -- 'paid' | 'pending' | 'overdue'
  issued       text,
  due          text,
  paid_on      text,                                     -- date the invoice was paid (ISO or readable)
  pay_url      text                                      -- Dodo Payments checkout link, shown as "Pay now"
);
-- If the table already existed, add the new columns:
alter table public.portal_invoices add column if not exists service text;
alter table public.portal_invoices add column if not exists paid_on text;
alter table public.portal_invoices add column if not exists pay_url text;

create table if not exists public.portal_messages (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid not null references public.portal_clients(id) on delete cascade,
  sender       text not null default 'client',          -- 'client' | 'crm'
  body         text not null,
  created_at   timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Row Level Security: a signed-in client can SELECT only their own rows.
-- All inserts/updates happen on the server with the service role (which
-- bypasses RLS), so no write policies are granted to clients.
-- ----------------------------------------------------------------------------
alter table public.portal_clients   enable row level security;
alter table public.portal_services  enable row level security;
alter table public.portal_tasks     enable row level security;
alter table public.portal_documents enable row level security;
alter table public.portal_invoices  enable row level security;
alter table public.portal_messages  enable row level security;

drop policy if exists "client reads own profile" on public.portal_clients;
create policy "client reads own profile" on public.portal_clients
  for select to authenticated using (auth.uid() = id);

drop policy if exists "client reads own services" on public.portal_services;
create policy "client reads own services" on public.portal_services
  for select to authenticated using (auth.uid() = client_id);

drop policy if exists "client reads own tasks" on public.portal_tasks;
create policy "client reads own tasks" on public.portal_tasks
  for select to authenticated using (auth.uid() = client_id);

drop policy if exists "client reads own documents" on public.portal_documents;
create policy "client reads own documents" on public.portal_documents
  for select to authenticated using (auth.uid() = client_id);

drop policy if exists "client reads own invoices" on public.portal_invoices;
create policy "client reads own invoices" on public.portal_invoices
  for select to authenticated using (auth.uid() = client_id);

drop policy if exists "client reads own messages" on public.portal_messages;
create policy "client reads own messages" on public.portal_messages
  for select to authenticated using (auth.uid() = client_id);

-- ============================================================================
-- Onboarding a client (do this per client):
--   1) Authentication → Users → Add user. Set the email to
--      "<client-id>@clients.nordhartongroup.com" (e.g. nhg-2048@clients.nordhartongroup.com)
--      and a password. Copy the new user's UID.
--   2) Insert their profile + data, using that UID as portal_clients.id:
--
--   insert into public.portal_clients
--     (id, client_id, name, company, crm_name, crm_email, crm_phone, crm_telegram, crm_telegram_chat_id)
--   values
--     ('<AUTH-USER-UID>', 'NHG-2048', 'Alex Morgan', 'Vertex Retail Group',
--      'Elena Whitmore', 'elena.whitmore@nordhartongroup.com', '+44 20 7946 1180',
--      '@nhg_elena', '123456789');
--
--   insert into public.portal_services (client_id, name, description, status) values
--     ('<AUTH-USER-UID>', 'Custom Web Application', 'Commerce platform + admin console', 'In progress');
--   -- ...and rows in portal_tasks / portal_documents / portal_invoices as needed.
-- ============================================================================
