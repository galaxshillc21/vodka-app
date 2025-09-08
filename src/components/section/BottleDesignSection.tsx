"use client";

import Image from "next/image";
import { useTranslations } from "next-intl"; // Import useTranslations
import BlurText from "@/components/BlurText";
import SpotlightCard from "@/components/SpotlightCard";

export function BottleDesignParallax() {
  const t = useTranslations("Index.BottleDesignSection");
  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };
  return (
    <section className="BottleShow relative bg-gradient-to-b from-white from-40% to-gray-100 to-90% px-4 lg:py-0">
      <div className="relative h-[130vh] lg:h-[200vh] ">
        {/* Sticky text container */}
        <div className="sticky mx-auto top-0 z-20 flex flex-col items-center justify-center h-[60vh] lg:h-screen max-w-4xl w-full text-center">
          <BlurText text={t("title")} delay={80} animateBy="words" direction="top" onAnimationComplete={handleAnimationComplete} className="font-heading text-4xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mt-6 text-amber-600 mb-6 leading-tight text-center justify-center" />
        </div>
        {/* Bottle image coming from bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end h-full z-30">
          <div className="hidden lg:block">
            <Image src="/images/blatvodka-bottle-full.webp" alt="Blat Vodka Bottle" className="drop-shadow-2xl" width={400} height={800} loading="lazy" />
          </div>
          <div className="block lg:hidden">
            <Image src="/images/blatvodka-bottle-full.webp" alt="Blat Vodka Bottle" className="drop-shadow-2xl" width={300} height={800} loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function BottleDesign() {
  const t = useTranslations("Index.BottleDesignSection");
  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };
  return (
    <section className="BottleDesign h-auto relative py-10 lg:py-20 ">
      <div className="bg ">
        <div className="relative container mx-auto">
          <div className="w-full text-center mx-auto flex flex-col items-center justify-center">
            <BlurText text={t("title2")} delay={80} animateBy="words" direction="top" onAnimationComplete={handleAnimationComplete} className="font-heading text-4xl sm:text-4xl md:text-5xl lg:text-5xl font-bold mt-6 text-center text-amber-600 mb-6 leading-tight" />
          </div>

          <div className="mt-20 relative flex flex-row justify-center items-center text-center  bg-cover bg-no-repeat relative z-10 border rounded-xl w-full h-96 drop-shadow-md">
            <div className="w-full h-full backdrop-blur-xl bg-gray-100 z-10 rounded-xl flex flex-row justify-center align-center items-center">
              <div className="relative bottom-20 flex-[0_1_30%] bottle-wrapper align-center flex justify-center items-center">
                <Image src="/images/blatvodka-bottle-full.webp" alt="Blat Vodka Bottle" className="rotate-[-10deg]" width={250} height={800} loading="lazy" />
              </div>
              <div className="content flex-1 text-left">
                <blockquote className="pl-3 border-l-2">
                  <h2 className="font-heading font-bold text-amber-600 text-2xl leading-relaxed mb-3 italic">{t("span1")}</h2>
                </blockquote>
                <p className="text-md lg:text-lg mb-4 text-gray-600">{t("p1")}</p>
                <p className="text-md lg:text-lg mb-4 text-gray-600">
                  {t("p2")} <span className="font-semibold">{t("span21")}</span>
                  {t("p22")}
                  <span className="font-semibold">{t("span22")}</span>
                </p>
                <p className="text-md lg:text-lg text-gray-600">{t("p3")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BottleDesign2() {
  const t = useTranslations("Index.BottleDesignSection");
  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };
  return (
    <section className="BottleDesign h-auto relative py-10 lg:py-20 px-4 sm:px-6 lg:px-8 mb-20" id="BottleDesign">
      <div className="relative container mx-auto h-auto">
        <div className="w-full text-center mx-auto flex flex-col items-center justify-center">
          <BlurText text={t("title2")} delay={80} animateBy="words" direction="top" onAnimationComplete={handleAnimationComplete} className="font-heading text-4xl sm:text-4xl md:text-5xl lg:text-5xl font-bold mt-6 text-center text-amber-600 mb-6 leading-tight justify-center" />
        </div>
        <div className="relative flex flex-row justify-center items-center text-center z-10 w-full lg:mt-20 mt-10">
          <div className="hidden lg:block absolute left-20 z-20 pointer-events-none">
            <Image src="/images/blatvodka-bottle-full.webp" alt="Blat Vodka Bottle" className="rotate-[-10deg]" width={250} height={800} loading="lazy" />
          </div>
          <SpotlightCard className="custom-spotlight-card overflow-visible!" spotlightColor="rgba(0, 229, 255, 0.2)">
            <div className="w-full h-full z-10 rounded-xl flex lg:flex-row flex-col justify-center align-center items-center">
              <div className="relative bottom-20 flex-[0_1_30%] bottle-wrapper align-center flex justify-center items-center"></div>
              <div className="content flex-1 text-left">
                <blockquote className="pl-3 border-l-2">
                  <h2 className="font-heading font-bold text-amber-600 text-2xl leading-relaxed mb-3 italic">{t("span1")}</h2>
                </blockquote>
                <p className="text-md lg:text-lg mb-4 text-gray-600">{t("p1")}</p>
                <p className="text-md lg:text-lg mb-4 text-gray-600">
                  {t("p2")} <span className="font-semibold">{t("span21")}</span>
                  {t("p22")}
                  <span className="font-semibold">{t("span22")}</span>
                </p>
                <p className="text-md lg:text-lg text-gray-600">{t("p3")}</p>
              </div>
              <div className="flex lg:hidden flex-1">
                <Image src="/images/blatvodka-bottle-full.webp" alt="Blat Vodka Bottle" className="rotate-[-10deg]" width={250} height={800} loading="lazy" />
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}
