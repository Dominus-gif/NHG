import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import CtaBand from "@/components/sections/CtaBand";
import NordHartonContent from "./NordHartonContent";

export const metadata: Metadata = {
  title: "About Nord Harton — Engineering digital transformation at scale",
  description:
    "Nord Harton is a global digital solutions enterprise turning complexity into competitive advantage. Our story, mission, values, and the way we do it — what we build, how we deliver, and the client metrics we hold ourselves to.",
  alternates: { canonical: "/nordharton" },
};

export default function NordHartonPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Nord Harton"
        title="Engineering digital transformation at scale"
        description="Founded 15 years ago on a single conviction: technology should simplify business, not complicate it. This is who we are, what we do, and how we deliver — quietly, on time, and without the noise."
      />
      <NordHartonContent />
      <CtaBand />
    </>
  );
}
