import Link from "next/link";

const cols: { title: string; links: [string, string][] }[] = [
  {
    title: "Company",
    links: [
      ["About", "/about"],
      ["Services", "/services"],
      ["Posts", "/posts"],
      ["Careers", "/careers"],
      ["Contact", "/contact"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Privacy Policy", "/legal/privacy"],
      ["Terms of Service", "/legal/terms"],
      ["Security", "/legal/security"],
    ],
  },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--surface-inverse)",
        color: "var(--text-on-inverse)",
        padding: "64px 24px 30px",
        marginTop: 20,
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.7fr 1fr 1fr",
          gap: 48,
        }}
        className="footer-grid"
      >
        <div style={{ maxWidth: 320 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mark.svg" width={34} height={34} alt="Nord Harton" />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 20, color: "#fff" }}>Nord Harton</span>
          </Link>
          <p style={{ marginTop: 16, fontSize: 14, lineHeight: 1.6, color: "var(--text-on-inverse-muted)" }}>
            A digital solutions enterprise turning complex business requirements into elegant, scalable software.
          </p>

          <figure
            style={{
              marginTop: 24,
              paddingLeft: 16,
              borderLeft: "2px solid var(--accent)",
            }}
          >
            <blockquote style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: "#fff", fontStyle: "italic" }}>
              &ldquo;Simplicity is the ultimate sophistication — we engineer it into everything we ship.&rdquo;
            </blockquote>
            <figcaption style={{ marginTop: 8, fontSize: 12.5, color: "var(--text-on-inverse-muted)" }}>
              — Nord Harton Group
            </figcaption>
          </figure>
        </div>

        {cols.map(({ title, links }) => (
          <div key={title}>
            <h4
              style={{
                fontSize: 12,
                letterSpacing: ".12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,.4)",
                fontFamily: "var(--font-body-sans)",
                fontWeight: 600,
              }}
            >
              {title}
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: "16px 0 0", display: "flex", flexDirection: "column", gap: 11 }}>
              {links.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} style={{ fontSize: 14, color: "var(--text-on-inverse-muted)" }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div
        style={{
          maxWidth: 1180,
          margin: "40px auto 0",
          paddingTop: 24,
          borderTop: "1px solid var(--border-inverse)",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 13, color: "var(--text-on-inverse-muted)" }}>© 2026 Nord Harton Group. All rights reserved.</span>
        <span style={{ fontSize: 13, color: "var(--text-on-inverse-muted)" }}>hello@nordhartongroup.com</span>
      </div>
    </footer>
  );
}
