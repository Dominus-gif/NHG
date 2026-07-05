"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/site/primitives";
import { ArrowRight } from "@/components/site/icons";
import { useContactModal } from "@/components/providers/ContactModalProvider";

const NAV = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Posts", href: "/posts" },
];

const easeExpo = [0.16, 1, 0.3, 1] as const;

export default function Navbar() {
  const { open } = useContactModal();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("Home");

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
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }} onClick={() => setActive("Home")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mark.svg" width={32} height={32} alt="Lynstad" />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 19, color: scrolled ? "#fff" : "var(--text-strong)", letterSpacing: "-.01em", transition: "color var(--dur-base) var(--ease-out)" }}>
              Lynstad
            </span>
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
          <Button size="sm" iconRight={<ArrowRight size={16} />} onClick={open} style={{ height: 42 }}>
            Get Started
          </Button>
        </nav>
      </div>
    </motion.header>
  );
}
