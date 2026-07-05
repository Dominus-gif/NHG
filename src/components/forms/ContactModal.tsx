"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Button, Eyebrow } from "@/components/site/primitives";
import { ArrowRight, Check, Mail, X } from "@/components/site/icons";
import SelectMenu from "@/components/forms/SelectMenu";
import { submitConsultation, type ConsultationInput } from "@/lib/submissions";

const DOMAINS = [
  "Custom Web Applications",
  "Business System Design & Transformation",
  "Web Experiences & Brand Authority",
  "Mobile Application Development",
  "Digital Infrastructure & Cloud",
  "Other / Not sure yet",
];

const COMPANY_SIZES = [
  "1–50 employees",
  "51–200 employees",
  "201–1,000 employees",
  "1,001–5,000 employees",
  "5,000+ employees",
];

const PRESENCE = [
  "Single country",
  "Regional (a few countries)",
  "Multi-region",
  "Global (worldwide operations)",
];

const BUDGETS = [
  "Under $50k",
  "$50k – $150k",
  "$150k – $500k",
  "$500k – $1M",
  "$1M+",
];

const EMPTY: ConsultationInput = {
  full_name: "",
  work_email: "",
  company: "",
  job_title: "",
  project_domain: "",
  company_size: "",
  global_presence: "",
  industry: "",
  estimated_budget: "",
  project_details: "",
};

export default function ContactModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<ConsultationInput>(EMPTY);

  const set = (key: keyof ConsultationInput) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    if (isOpen) {
      setSent(false);
      setSubmitting(false);
      setError("");
      setForm(EMPTY);
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
    setSubmitting(true);
    setError("");
    try {
      await submitConsultation(form);
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
        zIndex: 100,
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
        aria-label="Request a consultation"
        style={{
          width: "100%",
          maxWidth: 620,
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
            <Eyebrow>Get started</Eyebrow>
            <h3 style={{ marginTop: 12, fontSize: 25, fontWeight: 600, color: "var(--text-strong)" }}>Request a consultation</h3>
            {!sent && (
              <p style={{ marginTop: 6, fontSize: 14, color: "var(--text-muted)" }}>
                Tell us about your organization and what you&apos;re building. The more we know, the sharper our first conversation.
              </p>
            )}
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
            <p style={{ marginTop: 16, fontSize: 17, fontWeight: 600, color: "var(--text-strong)" }}>Thanks — we&apos;ll be in touch.</p>
            <p style={{ marginTop: 6, fontSize: 14, color: "var(--text-muted)" }}>A strategist will reach out within one business day.</p>
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
              <Field label="Full name" placeholder="Jane Doe" value={form.full_name} onChange={set("full_name")} />
              <Field label="Work email" type="email" placeholder="you@company.com" icon={<Mail size={16} />} value={form.work_email} onChange={set("work_email")} />
            </Row>
            <Row>
              <Field label="Company" placeholder="Acme Inc." value={form.company} onChange={set("company")} />
              <Field label="Job title" placeholder="VP of Engineering" required={false} value={form.job_title} onChange={set("job_title")} />
            </Row>
            <Select label="Project domain" options={DOMAINS} value={form.project_domain} onChange={set("project_domain")} />
            <Row>
              <Select label="Company size" options={COMPANY_SIZES} value={form.company_size} onChange={set("company_size")} />
              <Select label="Global presence" options={PRESENCE} value={form.global_presence} onChange={set("global_presence")} />
            </Row>
            <Row>
              <Field label="Industry" placeholder="e.g. Fintech, Healthcare" required={false} value={form.industry} onChange={set("industry")} />
              <Select label="Estimated budget" options={BUDGETS} value={form.estimated_budget} onChange={set("estimated_budget")} />
            </Row>
            <Field label="Project details" placeholder="Tell us about your goals, timeline, and constraints…" textarea value={form.project_details} onChange={set("project_details")} />
            {error && <p style={{ fontSize: 13, color: "var(--danger)" }}>{error}</p>}
            <Button type="submit" full size="lg" iconRight={<ArrowRight size={18} />} disabled={submitting}>
              {submitting ? "Sending…" : "Submit request"}
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

const fieldWrap = (f: boolean, textarea?: boolean) =>
  ({
    display: "flex",
    alignItems: textarea ? "flex-start" : "center",
    gap: 10,
    padding: textarea ? "12px 14px" : "0 14px",
    height: textarea ? "auto" : 46,
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
  resize: "vertical",
} as const;

function Field({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  icon,
  textarea,
  required = true,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  icon?: ReactNode;
  textarea?: boolean;
  required?: boolean;
}) {
  const [f, setF] = useState(false);
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-strong)" }}>{label}</span>
      <div style={fieldWrap(f, textarea)}>
        {icon && <span style={{ color: "var(--text-subtle)", display: "inline-flex", marginTop: textarea ? 2 : 0 }}>{icon}</span>}
        {textarea ? (
          <textarea className="lyn-field" rows={3} placeholder={placeholder} required={required} value={value} onChange={(e) => onChange(e.target.value)} onFocus={() => setF(true)} onBlur={() => setF(false)} style={inputStyle} />
        ) : (
          <input className="lyn-field" type={type} placeholder={placeholder} required={required} value={value} onChange={(e) => onChange(e.target.value)} onFocus={() => setF(true)} onBlur={() => setF(false)} style={inputStyle} />
        )}
      </div>
    </label>
  );
}

function Select({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-strong)" }}>{label}</span>
      <SelectMenu value={value} onChange={onChange} options={options} ariaLabel={label} />
    </div>
  );
}
