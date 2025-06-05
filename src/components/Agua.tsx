"use client";

import React from "react";
import { useTranslations } from "next-intl"; // Import useTranslations
import Image from "next/image";

export default function Agua() {
  const t = useTranslations("Agua"); // Use the translations for the About section

  return (
    <section className=" py-20 min-h-screen">
      <div className="container mx-auto  py-12">
        <p className="text-2xl flex justify-center text-center mb-4">{t("heading1")}</p>
        <h2 className="text-4xl flex justify-center text-center font-bold text-amber-600 mb-10">{t("heading2")}</h2>

        <div className="flex-row flex items-stretch gap-8 text-center">
          <div className="flex-1 relative h-auto mx-auto h-96 bg-cover bg-center p-4 bg-no-repeat flex justify-start items-end text-center rounded-xl overflow-hidden bg-[url('/images/trigo.jpg')]">
            <div className="absolute inset-0 bg-black/60 z-0" />
            <div className="relative z-10 max-w-3xl mx-auto space-y-2 p-2 text-left">
              <h1 className="text-[25px] font-bold text-amber-400">{t("title1")}</h1>
              <p className="text-white text-l">{t("description1")}</p>
            </div>
          </div>
          <div className="flex-1 relative h-auto mx-auto h-96 bg-cover bg-center p-4 bg-no-repeat flex justify-start items-end text-center rounded-xl overflow-hidden bg-[url('/images/beach-bg.jpg')]">
            <div className="absolute inset-0 bg-black/60 z-0" />
            <div className="relative z-10 max-w-3xl mx-auto space-y-2 p-2 text-left">
              <h1 className="text-[25px] font-bold text-amber-400">{t("title2")}</h1>
              <p className="text-white text-l">{t("description2")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
