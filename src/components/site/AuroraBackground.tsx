/**
 * Lightweight static background glow for the homepage.
 *
 * This replaced a full-screen WebGL shader. In headless / GPU-less environments
 * (Lighthouse, CI, some devices) the shader fell back to software rendering and
 * ran an unbounded requestAnimationFrame loop that blocked the main thread —
 * causing pages to hang and audits to fail. A pure CSS gradient is free: no
 * JavaScript, no animation frames, no layout cost.
 */
export default function AuroraBackground() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        overflow: "hidden",
        background:
          "radial-gradient(90% 55% at 50% -8%, rgba(255,255,255,0.06), transparent 60%)," +
          "radial-gradient(55% 40% at 82% 6%, rgba(255,255,255,0.035), transparent 60%)",
      }}
    />
  );
}
