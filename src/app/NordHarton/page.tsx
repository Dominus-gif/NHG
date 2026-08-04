import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import CtaBand from "@/components/sections/CtaBand";
import NordHartonContent from "./NordHartonContent";

export const metadata: Metadata = {
  title: "The Nord Harton Way — how we deliver",
  description:
    "What we do, how we do it, the practices we follow, and the client metrics we hold ourselves to. Nord Harton understands what clients expect and delivers quietly — without the noise.",
  alternates: { canonical: "/NordHarton" },
};

export default function NordHartonPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Nord Harton Way"
        title="How we turn ambition into shipped software"
        description="We understand exactly what our clients expect — then deliver it quietly, on time, and without the noise. This is what we do, how we do it, and the standards we hold ourselves to."
      />
      <NordHartonContent />
      <CtaBand />
    </>
  );
}
