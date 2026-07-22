"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: 24,
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: 24, fontWeight: 600, color: "var(--text-strong)" }}>Something went wrong</h1>
      <p style={{ color: "var(--text-muted)", maxWidth: 420 }}>
        The page hit an unexpected error. Please try again.
      </p>
      <button
        onClick={reset}
        style={{
          height: 44,
          padding: "0 22px",
          borderRadius: "var(--radius-pill)",
          background: "#fff",
          color: "#0E0E0E",
          border: "none",
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </div>
  );
}
