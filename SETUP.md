# Lynstad Group — Setup & Deployment

Next.js 16 app. Form submissions are saved to **Supabase** through server-side
**API routes** (`/api/lead`, `/api/consultation`, `/api/application`) that use the
Supabase **service-role key**. Because the service role bypasses Row Level
Security, saving works as long as (a) the tables exist and (b) the two server
env vars are set. Resumes are uploaded to a private Storage bucket.

---

## 1. What you create in Supabase (once)

1. **Create a project** at <https://supabase.com>.
2. **Create the tables + bucket:** open **SQL Editor → New query**, paste all of
   [`supabase/schema.sql`](supabase/schema.sql), and click **Run**. This creates
   `consultation_requests`, `job_applications`, `email_leads`, and the private
   `resumes` bucket. (Safe to re-run.)
3. **Get your keys:** **Settings → API** and copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role** secret key → `SUPABASE_SERVICE_ROLE_KEY`

   > The service-role key is a **secret**. It's only ever used on the server (API
   > routes). Never expose it in the browser and never prefix it with
   > `NEXT_PUBLIC`.

---

## 2. Deploy on Vercel  ← do this to make saving work

1. In Vercel → your project → **Settings → Environment Variables**, add **both**:
   | Name | Value |
   |------|-------|
   | `SUPABASE_URL` | `https://YOUR-REF.supabase.co` |
   | `SUPABASE_SERVICE_ROLE_KEY` | your service-role secret |

   Add them for **Production** (and Preview if you use preview deploys).
2. **Redeploy** — env vars are only applied on a new build. Push a commit or click
   **Redeploy** in the Deployments tab. (Adding vars without redeploying is the
   #1 reason it "still doesn't save.")

### Verify it's configured
Open **`https://YOUR-SITE.vercel.app/api/health`**. You should see:

```json
{ "hasUrl": true, "hasServiceRoleKey": true }
```

- If either is `false`, the env var isn't set for that environment → fix in
  Settings and redeploy.
- If both are `true` but a form still errors, the message shown in the form now
  tells you exactly why (e.g. a missing table means you didn't run the SQL).

---

## 3. Where submissions land

- Consultation requests → Table editor → `consultation_requests`
- Job applications → Table editor → `job_applications` (`resume_path` → file)
- Homepage emails → Table editor → `email_leads`
- Resumes → Storage → `resumes` bucket

---

## 4. Local development

```bash
cp .env.local.example .env.local   # fill in SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
npm install
npm run dev                         # restart after editing .env.local
```

If the env vars aren't set, forms return a clear "Server not configured" error
so you always know why nothing saved.

---

## 5. Optional: email notifications

To get an email on each submission, add a Supabase **Database Webhook** (or an
Edge Function) on inserts to the tables — configured entirely in Supabase, no
code change needed.

---

## 6. Client Portal (Supabase-backed — no demo mode)

The portal lives at **`/portal`** (sign in) → **`/portal/dashboard`** and
`/portal/payments`. It reads entirely from Supabase — every client only sees
their own data. There is no demo mode: without Supabase configured, the login
page simply says the portal is being set up.

### One-time setup
1. **Run the schema** — Supabase → SQL Editor → paste `supabase/portal_schema.sql`
   and Run. Creates `portal_clients`, `portal_services`, `portal_tasks`,
   `portal_documents`, `portal_invoices`, `portal_messages` with RLS.
2. **Set the four env vars** (Vercel → Settings → Environment Variables), then
   **redeploy**:
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (server — forms + chat)
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (browser — portal login + data)

### Test account (ready to use)
1. Supabase → **Authentication → Users → Add user** →
   email `nhg-1001@clients.nordhartongroup.com`, password `NordHarton#Test1`
   (tick *Auto Confirm User*).
2. Supabase → **SQL Editor** → paste `supabase/seed_test_client.sql` → Run.
   It links a full sample workspace (services, tasks, documents, and 7 invoices)
   to that user by email — no UID copying.
3. Sign in at **`/portal`** with **Client ID `NHG-1001`** and password
   **`NordHarton#Test1`**.

### Onboard a real client (repeat per client you engage)
1. **Authentication → Add user**: email `<client-id>@clients.nordhartongroup.com`
   (e.g. `nhg-2048@clients...`) + a password. The client logs in with the
   **Client ID** (`NHG-2048`) + that password.
2. Insert their profile + data by email (copy the pattern in
   `supabase/seed_test_client.sql` — no UID needed). Put real **Dodo Payments**
   links in each unpaid invoice's `pay_url`.

### Telegram CRM chat
1. Create a bot with **@BotFather**, set `TELEGRAM_BOT_TOKEN`.
2. Put the CRM's Telegram **numeric chat id** in `portal_clients.crm_telegram_chat_id`
   (the CRM messages the bot once; get the id from
   `https://api.telegram.org/bot<TOKEN>/getUpdates`). Client messages are forwarded
   to that chat, tagged with the client's `#NHG-XXXX`.
3. To let CRM replies flow back into the portal, register the webhook once:
   `https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://YOUR-SITE/api/telegram/webhook&secret_token=<TELEGRAM_WEBHOOK_SECRET>`
   The CRM replies by **replying** to the forwarded message (or including the
   client's `#NHG-XXXX` tag); the reply appears in that client's portal chat.
