import type { Metadata } from "next";
import LegalDoc, { type LegalSection } from "@/components/legal/LegalDoc";

export const metadata: Metadata = {
  title: "Security — Nord Harton Group",
  description:
    "How Nord Harton Group protects data and builds security into everything we ship.",
};

const sections: LegalSection[] = [
  {
    heading: "Our Approach to Security",
    body: [
      "Security is not a feature we add at the end — it is a discipline we build into every stage of design, engineering, and operations. This page describes the safeguards we apply to protect our own systems and the platforms we build for our clients.",
    ],
  },
  {
    heading: "Data Encryption",
    body: ["We protect data at rest and in transit using industry-standard encryption:"],
    bullets: [
      "All traffic to and from our website is encrypted using TLS.",
      "Sensitive data at rest is encrypted using strong, modern algorithms.",
      "Secrets and credentials are stored in dedicated secret-management systems, never in source code.",
    ],
  },
  {
    heading: "Access Control",
    body: [
      "We operate on the principle of least privilege. Access to systems and data is granted only where required for a specific role, is reviewed regularly, and is protected by multi-factor authentication.",
    ],
    bullets: [
      "Role-based access with regular entitlement reviews.",
      "Mandatory multi-factor authentication for internal systems.",
      "Audit logging of access to sensitive systems and data.",
    ],
  },
  {
    heading: "Secure Development",
    body: ["Security is embedded in our engineering lifecycle rather than bolted on afterward:"],
    bullets: [
      "Code review and automated testing on every change.",
      "Dependency scanning and prompt patching of known vulnerabilities.",
      "Secure-by-default architecture and infrastructure-as-code.",
    ],
  },
  {
    heading: "Infrastructure & Monitoring",
    body: [
      "We host on reputable cloud providers with strong physical and network security. We continuously monitor our infrastructure with logging, alerting, and observability so that anomalies are detected and addressed quickly.",
    ],
  },
  {
    heading: "Incident Response",
    body: [
      "We maintain an incident-response process to identify, contain, and remediate security events. Where an incident affects client data, we act promptly and communicate transparently in line with our obligations.",
    ],
  },
  {
    heading: "Compliance",
    body: [
      "We align our practices with recognized security and privacy standards, and we work with our clients to meet the regulatory requirements specific to their industry and jurisdiction. Our handling of personal data is described in our Privacy Policy.",
    ],
  },
  {
    heading: "Reporting a Vulnerability",
    body: [
      "We welcome responsible disclosure. If you believe you have found a security vulnerability in our website or services, please contact our security team so we can investigate and resolve it quickly. We ask that you give us a reasonable opportunity to address the issue before any public disclosure.",
    ],
  },
];

export default function SecurityPage() {
  return (
    <LegalDoc
      eyebrow="Legal"
      title="Security"
      intro="How we protect data and build security into everything we design, engineer, and operate."
      lastUpdated="July 5, 2026"
      sections={sections}
    />
  );
}
