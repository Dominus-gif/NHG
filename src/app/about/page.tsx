import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import CtaBand from "@/components/sections/CtaBand";
import { siteUrl } from "@/lib/seo";
import AboutContent from "./AboutContent";
import { ABOUT_FAQ } from "./faq";

export const metadata: Metadata = {
  title: "Nord Harton — About Our Digital Solutions Enterprise",
  description:
    "Nord Harton is a global digital solutions enterprise. Learn who Nord Harton is, what Nord Harton does, and the 15+ years of custom software, business systems, and cloud work behind it — turning complexity into competitive advantage.",
  keywords: [
    "Nord Harton",
    "NordHarton",
    "who is Nord Harton",
    "what is Nord Harton",
    "Nord Harton company",
    "Nord Harton about",
    "Nord Harton digital solutions",
    "Nord Harton software",
    "Nord Harton enterprise",
  ],
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    title: "About Nord Harton — Digital Solutions Enterprise",
    description:
      "Who Nord Harton is, what Nord Harton does, and the 15+ years of digital transformation behind the name.",
    url: `${siteUrl}/about`,
  },
};

// About-page structured data: an AboutPage tied to the Nord Harton Organization
// (defined in the root layout), plus a FAQPage whose questions match the visible
// FAQ below. Together these tell Google this page *is* the Nord Harton entity.
const aboutJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${siteUrl}/about#aboutpage`,
      url: `${siteUrl}/about`,
      name: "About Nord Harton",
      description:
        "Nord Harton is a global digital solutions enterprise building custom software, business systems, and cloud platforms — 15+ years turning complexity into competitive advantage.",
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#organization` },
      mainEntity: { "@id": `${siteUrl}/#organization` },
      inLanguage: "en",
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/about#faq`,
      mainEntity: ABOUT_FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <PageHeader
        eyebrow="About Nord Harton"
        title="Nord Harton — engineering digital transformation at scale"
        description="Nord Harton is a global digital solutions enterprise. Founded 15 years ago on a single conviction — technology should simplify business, not complicate it — Nord Harton turns complexity into competitive advantage."
      />
      <AboutContent />
      <CtaBand />
    </>
  );
}
