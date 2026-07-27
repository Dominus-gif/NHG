import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Telegram webhook. Set it once with:
 *   https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://YOUR-SITE/api/telegram/webhook&secret_token=<SECRET>
 *
 * A CRM replies to a client by replying to the forwarded message (or by
 * including the client's #NHG-XXXX tag). We extract that tag, map it to the
 * client, and store the reply so the client sees it in their portal chat.
 */
export async function POST(req: Request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret && req.headers.get("x-telegram-bot-api-secret-token") !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let update: { message?: { text?: string; reply_to_message?: { text?: string } } };
  try {
    update = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const msg = update.message;
  const text = (msg?.text || "").trim();
  const context = `${text} ${msg?.reply_to_message?.text || ""}`;
  if (!text) return NextResponse.json({ ok: true });

  // Find the client tag, e.g. "#NHG-2048" (matched loosely).
  const match = context.match(/#([A-Za-z0-9]+-?[A-Za-z0-9]+)/);
  const clientId = match?.[1];
  if (!clientId) return NextResponse.json({ ok: true }); // nothing to route

  const admin = getAdminClient();
  if (!admin) return NextResponse.json({ ok: true });

  const { data: client } = await admin
    .from("portal_clients")
    .select("id")
    .eq("client_id", clientId)
    .single();
  if (!client) return NextResponse.json({ ok: true });

  // Store the CRM reply (strip the routing tag from the visible body).
  const body = text.replace(/#([A-Za-z0-9]+-?[A-Za-z0-9]+)/g, "").trim();
  if (body) {
    await admin.from("portal_messages").insert({ client_id: client.id, sender: "crm", body });
  }

  return NextResponse.json({ ok: true });
}
