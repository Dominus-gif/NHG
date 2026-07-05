/**
 * Fixed, full-viewport animated background for the homepage.
 * Layers: (1) a faint drifting grid for tech depth, (2) soft aurora glows
 * in a cohesive indigo→violet→cyan family that slowly drift and cross-fade
 * so the light shifts subtly, (3) a vignette to keep content legible.
 * CSS-driven (runs continuously, GPU-friendly), respects reduced-motion,
 * and sits behind all content (z-index -1).
 */
const BLOBS = [
  { color: "rgba(99,102,241,0.60)", size: 820, left: "-16%", top: "-14%", anim: "ambientA", dur: 30, delay: 0 },
  { color: "rgba(139,92,246,0.55)", size: 720, left: "54%", top: "-6%", anim: "ambientB", dur: 38, delay: -6 },
  { color: "rgba(34,211,238,0.48)", size: 680, left: "26%", top: "52%", anim: "ambientC", dur: 34, delay: -12 },
  { color: "rgba(129,140,248,0.50)", size: 600, left: "72%", top: "56%", anim: "ambientD", dur: 42, delay: -20 },
];

export default function AmbientBackground() {
  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: -1, overflow: "hidden", pointerEvents: "none" }}>
      {BLOBS.map((b, i) => (
        <div
          key={i}
          className="ambient-blob"
          style={{
            left: b.left,
            top: b.top,
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle, ${b.color}, transparent 62%)`,
            animation: `${b.anim} ${b.dur}s ease-in-out ${b.delay}s infinite`,
          }}
        />
      ))}
      <div className="ambient-grid" />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(135% 95% at 50% -5%, transparent 40%, rgba(19,21,23,0.62) 100%)" }} />
    </div>
  );
}
