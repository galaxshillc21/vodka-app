"use client";

import React from "react";
import { useTranslations } from "next-intl"; // Import useTranslations
// import Image from "next/image";
import BlurText from "@/src/components/BlurText";

export default function Agua() {
  const t = useTranslations("Agua"); // Use the translations for the About section
  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };
  return (
    <section className=" py-20 h-auto" id="Agua">
      <div className="container mx-auto py-12">
        <p className="text-md flex justify-center text-center mb-1">{t("heading1")}</p>
        <div className="w-full text-center mx-auto flex flex-col items-center justify-center">
          <BlurText text={t("heading2")} delay={80} animateBy="words" direction="top" onAnimationComplete={handleAnimationComplete} className="text-4xl sm:text-4xl md:text-5xl lg:text-5xl font-bold mt-6 text-center text-amber-600 mb-6 leading-tight" />
        </div>

        <div className="flex-row flex items-stretch gap-8 text-center">
          <div className="flex-1 relative mx-auto h-96 bg-cover bg-center p-4 bg-no-repeat flex justify-start items-end text-center rounded-xl overflow-hidden bg-[url('/images/trigo.jpg')]">
            <div className="absolute inset-0 bg-black/60 z-0" />
            <div className="relative z-10 max-w-3xl mx-auto space-y-2 p-2 text-left">
              <h1 className="text-[25px] font-bold text-amber-400  text-shadow-xl">{t("title1")}</h1>
              <p className="text-white text-l text-shadow-xl">{t("description1")}</p>
            </div>
          </div>
          <div className="flex-1 relative mx-auto h-96 bg-cover bg-center p-4 bg-no-repeat flex justify-start items-end text-center rounded-xl overflow-hidden bg-[url('/images/beach-bg.jpg')]">
            <div className="absolute inset-0 bg-black/60 z-0" />
            <div className="relative z-10 max-w-3xl mx-auto space-y-2 p-2 text-left">
              <h1 className="text-[25px] font-bold  text-shadow-xl text-amber-400">{t("title2")}</h1>
              <p className="text-white text-l  text-shadow-xl">{t("description2")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
