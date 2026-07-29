import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Button with a fill-from-corner animation: a circular pseudo-element sweeps in
 * on hover/press, flipping the button to a solid white fill with dark text.
 */
export function AnimatedButton({
  icon,
  children,
  className,
  ...props
}: {
  icon?: ReactNode;
  children?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "relative z-0 flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full",
        "border border-[var(--border-strong)] bg-[var(--surface)] px-5 py-2 font-semibold text-[var(--text-strong)]",
        "transition-all duration-500",
        "before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5]",
        "before:rounded-[100%] before:bg-white before:transition-transform before:duration-1000 before:content-['']",
        "hover:scale-[1.03] hover:text-[#0E0E0E] hover:before:translate-x-0 hover:before:translate-y-0",
        "active:scale-95 disabled:pointer-events-none disabled:opacity-70",
        className,
      )}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}
