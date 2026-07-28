"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import {
  formatMoney,
  type ClientProfile, type Service, type Task, type DocItem, type Invoice, type Message,
} from "@/lib/portal";

type Tone = "green" | "amber" | "red" | "muted";

function toneFor(status: string): Tone {
  const s = status.toLowerCase();
  if (["paid", "done", "completed", "active"].includes(s)) return "green";
  if (["pending", "in progress", "in review", "planning"].includes(s)) return "amber";
  if (["overdue", "blocked", "on hold"].includes(s)) return "red";
  return "muted";
}

const toneStyles: Record<Tone, string> = {
  green: "bg-[color:var(--success-soft)] text-[color:var(--success)]",
  amber: "bg-[color:var(--warning-soft)] text-[color:var(--warning)]",
  red: "bg-[color:var(--danger-soft)] text-[color:var(--danger)]",
  muted: "bg-surface-subtle text-fg-muted",
};

function Badge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${toneStyles[toneFor(status)]}`}>
      {status}
    </span>
  );
}

function Card({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-hairline bg-elevated/60 p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-fg-subtle">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function LockGlyph() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

export default function PortalDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const sb = getSupabaseBrowser();
    if (!sb) {
      router.replace("/portal");
      return;
    }
    (async () => {
      const { data: { session } } = await sb.auth.getSession();
      if (!session) {
        router.replace("/portal");
        return;
      }
      setToken(session.access_token);
      const uid = session.user.id;
      const [prof, svc, tsk, doc, inv, msg] = await Promise.all([
        sb.from("portal_clients").select("client_id, name, company, crm_name, crm_role, crm_email, crm_phone").eq("id", uid).single(),
        sb.from("portal_services").select("*").eq("client_id", uid),
        sb.from("portal_tasks").select("*").eq("client_id", uid).order("progress", { ascending: false }),
        sb.from("portal_documents").select("*").eq("client_id", uid),
        sb.from("portal_invoices").select("*").eq("client_id", uid),
        sb.from("portal_messages").select("*").eq("client_id", uid).order("created_at", { ascending: true }),
      ]);
      setProfile((prof.data as ClientProfile) ?? null);
      setServices((svc.data as Service[]) ?? []);
      setTasks((tsk.data as Task[]) ?? []);
      setDocs((doc.data as DocItem[]) ?? []);
      setInvoices((inv.data as Invoice[]) ?? []);
      setMessages((msg.data as Message[]) ?? []);
      setLoading(false);
    })();
  }, [router]);

  // Poll for new CRM replies while the chat is open.
  useEffect(() => {
    if (!chatOpen) return;
    const sb = getSupabaseBrowser();
    if (!sb) return;
    const id = setInterval(async () => {
      const { data: { session } } = await sb.auth.getSession();
      if (!session) return;
      const { data } = await sb
        .from("portal_messages")
        .select("*")
        .eq("client_id", session.user.id)
        .order("created_at", { ascending: true });
      if (data) setMessages(data as Message[]);
    }, 8000);
    return () => clearInterval(id);
  }, [chatOpen]);

  const signOut = async () => {
    const sb = getSupabaseBrowser();
    if (sb) await sb.auth.signOut();
    router.replace("/portal");
  };

  const sendMessage = async () => {
    const text = chatInput.trim();
    if (!text) return;
    const optimistic: Message = {
      id: crypto.randomUUID(),
      sender: "client",
      body: text,
      created_at: new Date().toISOString(),
    };
    setMessages((m) => [...m, optimistic]);
    setChatInput("");
    setSending(true);
    try {
      await fetch("/api/portal/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token ?? ""}` },
        body: JSON.stringify({ message: text }),
      });
    } catch {
      /* optimistic message stays; a poll will reconcile */
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-sm text-fg-muted">Loading your portal…</div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-xl font-semibold">No workspace found</h1>
        <p className="text-sm text-fg-muted">
          Your account is signed in, but no client record is linked to it yet. Please contact your relationship manager.
        </p>
        <button onClick={signOut} className="rounded-full border border-hairline-strong px-4 py-2 text-sm text-fg transition hover:border-accent">
          Sign out
        </button>
      </div>
    );
  }

  const p = profile;
  const openInvoices = invoices.filter((i) => i.status !== "paid");
  const outstanding = openInvoices.reduce((sum, i) => sum + i.amount, 0);
  const paidUp = outstanding <= 0; // documents unlock when nothing is outstanding (or when the CRM releases them)

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-28 lg:px-12">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-hairline pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Client Portal</span>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Welcome back, {p.name}</h1>
          <p className="mt-1 text-sm text-fg-muted">
            {p.company} · Client ID <span className="font-mono text-fg">{p.client_id}</span>
          </p>
        </div>
        <button
          onClick={signOut}
          className="self-start rounded-full border border-hairline-strong px-4 py-2 text-sm text-fg transition hover:border-accent sm:self-auto"
        >
          Sign out
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Left column — relationship manager + payments */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <Card title="Your relationship manager">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-surface-subtle text-lg font-semibold text-fg">
                {p.crm_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </span>
              <div>
                <p className="font-semibold text-fg">{p.crm_name}</p>
                <p className="text-xs text-fg-subtle">{p.crm_role}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-2 text-sm">
              <a href={`mailto:${p.crm_email}`} className="text-fg-muted transition hover:text-accent">{p.crm_email}</a>
              <a href={`tel:${p.crm_phone.replace(/\s/g, "")}`} className="text-fg-muted transition hover:text-accent">{p.crm_phone}</a>
            </div>
            <button
              onClick={() => setChatOpen(true)}
              className="mt-6 w-full rounded-full bg-white py-3 text-sm font-semibold text-[#0E0E0E] transition hover:bg-[#ECECEC]"
            >
              Chat with {p.crm_name.split(" ")[0]}
            </button>
            <p className="mt-3 text-center text-xs text-fg-subtle">
              Secure direct messaging — typically replies within a few hours.
            </p>
          </Card>

          <Card
            title="Invoices & payments"
            action={<span className="text-xs text-fg-subtle">Outstanding: <span className="font-mono text-fg">{formatMoney(outstanding, invoices[0]?.currency ?? "USD")}</span></span>}
          >
            <div className="flex flex-col gap-4">
              {openInvoices.map((inv) => (
                <div key={inv.id} className="rounded-xl border border-hairline bg-surface/50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-sm text-fg">{inv.number}</p>
                      <p className="text-xs text-fg-subtle">Due {inv.due}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm text-fg">{formatMoney(inv.amount, inv.currency)}</p>
                      <div className="mt-1"><Badge status={inv.status} /></div>
                    </div>
                  </div>
                  <a
                    href={inv.pay_url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 block rounded-full bg-white py-2 text-center text-xs font-semibold text-[#0E0E0E] transition hover:bg-[#ECECEC]"
                  >
                    Pay now
                  </a>
                </div>
              ))}
              {openInvoices.length === 0 && <p className="text-sm text-fg-muted">You&apos;re all paid up — no outstanding invoices.</p>}
              <Link href="/portal/payments" className="mt-1 text-center text-sm font-medium text-accent transition hover:underline">
                View payment history &amp; analysis →
              </Link>
            </div>
          </Card>
        </div>

        {/* Right column — services, progress, documents */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card title="Your services">
            <div className="grid gap-4 sm:grid-cols-2">
              {services.map((s) => (
                <div key={s.id} className="rounded-xl border border-hairline bg-surface/50 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-fg">{s.name}</h3>
                    <Badge status={s.status} />
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">{s.description}</p>
                </div>
              ))}
              {services.length === 0 && <p className="text-sm text-fg-muted">No services yet.</p>}
            </div>
          </Card>

          <Card title="Project progress">
            <div className="flex flex-col gap-5">
              {tasks.map((t) => (
                <div key={t.id}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-fg">{t.title}</p>
                      <p className="text-xs text-fg-subtle">{t.service}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge status={t.status} />
                      <span className="w-9 text-right font-mono text-xs text-fg-muted">{t.progress}%</span>
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-subtle">
                    <div className="h-full rounded-full bg-white transition-all duration-500" style={{ width: `${t.progress}%` }} />
                  </div>
                </div>
              ))}
              {tasks.length === 0 && <p className="text-sm text-fg-muted">No active tasks.</p>}
            </div>
          </Card>

          <Card
            title="Documents & deliverables"
            action={!paidUp ? <span className="inline-flex items-center gap-1 text-xs text-fg-subtle"><LockGlyph /> Locked until payment</span> : undefined}
          >
            <div className="divide-y divide-hairline">
              {docs.map((d) => {
                const unlocked = Boolean(d.released) || paidUp;
                return unlocked ? (
                  <a key={d.id} href={d.url} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium text-fg group-hover:text-accent">{d.title}</p>
                      <p className="text-xs text-fg-subtle">{d.service}</p>
                    </div>
                    <span className="rounded-md border border-hairline px-2 py-0.5 text-[11px] uppercase tracking-wide text-fg-subtle">{d.kind}</span>
                  </a>
                ) : (
                  <div key={d.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium text-fg-muted">{d.title}</p>
                      <p className="text-xs text-fg-subtle">{d.service} · unlocks when payment completes</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-hairline px-2 py-0.5 text-[11px] uppercase tracking-wide text-fg-subtle">
                      <LockGlyph /> Locked
                    </span>
                  </div>
                );
              })}
              {docs.length === 0 && <p className="text-sm text-fg-muted">No documents shared yet.</p>}
            </div>
          </Card>
        </div>
      </div>

      {chatOpen && (
        <ChatPanel
          crmName={p.crm_name}
          messages={messages}
          input={chatInput}
          setInput={setChatInput}
          onSend={sendMessage}
          onClose={() => setChatOpen(false)}
          sending={sending}
        />
      )}
    </div>
  );
}

function ChatPanel({
  crmName, messages, input, setInput, onSend, onClose, sending,
}: {
  crmName: string;
  messages: Message[];
  input: string;
  setInput: (v: string) => void;
  onSend: () => void;
  onClose: () => void;
  sending: boolean;
}) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div onClick={onClose} className="fixed inset-0 z-[120] flex justify-end bg-black/50 backdrop-blur-sm">
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-md flex-col border-l border-hairline bg-surface"
        style={{ animation: "slideIn .28s var(--ease-out)" }}
      >
        <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-fg">{crmName}</p>
            <p className="text-xs text-fg-subtle">Secure direct line</p>
          </div>
          <button onClick={onClose} aria-label="Close chat" className="rounded-lg border border-hairline p-2 text-fg-muted transition hover:text-fg">✕</button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender === "client" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.sender === "client" ? "bg-white text-[#0E0E0E]" : "bg-surface-subtle text-fg"
                }`}
              >
                {m.body}
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <p className="pt-10 text-center text-sm text-fg-muted">Start the conversation — your message goes straight to {crmName.split(" ")[0]}.</p>
          )}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); onSend(); }}
          className="flex items-center gap-2 border-t border-hairline p-4"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message…"
            className="lyn-field h-11 flex-1 rounded-full border border-hairline-strong bg-elevated px-4 text-sm text-fg outline-none focus:border-accent"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="h-11 shrink-0 rounded-full bg-white px-5 text-sm font-semibold text-[#0E0E0E] transition hover:bg-[#ECECEC] disabled:opacity-60"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
