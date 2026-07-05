"use client";

import { useReducedMotion } from "framer-motion";
import { InteractiveShader } from "@/components/ui/digital-aurora";

/**
 * Full-page animated aurora background for the homepage.
 * Fixed, behind all content (z-index -1), at 40% opacity, blended with
 * `screen` so the aurora adds light over the dark base without darkening.
 * Falls back to a static gradient when the user prefers reduced motion.
 */
export default function AuroraBackground() {
  const reduce = useReducedMotion();

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        opacity: 0.2,
        pointerEvents: "none",
        overflow: "hidden",
        mixBlendMode: "screen",
      }}
    >
      {reduce ? (
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 90% at 50% 0%, rgba(255,255,255,0.28), transparent 55%)" }} />
      ) : (
        <InteractiveShader flowSpeed={0.4} colorIntensity={1.2} noiseLayers={4} mouseInfluence={0} />
      )}
    </div>
  );
}
