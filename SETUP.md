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

## 6. Client Portal (auth + dashboard + Telegram chat)

The portal lives at **`/portal`** (sign in) → **`/portal/dashboard`**. Until you
connect Supabase it runs in **demo mode** (sample data, viewable at
`/portal/dashboard?demo=1`).

### One-time setup
1. **Run the SQL** — Supabase → SQL Editor → paste `supabase/portal_schema.sql`
   and Run. Creates `portal_clients`, `portal_services`, `portal_tasks`,
   `portal_documents`, `portal_invoices`, `portal_messages` with RLS (each client
   can read only their own rows; all writes are server-side).
2. **Add the public env vars** (browser auth): `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Supabase → Settings → API). The server vars
   (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) are also required.

### Onboard a client
- Supabase → **Authentication → Users → Add user**. Set the email to
  `<client-id>@clients.nordhartongroup.com` (e.g. `nhg-2048@clients.nordhartongroup.com`)
  and a password. The client signs in with the **Client ID** (`NHG-2048`) + that password.
- Copy the new user's **UID**, then insert their profile + data rows using that UID
  as `portal_clients.id` (example inserts are at the bottom of `portal_schema.sql`).

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
