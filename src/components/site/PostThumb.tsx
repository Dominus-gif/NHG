// Schematic "design diagram" thumbnails for blog posts, varied by tag.
// Monochrome line-art on the dark theme — no external images.

const stroke = "rgba(255,255,255,0.55)";
const strokeSoft = "rgba(255,255,255,0.32)";
const fillSoft = "rgba(255,255,255,0.06)";
const node = "var(--surface-subtle)";

function Frame({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 440 200" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }} aria-hidden="true">
      <defs>
        <radialGradient id={`glow-${id}`} cx="50%" cy="8%" r="85%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
          <stop offset="62%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <pattern id={`grid-${id}`} width="34" height="34" patternUnits="userSpaceOnUse">
          <path d="M34 0H0V34" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="440" height="200" fill="var(--surface)" />
      <rect width="440" height="200" fill={`url(#grid-${id})`} />
      <rect width="440" height="200" fill={`url(#glow-${id})`} />
      {children}
    </svg>
  );
}

function Strategy({ id }: { id: string }) {
  return (
    <Frame id={id}>
      <path d="M60 150 C 130 150, 145 70, 215 70 S 300 135, 385 85" fill="none" stroke={stroke} strokeWidth="1.75" />
      <g fill={node} stroke={stroke} strokeWidth="1.75">
        <circle cx="60" cy="150" r="11" />
        <circle cx="215" cy="70" r="13" />
        <circle cx="385" cy="85" r="11" />
      </g>
      <g fill="rgba(255,255,255,0.85)">
        <circle cx="215" cy="70" r="3.5" />
      </g>
      <g stroke={strokeSoft} strokeWidth="1.5" fill="none">
        <rect x="150" y="128" width="54" height="18" rx="4" />
        <rect x="300" y="40" width="54" height="18" rx="4" />
      </g>
    </Frame>
  );
}

function Engineering({ id }: { id: string }) {
  return (
    <Frame id={id}>
      <g stroke={stroke} strokeWidth="1.75" fill={fillSoft}>
        <rect x="46" y="52" width="150" height="30" rx="7" />
        <rect x="58" y="92" width="150" height="30" rx="7" />
        <rect x="70" y="132" width="150" height="30" rx="7" />
      </g>
      <g stroke={strokeSoft} strokeWidth="1.75" fill="none">
        <rect x="262" y="74" width="42" height="42" rx="8" />
        <rect x="338" y="74" width="42" height="42" rx="8" />
        <line x1="304" y1="95" x2="338" y2="95" />
        <path d="M232 95 H 262" strokeDasharray="4 4" />
        <path d="M359 116 V 150 H 232" strokeDasharray="4 4" />
      </g>
      <g fill="rgba(255,255,255,0.8)">
        <circle cx="283" cy="95" r="2.5" />
        <circle cx="359" cy="95" r="2.5" />
      </g>
    </Frame>
  );
}

function Design({ id }: { id: string }) {
  return (
    <Frame id={id}>
      <g stroke={strokeSoft} strokeWidth="1.75" fill={fillSoft}>
        <rect x="66" y="48" width="118" height="104" rx="9" />
      </g>
      <g stroke={stroke} strokeWidth="1.75" fill="var(--surface)">
        <rect x="108" y="80" width="118" height="92" rx="9" />
      </g>
      <g stroke={stroke} strokeWidth="1.5">
        <line x1="108" y1="104" x2="226" y2="104" />
        <circle cx="122" cy="92" r="3.5" fill="rgba(255,255,255,0.6)" stroke="none" />
      </g>
      <g stroke={stroke} strokeWidth="1.75" fill="none">
        <circle cx="330" cy="96" r="36" />
        <line x1="330" y1="52" x2="330" y2="140" strokeWidth="1.25" stroke={strokeSoft} />
        <line x1="286" y1="96" x2="374" y2="96" strokeWidth="1.25" stroke={strokeSoft} />
      </g>
    </Frame>
  );
}

function Cloud({ id }: { id: string }) {
  const sats: [number, number][] = [
    [90, 60],
    [110, 150],
    [340, 58],
    [360, 150],
  ];
  return (
    <Frame id={id}>
      <g stroke={strokeSoft} strokeWidth="1.5" strokeDasharray="4 5">
        {sats.map(([x, y], i) => (
          <line key={i} x1="220" y1="100" x2={x} y2={y} />
        ))}
      </g>
      <g fill={node} stroke={stroke} strokeWidth="1.75">
        {sats.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="9" />
        ))}
      </g>
      <g stroke={stroke} strokeWidth="1.75" fill="var(--surface-subtle)">
        <rect x="188" y="78" width="64" height="44" rx="10" />
      </g>
      <path d="M204 100 h 32 M220 88 v 24" stroke={stroke} strokeWidth="1.5" fill="none" />
    </Frame>
  );
}

export default function PostThumb({ tag, index = 0 }: { tag: string; index?: number }) {
  const id = `${tag}-${index}`.replace(/[^a-zA-Z0-9-]/g, "");
  const t = tag.toLowerCase();
  if (t.includes("engineer")) return <Engineering id={id} />;
  if (t.includes("design")) return <Design id={id} />;
  if (t.includes("cloud")) return <Cloud id={id} />;
  return <Strategy id={id} />;
}
