import type { Metadata } from "next";
import {
  Hero, Logos, FeatureIntro, Capabilities, FeatureBlocks, Stats, TwoCol, Testimonials, Faq,
} from "@/components/sections/home";
import CtaBand from "@/components/sections/CtaBand";
import AuroraBackground from "@/components/site/AuroraBackground";

// Concise homepage meta description (under 120 characters). The richer brand
// description still feeds Open Graph and structured data via the root layout.
export const metadata: Metadata = {
  description:
    "Nord Harton is a global digital solutions enterprise — 15+ years of custom software, business systems, and cloud.",
};

export default function Home() {
  return (
    <>
      <AuroraBackground />
      <Hero />
      <Logos />
      <Capabilities />
      <FeatureIntro />
      <FeatureBlocks />
      <Stats />
      <TwoCol />
      <Testimonials />
      <Faq />
      <CtaBand />
    </>
  );
}
