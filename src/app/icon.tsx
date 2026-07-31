import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Square brand mark for the favicon / app icon: "N" + the red square period.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0E0F11",
          borderRadius: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <div style={{ display: "flex", fontSize: 42, fontWeight: 800, color: "#ffffff", fontFamily: "sans-serif", lineHeight: 1 }}>N</div>
          <div style={{ width: 9, height: 9, background: "#F0121F", borderRadius: 1, marginLeft: 2, marginBottom: 6 }} />
        </div>
      </div>
    ),
    { ...size },
  );
}
