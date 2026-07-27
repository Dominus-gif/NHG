import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";

  let message = "";
  try {
    const body = await req.json();
    message = typeof body?.message === "string" ? body.message.trim() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!message) return NextResponse.json({ error: "Message is required." }, { status: 400 });

  const admin = getAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Server not configured (Supabase)." }, { status: 500 });
  }

  // Verify the caller's session and identify the client.
  const { data: userData, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !userData.user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const uid = userData.user.id;

  const { data: client } = await admin
    .from("portal_clients")
    .select("client_id, name, crm_telegram_chat_id")
    .eq("id", uid)
    .single();

  // Persist the client's message so it shows in their chat history.
  await admin.from("portal_messages").insert({ client_id: uid, sender: "client", body: message });

  // Forward to the assigned CRM on Telegram.
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = client?.crm_telegram_chat_id;
  let delivered = false;
  if (botToken && chatId) {
    const tag = client?.client_id ? `#${String(client.client_id).replace(/[^A-Za-z0-9_]/g, "")}` : "";
    const text = `📩 New message from ${client?.name ?? "a client"} ${tag}\n\n${message}\n\nReply to this message (or include ${tag}) to respond in the portal.`;
    try {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
      });
      delivered = res.ok;
    } catch {
      delivered = false;
    }
  }

  return NextResponse.json({ ok: true, delivered });
}
