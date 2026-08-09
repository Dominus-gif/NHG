"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { getSupabaseBrowser, isPortalConfigured } from "@/lib/supabaseBrowser";
import { adminFetch } from "@/lib/adminClient";
import { AnimatedButton } from "@/components/ui/AnimatedButton";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already signed in as an admin, skip straight to the dashboard.
  useEffect(() => {
    if (!isPortalConfigured) return;
    (async () => {
      const sb = getSupabaseBrowser();
      const session = sb ? (await sb.auth.getSession()).data.session : null;
      if (!session) return;
      const res = await adminFetch("/api/admin/me");
      if (res.ok) router.replace("/admin");
    })();
  }, [router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const sb = getSupabaseBrowser();
    if (!sb) {
      setError("The admin backend is being set up. Please try again shortly.");
      return;
    }
    setLoading(true);
    const { error: signInErr } = await sb.auth.signInWithPassword({ email: email.trim(), password });
    if (signInErr) {
      setLoading(false);
      setError(/invalid login credentials/i.test(signInErr.message) ? "Incorrect email or password." : signInErr.message);
      return;
    }
    // Confirm this account is actually an admin before letting them in.
    const res = await adminFetch("/api/admin/me");
    setLoading(false);
    if (!res.ok) {
      await sb.auth.signOut();
      setError("This account is not an administrator.");
      return;
    }
    router.replace("/admin");
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-base px-6 py-20">
      <div className="blob h-[360px] w-[360px] bg-accent/10" style={{ top: "-140px", left: "50%", marginLeft: -180 }} />
      <div className="relative w-full max-w-md">
        <div className="text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-hairline bg-elevated text-accent">
            <ShieldCheck size={20} />
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">Admin sign in</h1>
          <p className="mt-3 text-sm leading-relaxed text-fg-muted">
            Privileged access to client onboarding, accounts, services, and invoicing.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4 rounded-2xl border border-hairline bg-elevated/60 p-7">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-fg">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              placeholder="owner@nordharton.com"
              className="lyn-field h-11 rounded-lg border border-hairline-strong bg-surface px-4 text-sm text-fg outline-none transition focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-ring)]"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-fg">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="lyn-field h-11 rounded-lg border border-hairline-strong bg-surface px-4 text-sm text-fg outline-none transition focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-ring)]"
            />
          </label>

          {error && <p className="text-sm text-danger">{error}</p>}

          <AnimatedButton type="submit" disabled={loading} className="mt-1 h-11 w-full text-sm">
            {loading ? "Signing in…" : "Sign in"}
          </AnimatedButton>
        </form>

        {!isPortalConfigured && (
          <p className="mt-4 text-center text-xs text-fg-subtle">
            Backend not configured —{" "}
            <Link href="/admin" className="text-accent hover:underline">
              open the demo dashboard
            </Link>
            .
          </p>
        )}
      </div>
    </section>
  );
}
