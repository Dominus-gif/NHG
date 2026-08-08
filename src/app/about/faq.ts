// Shared FAQ used by both the visible About section and the FAQPage JSON-LD.
// Keeping one source means the structured data always matches what's on the page
// (a requirement for FAQ rich results). The answers naturally reinforce the
// "Nord Harton" brand for people searching the name directly.

export type Faq = { q: string; a: string };

export const ABOUT_FAQ: Faq[] = [
  {
    q: "What is Nord Harton?",
    a: "Nord Harton is a global digital solutions enterprise that builds custom web applications, business systems, mobile apps, and cloud infrastructure. For more than 15 years, Nord Harton has helped organizations turn complexity into competitive advantage.",
  },
  {
    q: "What does Nord Harton do?",
    a: "Nord Harton designs, builds, and modernizes enterprise software end to end — custom platforms, business systems such as ERP and CRM, cloud and infrastructure, and security and governance — delivered by senior-only teams.",
  },
  {
    q: "How long has Nord Harton been in business?",
    a: "Nord Harton has delivered digital transformation for over 15 years, completing more than 100 projects for clients worldwide.",
  },
  {
    q: "What makes Nord Harton different?",
    a: "Nord Harton pairs senior-only teams with radical transparency and outcome-first delivery. Every technical decision maps to a measurable business result — delivered quietly, on time, and without the noise.",
  },
  {
    q: "How can I contact Nord Harton?",
    a: "You can reach Nord Harton at hello@nordharton.com, or through the contact page, to discuss your project. Nord Harton typically replies within one business day.",
  },
];
