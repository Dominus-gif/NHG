-- ============================================================================
-- Add client "BHX"  (login: Client ID = BHX, password you set below)
--
-- STEP 1 — Supabase → Authentication → Users → Add user:
--     Email:    bhx@clients.nordhartongroup.com
--     Password: 101test
--     ✅ tick "Auto Confirm User"
--
-- STEP 2 — Supabase → SQL Editor → paste this whole file → Run.
--     (Requires portal_schema.sql to have been run once already.)
--
-- The client then signs in at /portal with:  Client ID  BHX   /   password 101test
-- Edit the sample rows below to match this client's real engagement.
-- ============================================================================

-- Profile --------------------------------------------------------------------
insert into public.portal_clients
  (id, client_id, name, company, crm_name, crm_role, crm_email, crm_phone, crm_telegram, crm_telegram_chat_id)
select u.id, 'BHX', 'BHX Client', 'BHX Holdings',
       'Marcus Reed', 'Client Relationship Manager',
       'marcus.reed@nordhartongroup.com', '+44 20 7946 2210', '@nhg_marcus', null
from auth.users u
where u.email = 'bhx@clients.nordhartongroup.com'
on conflict (id) do update set
  client_id = excluded.client_id, name = excluded.name, company = excluded.company,
  crm_name = excluded.crm_name, crm_role = excluded.crm_role,
  crm_email = excluded.crm_email, crm_phone = excluded.crm_phone,
  crm_telegram = excluded.crm_telegram;

-- Clean re-run ---------------------------------------------------------------
delete from public.portal_services  where client_id in (select id from auth.users where email = 'bhx@clients.nordhartongroup.com');
delete from public.portal_tasks     where client_id in (select id from auth.users where email = 'bhx@clients.nordhartongroup.com');
delete from public.portal_documents where client_id in (select id from auth.users where email = 'bhx@clients.nordhartongroup.com');
delete from public.portal_invoices  where client_id in (select id from auth.users where email = 'bhx@clients.nordhartongroup.com');
delete from public.portal_messages  where client_id in (select id from auth.users where email = 'bhx@clients.nordhartongroup.com');

-- Services -------------------------------------------------------------------
insert into public.portal_services (client_id, name, description, status)
select u.id, v.name, v.description, v.status
from auth.users u,
     (values
       ('Custom Web Application','Customer portal and internal operations dashboard.','In progress'),
       ('Cloud & Infrastructure','Cloud migration, CI/CD, and monitoring.','Active')
     ) as v(name, description, status)
where u.email = 'bhx@clients.nordhartongroup.com';

-- Tasks ----------------------------------------------------------------------
insert into public.portal_tasks (client_id, title, service, status, progress)
select u.id, v.title, v.service, v.status, v.progress
from auth.users u,
     (values
       ('Portal MVP','Custom Web Application','In progress',55),
       ('Cloud migration','Cloud & Infrastructure','In review',80),
       ('Monitoring & alerts','Cloud & Infrastructure','Not started',0)
     ) as v(title, service, status, progress)
where u.email = 'bhx@clients.nordhartongroup.com';

-- Documents (released = visible now; unreleased unlock after payment) ---------
insert into public.portal_documents (client_id, title, kind, service, url, released)
select u.id, v.title, v.kind, v.service, v.url, v.released
from auth.users u,
     (values
       ('Project Plan','PDF','Custom Web Application','https://example.com/doc',true),
       ('Architecture Overview','PDF','Cloud & Infrastructure','https://example.com/doc',false)
     ) as v(title, kind, service, url, released)
where u.email = 'bhx@clients.nordhartongroup.com';

-- Invoices (put real Dodo Payments links in pay_url for unpaid ones) ----------
insert into public.portal_invoices (client_id, number, service, amount, currency, status, issued, due, paid_on, pay_url)
select u.id, v.number, v.service, v.amount, v.currency, v.status, v.issued, v.due, v.paid_on, v.pay_url
from auth.users u,
     (values
       ('BHX-0001','Custom Web Application',12000,'USD','paid','May 1, 2026','May 15, 2026','2026-05-13',null),
       ('BHX-0002','Cloud & Infrastructure',9500,'USD','pending','Jun 10, 2026','Jul 10, 2026',null,'https://checkout.dodopayments.com/REPLACE_ME')
     ) as v(number, service, amount, currency, status, issued, due, paid_on, pay_url)
where u.email = 'bhx@clients.nordhartongroup.com';

-- Welcome message ------------------------------------------------------------
insert into public.portal_messages (client_id, sender, body)
select u.id, 'crm', 'Welcome to your Nord Harton workspace. Track progress, download released documents, pay invoices, and message me here anytime.'
from auth.users u
where u.email = 'bhx@clients.nordhartongroup.com';
