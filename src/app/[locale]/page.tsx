// import { getTranslations } from "next-intl/server";
import { Hero3 } from "@/src/components/section/HeroSection";
import { BottleDesignParallax, BottleDesign } from "@/src/components/section/BottleDesignSection";
import PuritySection from "@/src/components/section/PuritySection";
import { About2 } from "@/src/components/section/AboutSection";
import Agua from "@/src/components/section/AguaSection";
import { Ciencia } from "@/src/components/section/CienciaSection";
import { Qualities } from "@/src/components/section/QualitiesSection";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // const t = await getTranslations("Index");

  return (
    <>
      <Hero3 />
      <Qualities />
      <BottleDesignParallax />
      <PuritySection />
      <About2 />
      <Ciencia />
      <Agua />
      <BottleDesign />
    </>
  );
}
