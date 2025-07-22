// import { getTranslations } from "next-intl/server";
import { Hero3 } from "@/src/components/section/HeroSection";
import { MainEvent } from "@/src/components/section/MainEventSection";
import { BottleDesignParallax, BottleDesign2 } from "@/src/components/section/BottleDesignSection";
import PuritySection from "@/src/components/section/PuritySection";
import { About2 } from "@/src/components/section/AboutSection";
import Agua from "@/src/components/section/AguaSection";
import { Ciencia } from "@/src/components/section/CienciaSection";
// import { Qualities } from "@/src/components/section/QualitiesSection";
import AISection from "@/src/components/section/AISection";

export default async function HomePage() {
  return (
    <>
      <Hero3 />
      <MainEvent />
      <BottleDesignParallax />
      <PuritySection />
      <About2 />
      <Ciencia />
      {/* <Qualities /> */}
      <AISection />
      <Agua />
      <BottleDesign2 />
    </>
  );
}
