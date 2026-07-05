"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/site/primitives";
import { ArrowRight, Check, Mail, X } from "@/components/site/icons";
import SelectMenu from "@/components/forms/SelectMenu";
import { submitApplication } from "@/lib/submissions";

const DIAL_CODES = [
  "+1", "+44", "+61", "+91", "+49", "+33", "+81", "+86",
  "+971", "+65", "+31", "+46", "+55", "+27", "+234", "+92",
];

const EXPERIENCE = [
  "Less than 1 year",
  "1–3 years",
  "3–5 years",
  "5–8 years",
  "8–12 years",
  "12+ years",
];

export default function ApplyModal({
  isOpen,
  onClose,
  role,
}: {
  isOpen: boolean;
  onClose: () => void;
  role: string;
}) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [experience, setExperience] = useState("");
  const [dialCode, setDialCode] = useState("+1");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSent(false);
      setSubmitting(false);
      setError("");
      setFileName("");
      setFileError(false);
      setFullName("");
      setEmail("");
      setCountry("");
      setExperience("");
      setDialCode("+1");
      setPhone("");
    }
  }, [isOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setFileError(true);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await submitApplication(
        { role, full_name: fullName, email, country, dial_code: dialCode, phone, experience },
        file,
      );
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 110,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        background: "rgba(26,22,17,.5)",
        backdropFilter: "blur(4px)",
        animation: "fade .2s var(--ease-out)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Apply for ${role}`}
        style={{
          width: "100%",
          maxWidth: 560,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          background: "var(--surface)",
          borderRadius: "var(--radius-2xl)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-xl)",
          overflow: "hidden",
          animation: "pop .3s var(--ease-out)",
        }}
      >
        <div style={{ padding: "26px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexShrink: 0 }}>
          <div>
            <h3 style={{ fontSize: 24, fontWeight: 600, color: "var(--text-strong)" }}>{role}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              display: "inline-flex",
              padding: 8,
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--text-muted)",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {sent ? (
          <div style={{ padding: "30px 28px 34px", textAlign: "center" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "var(--success-soft)",
                color: "var(--success)",
              }}
            >
              <Check size={28} />
            </span>
            <p style={{ marginTop: 16, fontSize: 17, fontWeight: 600, color: "var(--text-strong)" }}>Application received.</p>
            <p style={{ marginTop: 6, fontSize: 14, lineHeight: 1.6, color: "var(--text-muted)", maxWidth: 380, marginInline: "auto" }}>
              Thanks for applying. You&apos;ll receive an email within the next 24 hours if we decide to proceed with your application.
            </p>
            <div style={{ marginTop: 20 }}>
              <Button onClick={onClose}>Done</Button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={submit}
            style={{ padding: "20px 28px 28px", display: "flex", flexDirection: "column", gap: 14, overflowY: "auto" }}
          >
            <Row>
              <Field label="Full name" placeholder="Jane Doe" value={fullName} onChange={setFullName} />
              <Field label="Email" type="email" placeholder="you@email.com" icon={<Mail size={16} />} value={email} onChange={setEmail} />
            </Row>
            <Row>
              <Field label="Country of residence" placeholder="e.g. United States" value={country} onChange={setCountry} />
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-strong)" }}>Total years of experience</span>
                <SelectMenu value={experience} onChange={setExperience} options={EXPERIENCE} ariaLabel="Total years of experience" />
              </div>
            </Row>

            <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-strong)" }}>Contact number</span>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ width: 96, flexShrink: 0 }}>
                  <SelectMenu value={dialCode} onChange={setDialCode} options={DIAL_CODES} ariaLabel="International dial code" />
                </div>
                <div style={{ flex: 1 }}>
                  <PlainInput type="tel" placeholder="Phone number" value={phone} onChange={setPhone} />
                </div>
              </div>
            </label>

            <ResumeField
              fileName={fileName}
              error={fileError}
              onPick={() => fileRef.current?.click()}
              inputRef={fileRef}
              onChange={(e) => {
                setFileName(e.target.files?.[0]?.name ?? "");
                setFileError(false);
              }}
            />

            {error && <p style={{ fontSize: 13, color: "var(--danger)" }}>{error}</p>}
            <Button type="submit" full size="lg" iconRight={<ArrowRight size={18} />} disabled={submitting}>
              {submitting ? "Submitting…" : "Submit application"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

function Row({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="contact-row">
      {children}
    </div>
  );
}

const fieldWrap = (f: boolean) =>
  ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 14px",
    height: 46,
    background: "var(--surface)",
    border: `1px solid ${f ? "var(--accent)" : "var(--border-strong)"}`,
    borderRadius: "var(--radius-md)",
    boxShadow: f ? "0 0 0 3px var(--accent-ring)" : "var(--shadow-xs)",
    transition: "all var(--dur-fast) var(--ease-out)",
  }) as const;

const inputStyle = {
  flex: 1,
  border: "none",
  outline: "none",
  background: "transparent",
  fontFamily: "var(--font-body-sans)",
  fontSize: 14.5,
  color: "var(--text-strong)",
  width: "100%",
} as const;

function Field({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  icon,
  required = true,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  icon?: ReactNode;
  required?: boolean;
}) {
  const [f, setF] = useState(false);
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-strong)" }}>{label}</span>
      <div style={fieldWrap(f)}>
        {icon && <span style={{ color: "var(--text-subtle)", display: "inline-flex" }}>{icon}</span>}
        <input className="lyn-field" type={type} placeholder={placeholder} required={required} value={value} onChange={(e) => onChange(e.target.value)} onFocus={() => setF(true)} onBlur={() => setF(false)} style={inputStyle} />
      </div>
    </label>
  );
}

function PlainInput({ type = "text", placeholder, value, onChange }: { type?: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  const [f, setF] = useState(false);
  return (
    <div style={fieldWrap(f)}>
      <input className="lyn-field" type={type} placeholder={placeholder} required value={value} onChange={(e) => onChange(e.target.value)} onFocus={() => setF(true)} onBlur={() => setF(false)} style={inputStyle} />
    </div>
  );
}

function ResumeField({
  fileName,
  error,
  onPick,
  inputRef,
  onChange,
}: {
  fileName: string;
  error: boolean;
  onPick: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-strong)" }}>Resume / CV</span>
      <div
        onClick={onPick}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 16px",
          background: "var(--surface-subtle)",
          border: `1px dashed ${error ? "var(--danger)" : "var(--border-strong)"}`,
          borderRadius: "var(--radius-md)",
          cursor: "pointer",
        }}
      >
        <span style={{ color: "var(--accent-press)", display: "inline-flex" }}>
          <UploadIcon />
        </span>
        <span style={{ flex: 1, fontSize: 14, color: fileName ? "var(--text-strong)" : "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {fileName || "Attach resume from your desktop (PDF, DOC, DOCX)"}
        </span>
        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--accent-press)" }}>
          {fileName ? "Change" : "Browse"}
        </span>
      </div>
      {error && (
        <span style={{ fontSize: 12.5, color: "var(--danger)" }}>Please attach your resume to continue.</span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={onChange}
        style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
        tabIndex={-1}
      />
    </div>
  );
}

function UploadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M17 8l-5-5-5 5" />
      <path d="M12 3v12" />
    </svg>
  );
}
