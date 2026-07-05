"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { Check } from "@/components/site/icons";

type Pos = { left: number; top: number; width: number; drop: "down" | "up" };

export default function SelectMenu({
  value,
  onChange,
  options,
  placeholder = "Select…",
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);
  const [hi, setHi] = useState(-1);
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  const place = () => {
    const r = btnRef.current?.getBoundingClientRect();
    if (!r) return;
    const estH = Math.min(options.length * 40 + 12, 264);
    const spaceBelow = window.innerHeight - r.bottom;
    const drop: "down" | "up" = spaceBelow < estH + 12 && r.top > spaceBelow ? "up" : "down";
    setPos({
      left: r.left,
      top: drop === "down" ? r.bottom + 6 : r.top - 6,
      width: r.width,
      drop,
    });
  };

  useLayoutEffect(() => {
    if (open) place();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!btnRef.current?.contains(e.target as Node) && !menuRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEsc = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    const reposition = () => place();
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const choose = (v: string) => {
    onChange(v);
    setOpen(false);
    btnRef.current?.focus();
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setHi(Math.max(0, options.indexOf(value)));
        return;
      }
      if (e.key === "ArrowDown") setHi((h) => Math.min(options.length - 1, h + 1));
      else if (e.key === "ArrowUp") setHi((h) => Math.max(0, h - 1));
      else if (hi >= 0) choose(options[hi]);
    }
  };

  const triggerStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    width: "100%",
    height: 46,
    padding: "0 14px",
    background: "var(--surface)",
    border: `1px solid ${open ? "var(--accent)" : "var(--border-strong)"}`,
    borderRadius: "var(--radius-md)",
    boxShadow: open ? "0 0 0 3px var(--accent-ring)" : "var(--shadow-xs)",
    color: value ? "var(--text-strong)" : "var(--text-subtle)",
    fontFamily: "var(--font-body-sans)",
    fontSize: 14.5,
    cursor: "pointer",
    transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
  };

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => {
          setOpen((o) => !o);
          setHi(Math.max(0, options.indexOf(value)));
        }}
        onKeyDown={onKey}
        style={triggerStyle}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {value || placeholder}
        </span>
        <span
          style={{
            display: "inline-flex",
            color: "var(--text-subtle)",
            transition: "transform var(--dur-base) var(--ease-out)",
            transform: open ? "rotate(180deg)" : "none",
          }}
        >
          <Chevron />
        </span>
      </button>

      {mounted && open && pos &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            style={{
              position: "fixed",
              left: pos.left,
              top: pos.drop === "down" ? pos.top : undefined,
              bottom: pos.drop === "up" ? window.innerHeight - pos.top : undefined,
              width: pos.width,
              zIndex: 200,
              background: "var(--surface)",
              border: "1px solid var(--border-strong)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-xl)",
              padding: 6,
              maxHeight: 264,
              overflowY: "auto",
              animation: "menuIn .16s var(--ease-out)",
              transformOrigin: pos.drop === "down" ? "top center" : "bottom center",
            }}
          >
            {options.map((o, i) => {
              const sel = o === value;
              const active = i === hi;
              return (
                <button
                  key={o}
                  type="button"
                  role="option"
                  aria-selected={sel}
                  onMouseEnter={() => setHi(i)}
                  onClick={() => choose(o)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 9,
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    background: active ? "var(--surface-subtle)" : "transparent",
                    color: sel ? "var(--text-strong)" : "var(--text-body)",
                    fontFamily: "var(--font-body-sans)",
                    fontSize: 14.5,
                    fontWeight: sel ? 600 : 500,
                    transition: "background var(--dur-fast) var(--ease-out)",
                  }}
                >
                  <span>{o}</span>
                  {sel && (
                    <span style={{ color: "var(--accent-press)", display: "inline-flex" }}>
                      <Check size={16} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}

function Chevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
