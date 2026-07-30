import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Nord Harton Group — Where strategy meets execution";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0E0F11",
          backgroundImage: "radial-gradient(1000px 500px at 50% -10%, rgba(255,255,255,0.10), transparent)",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 54, height: 54, borderRadius: 14, background: "#1B1D20", border: "1px solid #2A2A2D" }} />
          <div style={{ display: "flex", fontSize: 32, color: "#ffffff", fontWeight: 600 }}>Nord Harton Group</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", fontSize: 74, color: "#ffffff", fontWeight: 700, lineHeight: 1.05, maxWidth: 940 }}>
            Where strategy meets execution
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#A6A9AE", maxWidth: 860 }}>
            Custom web apps, business systems, cloud & branding — engineered for enterprise scale.
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 24, color: "#6E6E73" }}>nordhartongroup.com</div>
      </div>
    ),
    { ...size },
  );
}
