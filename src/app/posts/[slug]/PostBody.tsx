import type { ReactNode } from "react";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

/* Lightweight Markdown-ish renderer for post bodies.

   Each entry in `body` is one block. A block is detected as a heading, list,
   code fence, blockquote, rule, or (default) a paragraph. Plain-text blocks
   keep rendering exactly as before, so existing posts are unaffected.

   Inline syntax inside paragraphs / list items / headings:
     **bold**   *italic*   `code`   [text](https://link)                       */

/* ----------------------------- inline parsing ---------------------------- */

const INLINE = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`|\*([^*]+)\*/;

function parseInline(text: string, keyBase = "i"): ReactNode[] {
  const nodes: ReactNode[] = [];
  let rest = text;
  let n = 0;

  while (rest.length) {
    const m = INLINE.exec(rest);
    if (!m) {
      nodes.push(rest);
      break;
    }
    if (m.index > 0) nodes.push(rest.slice(0, m.index));
    const key = `${keyBase}-${n++}`;

    if (m[1] !== undefined) {
      // [text](href)
      const href = m[2];
      const external = /^https?:\/\//.test(href);
      nodes.push(
        external ? (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline decoration-fg-subtle underline-offset-2 transition-colors hover:decoration-accent"
          >
            {parseInline(m[1], key)}
          </a>
        ) : (
          <Link
            key={key}
            href={href}
            className="text-accent underline decoration-fg-subtle underline-offset-2 transition-colors hover:decoration-accent"
          >
            {parseInline(m[1], key)}
          </Link>
        ),
      );
    } else if (m[3] !== undefined) {
      nodes.push(
        <strong key={key} className="font-semibold text-fg">
          {parseInline(m[3], key)}
        </strong>,
      );
    } else if (m[4] !== undefined) {
      nodes.push(
        <code
          key={key}
          className="rounded-md border border-hairline bg-surface-subtle px-1.5 py-0.5 font-mono text-[0.85em] text-fg"
        >
          {m[4]}
        </code>,
      );
    } else if (m[5] !== undefined) {
      nodes.push(
        <em key={key} className="italic">
          {parseInline(m[5], key)}
        </em>,
      );
    }
    rest = rest.slice(m.index + m[0].length);
  }
  return nodes;
}

/* ------------------------------ block parsing ---------------------------- */

function Block({ raw, lead }: { raw: string; lead?: boolean }) {
  const block = raw.trim();
  if (!block) return null;

  // Fenced code block: ```lang \n ... \n ```
  if (block.startsWith("```")) {
    const lang = block.slice(3, block.indexOf("\n") === -1 ? undefined : block.indexOf("\n")).trim();
    const code = block
      .replace(/^```[^\n]*\n?/, "")
      .replace(/\n?```$/, "");
    return (
      <div className="mb-7 overflow-hidden rounded-xl border border-hairline bg-base">
        {lang && (
          <div className="border-b border-hairline px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-fg-subtle">
            {lang}
          </div>
        )}
        <pre className="overflow-x-auto p-4">
          <code className="font-mono text-sm leading-relaxed text-fg">{code}</code>
        </pre>
      </div>
    );
  }

  const lines = block.split("\n").map((l) => l.replace(/\s+$/, ""));

  // Headings (single line)
  if (/^###\s+/.test(block)) {
    return (
      <h3 className="mb-3 mt-10 text-xl font-semibold tracking-tight text-fg">
        {parseInline(block.replace(/^###\s+/, ""))}
      </h3>
    );
  }
  if (/^##\s+/.test(block)) {
    return (
      <h2 className="mb-4 mt-12 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
        {parseInline(block.replace(/^##\s+/, ""))}
      </h2>
    );
  }

  // Horizontal rule
  if (/^---+$/.test(block)) {
    return <hr className="my-10 border-hairline" />;
  }

  // Blockquote (every line starts with "> ")
  if (lines.every((l) => /^>\s?/.test(l))) {
    const text = lines.map((l) => l.replace(/^>\s?/, "")).join(" ");
    return (
      <blockquote className="my-8 border-l-2 border-accent pl-5 text-lg italic leading-relaxed text-fg">
        {parseInline(text)}
      </blockquote>
    );
  }

  // Unordered list (every line "- " or "* ")
  if (lines.length > 0 && lines.every((l) => /^[-*]\s+/.test(l))) {
    return (
      <ul className="mb-7 space-y-2.5">
        {lines.map((l, i) => (
          <li key={i} className="flex gap-3 text-lg leading-relaxed text-fg-muted">
            <span className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span>{parseInline(l.replace(/^[-*]\s+/, ""))}</span>
          </li>
        ))}
      </ul>
    );
  }

  // Ordered list (every line "1. ", "2. ", ...)
  if (lines.length > 0 && lines.every((l) => /^\d+\.\s+/.test(l))) {
    return (
      <ol className="mb-7 space-y-2.5">
        {lines.map((l, i) => (
          <li key={i} className="flex gap-3 text-lg leading-relaxed text-fg-muted">
            <span className="mt-0.5 font-mono text-sm font-semibold text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{parseInline(l.replace(/^\d+\.\s+/, ""))}</span>
          </li>
        ))}
      </ol>
    );
  }

  // Default: paragraph. The opening paragraph reads as a larger, brighter lead.
  if (lead) {
    return <p className="mb-7 text-xl leading-relaxed text-fg">{parseInline(block)}</p>;
  }
  return <p className="mb-6 text-[1.0625rem] leading-[1.75] text-fg-muted">{parseInline(block)}</p>;
}

const BLOCK_MARKER = /^(#{2,3}\s|[-*]\s|\d+\.\s|>\s|```|---)/;

export default function PostBody({ body }: { body: string[] }) {
  // The first plain-paragraph block is styled as a lead-in for readability.
  let leadUsed = false;
  return (
    <>
      {body.map((raw, i) => {
        const t = raw.trim();
        const isPara = Boolean(t) && !BLOCK_MARKER.test(t);
        const lead = !leadUsed && isPara;
        if (lead) leadUsed = true;
        return (
          <Reveal key={i} delay={Math.min(i * 0.03, 0.2)}>
            <Block raw={raw} lead={lead} />
          </Reveal>
        );
      })}
    </>
  );
}
