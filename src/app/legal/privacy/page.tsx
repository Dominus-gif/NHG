import type { Metadata } from "next";
import LegalDoc, { type LegalSection } from "@/components/legal/LegalDoc";

export const metadata: Metadata = {
  title: "Privacy Policy — The Lynstad Group",
  description:
    "How The Lynstad Group collects, uses, protects, and shares your personal information.",
};

const sections: LegalSection[] = [
  {
    heading: "Introduction",
    body: [
      "The Lynstad Group (\"Lynstad\", \"we\", \"us\", or \"our\") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, engage our services, or otherwise interact with us.",
      "By using our website or services, you agree to the collection and use of information in accordance with this policy. If you do not agree, please discontinue use of our website and services.",
    ],
  },
  {
    heading: "Information We Collect",
    body: ["We collect information that you provide directly to us and information gathered automatically when you use our website:"],
    bullets: [
      "Contact details you submit through our forms — such as your name, work email, company, job title, and phone number.",
      "Project and organizational details you choose to share, including project domain, company size, industry, and budget.",
      "Application materials — including your resume, country of residence, and years of experience — when you apply for a role.",
      "Technical data automatically collected, such as IP address, browser type, device information, and pages visited.",
    ],
  },
  {
    heading: "How We Use Your Information",
    body: ["We use the information we collect for legitimate business purposes, including to:"],
    bullets: [
      "Respond to your enquiries and provide the services you request.",
      "Evaluate job applications and communicate with candidates.",
      "Improve, personalize, and secure our website and services.",
      "Comply with legal obligations and enforce our agreements.",
    ],
  },
  {
    heading: "How We Share Information",
    body: [
      "We do not sell your personal information. We may share information with trusted service providers who process data on our behalf under strict confidentiality obligations, and where required by law or to protect our rights.",
    ],
  },
  {
    heading: "Data Retention",
    body: [
      "We retain personal information only for as long as necessary to fulfil the purposes described in this policy, unless a longer retention period is required or permitted by law. When data is no longer needed, we securely delete or anonymize it.",
    ],
  },
  {
    heading: "Your Rights",
    body: ["Depending on your location, you may have the right to:"],
    bullets: [
      "Access, correct, or delete the personal information we hold about you.",
      "Object to or restrict certain processing of your data.",
      "Request a portable copy of your information.",
      "Withdraw consent where processing is based on consent.",
    ],
  },
  {
    heading: "Security",
    body: [
      "We implement appropriate technical and organizational measures to protect your information. For details on our security practices, please see our Security page. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    heading: "International Transfers",
    body: [
      "As a global organization, we may process and store information in countries other than the one in which you reside. Where we transfer data internationally, we apply safeguards consistent with applicable data protection laws.",
    ],
  },
  {
    heading: "Changes to This Policy",
    body: [
      "We may update this Privacy Policy from time to time. Material changes will be reflected by updating the \"Last updated\" date above. We encourage you to review this policy periodically.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalDoc
      eyebrow="Legal"
      title="Privacy Policy"
      intro="Your privacy matters to us. This policy describes what information we collect and how we use and protect it."
      lastUpdated="July 5, 2026"
      sections={sections}
    />
  );
}
