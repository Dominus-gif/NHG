"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/site/primitives";
import { ArrowRight } from "@/components/site/icons";
import { useContactModal } from "@/components/providers/ContactModalProvider";

const ease = [0.16, 1, 0.3, 1] as const;

export default function CtaBand() {
  const { open } = useContactModal();
  return (
    <section style={{ padding: "16px 24px 80px", maxWidth: 1200, margin: "0 auto" }}>
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease }}
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 28,
          padding: "88px 40px",
          textAlign: "center",
          background: "var(--surface)",
          border: "1px solid var(--border-strong)",
        }}
      >
        <motion.div
          style={{ position: "absolute", width: 620, height: 620, borderRadius: "50%", left: "50%", top: "50%", marginLeft: -310, marginTop: -310, background: "radial-gradient(circle, var(--accent-glow), transparent 60%)" }}
          animate={{ opacity: [0.5, 0.85, 0.5], scale: [1, 1.08, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <div style={{ position: "relative" }}>
          <h2 style={{ fontSize: "clamp(32px,4.5vw,56px)", fontWeight: 500, letterSpacing: "-.03em", color: "var(--text-strong)", maxWidth: "16ch", margin: "0 auto", lineHeight: 1.08 }}>
            Turn complexity into your advantage
          </h2>
          <p style={{ marginTop: 18, fontSize: 18, color: "var(--text-muted)", maxWidth: "48ch", margin: "18px auto 0" }}>
            Tell us where you&apos;re headed. We&apos;ll help you get there faster — with fewer surprises and outcomes you can measure.
          </p>
          <div style={{ marginTop: 30 }}>
            <Button size="lg" iconRight={<ArrowRight size={18} />} onClick={open}>
              Get Started Now
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
