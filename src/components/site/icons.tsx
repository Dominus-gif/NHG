import type { ReactNode, SVGProps } from "react";

type IconProps = Omit<SVGProps<SVGSVGElement>, "stroke"> & { size?: number; stroke?: number };

function Ico(paths: ReactNode, { size = 22, stroke = 2, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {paths}
    </svg>
  );
}

export const Code2 = (p: IconProps) =>
  Ico(<><path d="m18 16 4-4-4-4" /><path d="m6 8-4 4 4 4" /><path d="m14.5 4-5 16" /></>, p);
export const Network = (p: IconProps) =>
  Ico(<><rect x="9" y="2" width="6" height="6" rx="1" /><rect x="3" y="16" width="6" height="6" rx="1" /><rect x="15" y="16" width="6" height="6" rx="1" /><path d="M12 8v3M6 16v-2a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2" /></>, p);
export const Palette = (p: IconProps) =>
  Ico(<><circle cx="13.5" cy="6.5" r=".8" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".8" fill="currentColor" /><circle cx="8.5" cy="7.5" r=".8" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".8" fill="currentColor" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.5-.7 1.5-1.5 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.8.7-1.5 1.5-1.5H16c3.3 0 6-2.7 6-6 0-4.4-4.5-8-10-8Z" /></>, p);
export const Smartphone = (p: IconProps) =>
  Ico(<><rect x="6" y="2" width="12" height="20" rx="2" /><path d="M11 18h2" /></>, p);
export const Cloud = (p: IconProps) =>
  Ico(<><path d="M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.7-1.5A4 4 0 0 0 6.5 19Z" /></>, p);
export const ArrowRight = (p: IconProps) =>
  Ico(<><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>, p);
export const ArrowUpRight = (p: IconProps) =>
  Ico(<><path d="M7 7h10v10" /><path d="M7 17 17 7" /></>, p);
export const Check = (p: IconProps) =>
  Ico(<><path d="M20 6 9 17l-5-5" /></>, p);
export const Star = (p: IconProps) =>
  Ico(<><path d="M11.5 2.7a.6.6 0 0 1 1 0l2.5 5.1 5.6.8a.6.6 0 0 1 .3 1l-4 3.9 1 5.6a.6.6 0 0 1-.9.6L12 17.7l-5 2.6a.6.6 0 0 1-.9-.6l1-5.6-4-3.9a.6.6 0 0 1 .3-1l5.6-.8Z" fill="currentColor" stroke="none" /></>, p);
export const Quote = (p: IconProps) =>
  Ico(<><path d="M10 11H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6c0 3-2 5-5 5M20 11h-4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6c0 3-2 5-5 5" fill="none" /></>, p);
export const Sparkles = (p: IconProps) =>
  Ico(<><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><path d="m6.3 6.3 2 2M15.7 15.7l2 2M17.7 6.3l-2 2M8.3 15.7l-2 2" /></>, p);
export const Menu = (p: IconProps) =>
  Ico(<><path d="M4 6h16M4 12h16M4 18h16" /></>, p);
export const X = (p: IconProps) =>
  Ico(<><path d="M18 6 6 18M6 6l12 12" /></>, p);
export const Mail = (p: IconProps) =>
  Ico(<><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 5L2 7" /></>, p);
export const Workflow = (p: IconProps) =>
  Ico(<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><path d="M10 6.5h4a3 3 0 0 1 3 3V14" /></>, p);
export const Shield = (p: IconProps) =>
  Ico(<><path d="M12 2 4 5v6c0 5 3.5 8 8 11 4.5-3 8-6 8-11V5Z" /></>, p);
export const Zap = (p: IconProps) =>
  Ico(<><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /></>, p);
export const Search = (p: IconProps) =>
  Ico(<><circle cx="11" cy="11" r="7" /><path d="m21 21-4-4" /></>, p);
export const BarChart = (p: IconProps) =>
  Ico(<><path d="M3 3v18h18" /><path d="M7 14l4-4 3 3 5-6" /></>, p);
export const Lock = (p: IconProps) =>
  Ico(<><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>, p);
export const Clock = (p: IconProps) =>
  Ico(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>, p);
export const Grid = (p: IconProps) =>
  Ico(<><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></>, p);
