"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { InteractiveShader } from "@/components/ui/digital-aurora";

/**
 * Full-page animated aurora background for the homepage.
 * Fixed, behind all content (z-index -1), at 20% opacity, blended with
 * `screen` so the aurora adds light over the dark base without darkening.
 *
 * On mobile / touch devices (and when reduced motion is preferred) we skip the
 * WebGL shader entirely and render a lightweight static gradient. The shader
 * forces a high device-pixel-ratio full-screen canvas that some mobile GPUs
 * (notably iOS Safari) fail to allocate — which could blank the whole page.
 */
export default function AuroraBackground() {
  const reduce = useReducedMotion();
  const [isMobile, setIsMobile] = useState(true); // default to the safe path pre-hydration

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 820px), (pointer: coarse)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  const useStatic = reduce || isMobile;

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
      {useStatic ? (
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 90% at 50% 0%, rgba(255,255,255,0.28), transparent 55%)" }} />
      ) : (
        <InteractiveShader flowSpeed={0.4} colorIntensity={1.2} noiseLayers={4} mouseInfluence={0} />
      )}
    </div>
  );
}
