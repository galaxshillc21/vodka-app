"use client";

import React from "react";
import { useTranslations } from "next-intl"; // Import useTranslations
// import Image from "next/image";
import BlurText from "@/components/BlurText";

export default function Agua() {
  const t = useTranslations("Index.AguaSection"); // Use the translations for the About section
  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };
  return (
    <section className="lg:py-20 py-10 px-4 sm:px-6 lg:px-8 h-auto" id="Agua">
      <div className="container mx-auto lg:py-12 py-0">
        <p className="text-md flex justify-center text-center font-semibold mb-[-20px]">{t("heading1")}</p>
        <div className="w-full text-center mx-auto flex flex-col items-center justify-center">
          <BlurText text={t("heading2")} delay={80} animateBy="words" direction="top" onAnimationComplete={handleAnimationComplete} className="font-heading text-4xl sm:text-4xl md:text-5xl lg:text-5xl font-bold mt-6 text-center text-amber-600 mb-6 leading-tight justify-center" />
        </div>

        <div className="lg:flex-row flex-col flex lg:items-stretch gap-8 text-center lg:mt-20 mt-8">
          <div className="flex-1 relative mx-auto h-[500px] lg:h-96 bg-cover bg-center p-4 pt-[80px] lg:pt-4 bg-no-repeat flex justify-start items-end text-center rounded-xl overflow-hidden bg-[url('/images/trigo.webp')]">
            <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />
            <div className="relative z-10 max-w-3xl mx-auto space-y-2 p-2 text-left">
              <h1 className="text-[25px] font-bold text-amber-400 ">{t("title1")}</h1>
              <p className="text-white text-md lg:text-lg">{t("description1")}</p>
            </div>
          </div>
          <div className="flex-1 relative mx-auto h-96 bg-cover bg-center p-4 pt-[80px] lg:pt-4 bg-no-repeat flex justify-start items-end text-center rounded-xl overflow-hidden bg-[url('/images/beach-bg.webp')]">
            <div className="absolute inset-0 bg-black/60 z-0" />
            <div className="relative z-10 max-w-3xl mx-auto space-y-2 p-2 text-left">
              <h1 className="text-[25px] font-bold  text-amber-400">{t("title2")}</h1>
              <p className="text-white text-md lg:text-lg ">{t("description2")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
