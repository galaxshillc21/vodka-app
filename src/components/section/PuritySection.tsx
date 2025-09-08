"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import RotatingText from "@/components/RotatingText";

export default function PuritySection() {
  const t = useTranslations("Index.PuritySection");
  return (
    <section className="h-auto py-20 bg-gray-100 text-center Purity flex items-center justify-center relative">
      <div className="absolute w-full h-full top-0 overflow-x-hidden object-cover pointer-events-none user-select-none z-0">
        <Image src="/images/curvy-line.svg" alt="Curvy Line" width={102} height={100} className="w-[104vw] max-w-[104vw] mx-auto absolute left-[-2] lg:top-[30%] top-[20%]" loading="lazy" />
      </div>
      <div className="container relative z-10  px-4 lg:py-0">
        <div className="flex flex-col lg:flex-row lg:gap-12 gap-0 ">
          <div className="left flex-1 max-w-[380px]">
            <div className="PurityBg drop-shadow-xl w-[250px] lg:w-[380px] h-[410px] lg:h-[600px] mx-auto flex flex-col items-center justify-center relative overflow-hidden bg-[url('/images/blat_top.webp')] bg-cover bg-no-repeat rounded-full bg-center z-20 border border-amber-600">
              {/* <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" /> */}
            </div>
          </div>
          <div className="right flex-1 flex justify-start align-center items-center mt-[-30px] lg:mt-0">
            <div className="text-left bg-white/60 p-6 rounded-lg z-20 drop-shadow-xl backdrop-blur-sm">
              <p className="text-xl text-amber-600 font-semibold mb-0 uppercase">{t("adds")}</p>
              <div className="inline-flex items-center justify-center gap-0 mb-6">
                <span className="text-[30px] lg:text-[40px] font-semibold text-gray-800 font-heading">{t("mejor")}</span>
                <RotatingText
                  texts={[t("one"), t("two"), t("three"), t("four")]}
                  colors={["text-orange-400", "text-sky-400", "text-green-400", "text-purple-400"]}
                  mainClassName="inline px-2 sm:px-2 md:px-3 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                  splitLevelClassName="overflow-hidden text-[30px] lg:text-[40px] font-heading font-semibold text-gray-800"
                  elementLevelClassName=""
                  splitBy="characters"
                  staggerFrom={"last"}
                  initial={{ y: "100%", filter: "blur(4px)" }}
                  animate={{ y: 0, filter: "blur(0px)" }}
                  exit={{ y: "-120%", filter: "blur(4px)" }}
                  staggerDuration={0.025}
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  rotationInterval={3000}
                />
              </div>
              <p className="text-gray-600 text-md lg:text-lg">
                {t("p1")}
                <br />
                <br />
                {t("p2")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
