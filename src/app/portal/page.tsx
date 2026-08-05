"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser, isPortalConfigured, clientIdToEmail } from "@/lib/supabaseBrowser";
import { AnimatedButton } from "@/components/ui/AnimatedButton";

export default function PortalLoginPage() {
  const router = useRouter();
  const [clientId, setClientId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already signed in, go straight to the dashboard.
  useEffect(() => {
    const sb = getSupabaseBrowser();
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/portal/dashboard");
    });
  }, [router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const sb = getSupabaseBrowser();
    if (!sb) {
      setError("The portal is being set up. Please try again shortly or contact your relationship manager.");
      return;
    }
    setLoading(true);
    const { error } = await sb.auth.signInWithPassword({
      email: clientIdToEmail(clientId),
      password,
    });
    setLoading(false);
    if (error) {
      // Surface the real reason (e.g. "Email not confirmed") so issues are diagnosable.
      setError(
        /invalid login credentials/i.test(error.message)
          ? "Incorrect Client ID or password."
          : error.message,
      );
      return;
    }
    router.replace("/portal/dashboard");
  };

  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-6 pt-32 pb-20">
      <div className="blob h-[360px] w-[360px] bg-accent/10" style={{ top: "-140px", left: "50%", marginLeft: -180 }} />
      <div className="relative w-full max-w-md">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Client Portal</span>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Sign in to your workspace</h1>
          <p className="mt-3 text-sm leading-relaxed text-fg-muted">
            Access your services, project progress, documents, invoices, and your dedicated relationship manager.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-8 flex flex-col gap-4 rounded-2xl border border-hairline bg-elevated/60 p-7"
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-fg">Client ID</span>
            <input
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
              autoComplete="username"
              placeholder="e.g. NHG-2048"
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

          <p className="text-center text-xs text-fg-subtle">
            Trouble signing in? Email{" "}
            <a href="mailto:support@nordharton.com" className="text-accent hover:underline">
              support@nordharton.com
            </a>
          </p>
        </form>

        {!isPortalConfigured && (
          <p className="mt-4 text-center text-xs text-fg-subtle">
            The portal is being set up. Please check back shortly.
          </p>
        )}
      </div>
    </section>
  );
}
