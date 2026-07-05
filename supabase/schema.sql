-- ============================================================================
-- Lynstad Group — Supabase schema
-- Run this in your Supabase project: SQL Editor → New query → paste → Run.
-- It creates the two tables, locks them down with Row Level Security (public
-- can only INSERT, never read), and creates a private "resumes" storage bucket.
-- ============================================================================

-- 1) Consultation requests — the "Get Started" / Request a consultation form
create table if not exists public.consultation_requests (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  full_name         text not null,
  work_email        text not null,
  company           text,
  job_title         text,
  project_domain    text,
  company_size      text,
  global_presence   text,
  industry          text,
  estimated_budget  text,
  project_details   text
);

-- 2) Job applications — the Careers "Apply now" form
create table if not exists public.job_applications (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  role          text not null,          -- the position applied for
  full_name     text not null,
  email         text not null,
  country       text,
  dial_code     text,                   -- e.g. "+1"
  phone         text,
  experience    text,                   -- e.g. "3–5 years"
  resume_path   text                    -- object path inside the "resumes" bucket
);

-- 3) Email leads — the homepage hero "Enter your work email → Get Started"
create table if not exists public.email_leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  email       text not null,
  source      text                    -- e.g. "homepage_hero"
);

-- ----------------------------------------------------------------------------
-- Row Level Security: allow the anon (public) key to INSERT only.
-- Nobody using the public key can read, update, or delete rows. You read
-- submissions in the Supabase dashboard (Table editor) or with the service key.
-- ----------------------------------------------------------------------------
alter table public.consultation_requests enable row level security;
alter table public.job_applications      enable row level security;
alter table public.email_leads           enable row level security;

drop policy if exists "anon can submit consultations" on public.consultation_requests;
create policy "anon can submit consultations"
  on public.consultation_requests
  for insert to anon
  with check (true);

drop policy if exists "anon can submit applications" on public.job_applications;
create policy "anon can submit applications"
  on public.job_applications
  for insert to anon
  with check (true);

drop policy if exists "anon can submit email leads" on public.email_leads;
create policy "anon can submit email leads"
  on public.email_leads
  for insert to anon
  with check (true);

-- ----------------------------------------------------------------------------
-- Storage: a PRIVATE bucket for uploaded resumes.
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

-- Allow the anon key to upload (INSERT) into the resumes bucket only.
-- No public read policy is added, so resumes stay private — download them from
-- the dashboard (Storage → resumes) or via the service key.
drop policy if exists "anon can upload resumes" on storage.objects;
create policy "anon can upload resumes"
  on storage.objects
  for insert to anon
  with check (bucket_id = 'resumes');
