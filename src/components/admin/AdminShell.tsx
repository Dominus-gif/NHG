"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Users, UserPlus, Package, Receipt, FileText, Bell,
  ShieldCheck, LogOut, Loader2,
} from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import { adminFetch } from "@/lib/adminClient";
import type { AdminProfile } from "@/lib/adminData";

type NavItem = { label: string; href: string; icon: typeof LayoutDashboard; soon?: boolean };

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Clients", href: "/admin/clients", icon: Users },
  { label: "Onboarding", href: "/admin/onboarding", icon: UserPlus, soon: true },
  { label: "Service catalog", href: "/admin/services", icon: Package, soon: true },
  { label: "Invoicing", href: "/admin/invoices", icon: Receipt, soon: true },
  { label: "Documents", href: "/admin/documents", icon: FileText, soon: true },
  { label: "Notifications", href: "/admin/notifications", icon: Bell, soon: true },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const isLogin = pathname === "/admin/login";

  const [phase, setPhase] = useState<"checking" | "ok">("checking");
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    if (isLogin) return;
    let cancelled = false;
    (async () => {
      const res = await adminFetch("/api/admin/me");
      if (cancelled) return;
      if (res.ok) {
        const data = await res.json();
        setAdmin(data.admin);
        setDemo(Boolean(data.demo));
        setPhase("ok");
      } else {
        router.replace("/admin/login");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isLogin, pathname, router]);

  // The login page renders without the shell / gate.
  if (isLogin) return <>{children}</>;

  if (phase === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base text-fg-muted">
        <Loader2 className="animate-spin" size={22} />
      </div>
    );
  }

  const signOut = async () => {
    await getSupabaseBrowser()?.auth.signOut();
    router.replace("/admin/login");
  };

  return (
    <div className="min-h-screen bg-base">
      <div className="mx-auto flex max-w-[1400px] flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="border-b border-hairline lg:min-h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2 px-6 pt-7 pb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-hairline bg-elevated text-accent">
              <ShieldCheck size={17} />
            </span>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-fg">Nord Harton</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">Admin</div>
            </div>
          </div>

          <nav className="flex flex-wrap gap-1 px-3 pb-4 lg:flex-col lg:flex-nowrap">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              if (item.soon) {
                return (
                  <span
                    key={item.href}
                    className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm text-fg-subtle/60"
                    title="Coming in a later phase"
                  >
                    <Icon size={17} />
                    <span className="hidden sm:inline">{item.label}</span>
                    <span className="ml-auto hidden rounded-full border border-hairline px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-fg-subtle lg:inline">
                      soon
                    </span>
                  </span>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active ? "bg-elevated text-fg" : "text-fg-muted hover:bg-elevated/60 hover:text-fg"
                  }`}
                >
                  <Icon size={17} />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto hidden px-4 pb-6 lg:block">
            <div className="rounded-xl border border-hairline bg-elevated/60 p-3">
              <div className="truncate text-xs font-medium text-fg">{admin?.name || admin?.email}</div>
              <div className="truncate text-[11px] text-fg-subtle">{admin?.email}</div>
              <button
                onClick={signOut}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-hairline-strong px-3 py-1.5 text-xs font-medium text-fg-muted transition-colors hover:border-accent hover:text-fg"
              >
                <LogOut size={13} /> Sign out
              </button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1 px-6 py-8 lg:px-10 lg:py-10">
          {demo && (
            <div className="mb-6 rounded-xl border border-hairline bg-elevated/60 px-4 py-2.5 text-xs text-fg-muted">
              <span className="font-medium text-fg">Demo mode</span> — showing sample data. Connect the admin backend
              (run <span className="font-mono">supabase/admin_schema.sql</span> and set the service-role key) to go live.
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
