"use client";

import Image from "next/image";
import { useTranslations } from "next-intl"; // Import useTranslations
import BlurText from "@/src/components/BlurText";

export default function BottleShow() {
  const t = useTranslations("BottleShow");
  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };
  return (
    <section className="BottleShow relative bg-gradient-to-b from-white from-40% to-gray-100 to-90%">
      <div className="relative h-[200vh]">
        {/* Sticky text container */}
        <div className="sticky mx-auto top-0 z-20 flex flex-col items-center justify-center h-screen w-full max-w-4xl w-full text-center">
          <BlurText text={t("title")} delay={80} animateBy="words" direction="top" onAnimationComplete={handleAnimationComplete} className="text-4xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mt-6 text-amber-600 mb-6 leading-tight text-center justify-center" />
        </div>
        {/* Bottle image coming from bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end h-full z-30">
          <Image src="/images/blatvodka-bottle-full.webp" alt="Blat Vodka Bottle" className="drop-shadow-lg" width={400} height={800} priority />
        </div>
      </div>
    </section>
  );
}
