import type { Metadata } from "next";
import LegalDoc, { type LegalSection } from "@/components/legal/LegalDoc";

export const metadata: Metadata = {
  title: "Terms of Service — The Lynstad Group",
  description:
    "The terms and conditions governing your use of The Lynstad Group's website and services.",
};

const sections: LegalSection[] = [
  {
    heading: "Acceptance of Terms",
    body: [
      "These Terms of Service (\"Terms\") govern your access to and use of the website and services provided by The Lynstad Group (\"Lynstad\", \"we\", \"us\", or \"our\"). By accessing or using our website, you agree to be bound by these Terms. If you do not agree, please do not use our website or services.",
    ],
  },
  {
    heading: "Use of Our Website",
    body: ["You agree to use our website lawfully and responsibly. In particular, you agree not to:"],
    bullets: [
      "Use the website in any way that violates applicable laws or regulations.",
      "Attempt to gain unauthorized access to any part of the website or its systems.",
      "Interfere with or disrupt the integrity or performance of the website.",
      "Reproduce, duplicate, or resell any part of the website without our written permission.",
    ],
  },
  {
    heading: "Services and Engagements",
    body: [
      "Any professional services we provide are governed by a separate written agreement (such as a statement of work or master services agreement) between you and Lynstad. In the event of a conflict between these Terms and such an agreement, the terms of that agreement will prevail with respect to the services described in it.",
    ],
  },
  {
    heading: "Intellectual Property",
    body: [
      "All content on this website — including text, graphics, logos, and software — is the property of Lynstad or its licensors and is protected by intellectual property laws. You may not use our trademarks or content without prior written consent.",
      "Ownership of deliverables created during a client engagement is defined in the applicable services agreement.",
    ],
  },
  {
    heading: "Submissions",
    body: [
      "Information you submit through our forms — including consultation requests and job applications — must be accurate and your own to share. You are responsible for the content you provide and represent that it does not infringe the rights of any third party.",
    ],
  },
  {
    heading: "Disclaimers",
    body: [
      "Our website is provided on an \"as is\" and \"as available\" basis without warranties of any kind, whether express or implied. We do not warrant that the website will be uninterrupted, error-free, or free of harmful components.",
    ],
  },
  {
    heading: "Limitation of Liability",
    body: [
      "To the fullest extent permitted by law, Lynstad shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the website. Our total liability for any claim relating to the website is limited to the amount you paid us, if any, for access to it.",
    ],
  },
  {
    heading: "Governing Law",
    body: [
      "These Terms are governed by and construed in accordance with applicable law, without regard to conflict-of-law principles. Any disputes arising under these Terms will be subject to the exclusive jurisdiction of the competent courts.",
    ],
  },
  {
    heading: "Changes to These Terms",
    body: [
      "We may revise these Terms from time to time. The \"Last updated\" date above reflects the most recent version. Your continued use of the website after changes take effect constitutes acceptance of the revised Terms.",
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <LegalDoc
      eyebrow="Legal"
      title="Terms of Service"
      intro="Please read these terms carefully. They govern your use of our website and services."
      lastUpdated="July 5, 2026"
      sections={sections}
    />
  );
}
