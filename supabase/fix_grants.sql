-- ============================================================================
-- FIX: "permission denied for table ..."
--
-- This error is a Postgres GRANT (privilege) error — it happens BEFORE Row
-- Level Security is checked. RLS policies decide *which rows* a role may touch,
-- but the role still needs a base table GRANT to touch the table at all. If the
-- grants are missing, every insert/select fails with "permission denied".
--
-- Run this ONCE in Supabase → SQL Editor. It's safe and idempotent.
-- ============================================================================

grant usage on schema public to anon, authenticated, service_role;

-- Server (service role) writes all of these. Give it full access. -----------
grant select, insert, update, delete on public.consultation_requests to service_role;
grant select, insert, update, delete on public.job_applications      to service_role;
grant select, insert, update, delete on public.email_leads           to service_role;
grant select, insert, update, delete on public.portal_clients        to service_role;
grant select, insert, update, delete on public.portal_services       to service_role;
grant select, insert, update, delete on public.portal_tasks          to service_role;
grant select, insert, update, delete on public.portal_documents      to service_role;
grant select, insert, update, delete on public.portal_invoices       to service_role;
grant select, insert, update, delete on public.portal_messages       to service_role;

-- Safety net: if the app is (mis)configured to use the anon key for form
-- intake, these INSERTs are still gated to insert-only by the RLS policies. ---
grant insert on public.consultation_requests to anon, authenticated;
grant insert on public.job_applications      to anon, authenticated;
grant insert on public.email_leads           to anon, authenticated;

-- Signed-in clients read their own portal rows (RLS restricts to their rows) --
grant select on public.portal_clients   to authenticated;
grant select on public.portal_services  to authenticated;
grant select on public.portal_tasks     to authenticated;
grant select on public.portal_documents to authenticated;
grant select on public.portal_invoices  to authenticated;
grant select on public.portal_messages  to authenticated;

-- Make sure any tables created later inherit these grants too. ---------------
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant select on tables to authenticated;
