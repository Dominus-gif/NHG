-- ============================================================================
-- Nord Harton Group — TEST CLIENT seed
--
-- STEP 1 (do this first, in the Supabase dashboard):
--   Authentication → Users → Add user
--     Email:    nhg-1001@clients.nordhartongroup.com
--     Password: NordHarton#Test1        (or your own; this is the login password)
--   Tick "Auto Confirm User".
--
-- STEP 2: run supabase/portal_schema.sql once (creates the tables), then run
--   this whole file. It links the profile + sample data to that auth user by
--   email, so you never have to copy a UID. Safe to re-run.
--
-- The client then signs in at /portal with:
--     Client ID:  NHG-1001
--     Password:   (whatever you set above)
-- ============================================================================

-- Profile (upsert on the auth user's id) ------------------------------------
insert into public.portal_clients
  (id, client_id, name, company, crm_name, crm_role, crm_email, crm_phone, crm_telegram, crm_telegram_chat_id)
select u.id, 'NHG-1001', 'Alex Morgan', 'Vertex Retail Group',
       'Elena Whitmore', 'Client Relationship Manager',
       'elena.whitmore@nordhartongroup.com', '+44 20 7946 1180', '@nhg_elena', null
from auth.users u
where u.email = 'nhg-1001@clients.nordhartongroup.com'
on conflict (id) do update set
  client_id = excluded.client_id, name = excluded.name, company = excluded.company,
  crm_name = excluded.crm_name, crm_role = excluded.crm_role,
  crm_email = excluded.crm_email, crm_phone = excluded.crm_phone,
  crm_telegram = excluded.crm_telegram;

-- Clear existing sample rows so re-running stays clean -----------------------
delete from public.portal_services  where client_id in (select id from auth.users where email = 'nhg-1001@clients.nordhartongroup.com');
delete from public.portal_tasks     where client_id in (select id from auth.users where email = 'nhg-1001@clients.nordhartongroup.com');
delete from public.portal_documents where client_id in (select id from auth.users where email = 'nhg-1001@clients.nordhartongroup.com');
delete from public.portal_invoices  where client_id in (select id from auth.users where email = 'nhg-1001@clients.nordhartongroup.com');
delete from public.portal_messages  where client_id in (select id from auth.users where email = 'nhg-1001@clients.nordhartongroup.com');

-- Services -------------------------------------------------------------------
insert into public.portal_services (client_id, name, description, status)
select u.id, v.name, v.description, v.status
from auth.users u,
     (values
       ('Custom Web Application','Multi-tenant commerce platform with a bespoke admin console and headless storefront.','In progress'),
       ('Cloud & Infrastructure','AWS architecture, CI/CD pipelines, observability, and a zero-downtime deployment setup.','Active'),
       ('Web Experience & Branding','Marketing site redesign and a reusable design system aligned to the new brand.','Planning')
     ) as v(name, description, status)
where u.email = 'nhg-1001@clients.nordhartongroup.com';

-- Tasks ----------------------------------------------------------------------
insert into public.portal_tasks (client_id, title, service, status, progress)
select u.id, v.title, v.service, v.status, v.progress
from auth.users u,
     (values
       ('Storefront checkout rebuild','Custom Web Application','In progress',65),
       ('Admin console — inventory module','Custom Web Application','In review',90),
       ('Production CI/CD pipeline','Cloud & Infrastructure','Done',100),
       ('Observability & alerting','Cloud & Infrastructure','In progress',40),
       ('Design system foundations','Web Experience & Branding','Not started',0)
     ) as v(title, service, status, progress)
where u.email = 'nhg-1001@clients.nordhartongroup.com';

-- Documents (released = visible; unreleased locks until invoices are paid) ----
insert into public.portal_documents (client_id, title, kind, service, url, released)
select u.id, v.title, v.kind, v.service, v.url, v.released
from auth.users u,
     (values
       ('Solution Architecture (v3)','PDF','Custom Web Application','https://example.com/doc',true),
       ('API Reference & Contracts','Spec','Custom Web Application','https://example.com/doc',false),
       ('Staging Environment','Link','Cloud & Infrastructure','https://example.com/doc',true),
       ('Infrastructure Diagram','PDF','Cloud & Infrastructure','https://example.com/doc',false),
       ('Brand & UI Kit','Figma','Web Experience & Branding','https://example.com/doc',false)
     ) as v(title, kind, service, url, released)
where u.email = 'nhg-1001@clients.nordhartongroup.com';

-- Invoices (replace pay_url with real Dodo Payments links) -------------------
insert into public.portal_invoices (client_id, number, service, amount, currency, status, issued, due, paid_on, pay_url)
select u.id, v.number, v.service, v.amount, v.currency, v.status, v.issued, v.due, v.paid_on, v.pay_url
from auth.users u,
     (values
       ('INV-1001','Custom Web Application',15000,'USD','paid','Jul 28, 2025','Aug 11, 2025','2025-08-08',null),
       ('INV-1012','Cloud & Infrastructure',12000,'USD','paid','Sep 20, 2025','Oct 4, 2025','2025-10-02',null),
       ('INV-1025','Custom Web Application',20000,'USD','paid','Nov 30, 2025','Dec 14, 2025','2025-12-11',null),
       ('INV-1041','Web Experience & Branding',8000,'USD','paid','Jan 20, 2026','Feb 3, 2026','2026-02-02',null),
       ('INV-1042','Custom Web Application',24000,'USD','paid','Apr 1, 2026','Apr 15, 2026','2026-04-12',null),
       ('INV-1067','Cloud & Infrastructure',18500,'USD','pending','Jun 1, 2026','Jun 30, 2026',null,'https://checkout.dodopayments.com/REPLACE_ME'),
       ('INV-1071','Custom Web Application',9200,'USD','overdue','May 5, 2026','May 20, 2026',null,'https://checkout.dodopayments.com/REPLACE_ME')
     ) as v(number, service, amount, currency, status, issued, due, paid_on, pay_url)
where u.email = 'nhg-1001@clients.nordhartongroup.com';

-- A welcome message from the CRM --------------------------------------------
insert into public.portal_messages (client_id, sender, body)
select u.id, 'crm', 'Hi Alex — welcome to your Nord Harton workspace. You can track progress, download released documents, pay invoices, and message me right here anytime.'
from auth.users u
where u.email = 'nhg-1001@clients.nordhartongroup.com';
