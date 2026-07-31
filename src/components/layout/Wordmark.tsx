/**
 * Brand wordmark — "NordHarton" in a white→silver vertical gradient followed by
 * a red square period. Scales crisply at any size (no raster image).
 */
export function Wordmark({ size = 24, className }: { size?: number; className?: string }) {
  const dot = Math.round(size * 0.17);
  return (
    <span
      className={className}
      aria-label="NordHarton"
      style={{ display: "inline-flex", alignItems: "flex-end", gap: Math.max(2, Math.round(size * 0.05)), lineHeight: 1, userSelect: "none" }}
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: size,
          letterSpacing: "-.03em",
          lineHeight: 0.92,
          backgroundImage: "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 34%, #CACDD3 72%, #989CA4 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          whiteSpace: "nowrap",
        }}
      >
        NordHarton
      </span>
      <span
        style={{
          width: dot,
          height: dot,
          borderRadius: Math.max(1, Math.round(dot * 0.16)),
          background: "#F0121F",
          marginBottom: Math.round(size * 0.055),
          flexShrink: 0,
        }}
      />
    </span>
  );
}
