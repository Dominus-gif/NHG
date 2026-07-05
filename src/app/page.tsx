import {
  Hero, Logos, FeatureIntro, Capabilities, FeatureBlocks, Stats, TwoCol, Testimonials, Faq,
} from "@/components/sections/home";
import CtaBand from "@/components/sections/CtaBand";
import AuroraBackground from "@/components/site/AuroraBackground";

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
