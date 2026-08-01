"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/site/primitives";
import { ArrowRight } from "@/components/site/icons";
import { useContactModal } from "@/components/providers/ContactModalProvider";
import { Wordmark } from "@/components/layout/Wordmark";

const NAV = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Posts", href: "/posts" },
  { label: "Client Portal", href: "/portal" },
];

const easeExpo = [0.16, 1, 0.3, 1] as const;

export default function Navbar() {
  const { open } = useContactModal();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: easeExpo }}
      style={{ position: "sticky", top: 0, zIndex: 50, width: "100%" }}
    >
      <div
        style={{
          width: "100%",
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
          borderBottomColor: scrolled ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0)",
          backgroundColor: scrolled ? "rgba(12,12,14,0.94)" : "rgba(12,12,14,0)",
          boxShadow: scrolled ? "0 8px 24px -10px rgba(0,0,0,0.6)" : "0 0 0 rgba(0,0,0,0)",
          backdropFilter: scrolled ? "blur(16px)" : "blur(0px)",
          WebkitBackdropFilter: scrolled ? "blur(16px)" : "blur(0px)",
          transition:
            "background-color 0.4s var(--ease-out), border-bottom-color 0.4s var(--ease-out), box-shadow 0.4s var(--ease-out)",
        }}
      >
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            height: scrolled ? 66 : 80,
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            transition: "height var(--dur-slow) var(--ease-out)",
          }}
        >
          <Link href="/" style={{ display: "flex", alignItems: "center" }} onClick={() => setActive("Home")}>
            <Wordmark size={24} />
          </Link>
          <div style={{ display: "flex", gap: 4, marginLeft: 18, flex: 1 }} className="nav-links">
            {NAV.map((n) => {
              const isActive = active === n.label;
              const color = "#FFFFFF";
              return (
                <Link
                  key={n.label}
                  href={n.href}
                  onClick={() => setActive(n.label)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    fontSize: 14.5,
                    fontWeight: 500,
                    color,
                    background: isActive ? (scrolled ? "rgba(255,255,255,0.10)" : "var(--accent-soft)") : "transparent",
                    transition: "all var(--dur-fast) var(--ease-out)",
                  }}
                >
                  {n.label}
                </Link>
              );
            })}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" }} className="nav-cta">
            <Button size="sm" iconRight={<ArrowRight size={16} />} onClick={open} style={{ height: 42 }}>
              Get Started
            </Button>
          </div>
          <button
            className="nav-burger"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            style={{ width: 42, height: 42, marginLeft: "auto", borderRadius: 10, border: "1px solid var(--border-strong)", background: "transparent", color: "#fff", cursor: "pointer", alignItems: "center", justifyContent: "center" }}
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
            )}
          </button>
        </nav>

        {menuOpen && (
          <div
            className="nav-mobile"
            style={{
              flexDirection: "column",
              gap: 4,
              padding: "12px 18px 20px",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(12,12,14,0.98)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            {NAV.map((n) => (
              <Link
                key={n.label}
                href={n.href}
                onClick={() => { setActive(n.label); setMenuOpen(false); }}
                style={{ padding: "13px 12px", borderRadius: 10, fontSize: 16, fontWeight: 500, color: "#fff", background: active === n.label ? "rgba(255,255,255,0.08)" : "transparent" }}
              >
                {n.label}
              </Link>
            ))}
            <Button size="md" full iconRight={<ArrowRight size={16} />} onClick={() => { setMenuOpen(false); open(); }} style={{ marginTop: 8 }}>
              Get Started
            </Button>
          </div>
        )}
      </div>
    </motion.header>
  );
}
