"use client";

import React from "react";
import { useTranslations } from "next-intl"; // Import useTranslations
import Image from "next/image";
import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect } from "react";
import BlurText from "@/components/BlurText";

export function About1() {
  const t = useTranslations("About"); // Use the translations for the About section
  const controls = useAnimation();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  useEffect(() => {
    if (inView) {
      controls.start({
        x: 0,
        opacity: 1,
        filter: "blur(0px)",
        transition: { duration: 0.5, ease: "easeOut" },
      });
    }
  }, [controls, inView]);

  return (
    <section className="relative bg-white py-20" id="About">
      <div className="container">
        <h2 className="text-4xl text-center font-bold text-amber-600 ">{t("title")}</h2>
        <div className="w-full h-12 absolute bg-white top-[-35px] rounded-t-[50px]"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 items-center w-full mx-auto gap-8">
          {/* Botella izquierda */}
          <motion.div ref={ref} initial={{ x: -100, opacity: 0, filter: "blur(10px)" }} animate={controls} className="hidden md:flex justify-center drop-shadow-lg w-full">
            <Image src="/images/blatvodka-bottle-full.webp" alt="Botella izquierda" className="drop-shadow-lg mt-12" width={300} height={600} loading="lazy" />
          </motion.div>

          {/* Contenido central */}
          <div className="text-center space-y-14 px-4">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">{t("heading1")}</h3>
              <p className="text-gray-600 text-base">{t("description1")}</p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">{t("heading2")}</h3>
              <p className="text-gray-600 text-base">{t("description2")}</p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">{t("heading3")}</h3>
              <p className="text-gray-600 text-base">{t("description3")}</p>
            </div>
          </div>

          {/* Botella derecha */}
          <motion.div ref={ref} initial={{ x: 100, opacity: 0, filter: "blur(10px)" }} animate={controls} className="hidden md:flex justify-center drop-shadow-lg w-full">
            <Image src="/images/blatvodka-bottle-full.webp" alt="Botella izquierda" className="drop-shadow-lg mt-12" width={300} height={600} loading="lazy" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function About2() {
  const t = useTranslations("Index.AboutSection"); // Use the translations for the About section
  const controls = useAnimation();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };
  useEffect(() => {
    if (inView) {
      controls.start({
        x: 0,
        opacity: 1,
        filter: "blur(0px)",
        transition: { duration: 0.5, ease: "easeOut" },
      });
    }
  }, [controls, inView]);

  return (
    <section className="relative py-10 bg-gradient-to-b from-white from-40% to-orange-50 to-90%">
      <div className="w-full h-12 absolute bg-white top-[-35px] rounded-t-[50px]"></div>
      <div className="container mx-auto">
        <div className="w-full text-center mx-auto flex flex-col items-center justify-center">
          <BlurText text={t("title")} delay={80} animateBy="words" direction="top" onAnimationComplete={handleAnimationComplete} className="font-heading text-4xl sm:text-4xl md:text-5xl lg:text-5xl font-bold mt-6 text-center text-amber-600 mb-6 leading-tight justify-center" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 items-start w-full mx-auto gap-8 relative">
          {/* Botella izquierda */}
          <motion.div ref={ref} initial={{ y: -100, opacity: 0, filter: "blur(10px)" }} animate={controls} className="mt-[60px] hidden md:flex justify-center drop-shadow-lg w-full sticky top-[160px]">
            <Image src="/images/blatvodka-bottle-full.webp" alt="Botella izquierda" className="drop-shadow-lg" width={350} height={600} loading="lazy" />
          </motion.div>

          {/* Contenido central */}
          <div className="px-2 py-4 mt-4  col-span-2">
            <h2 className="text-3xl text-center font-semibold text-gray-700 mb-3">{t("heading1")}</h2>
            <p className="text-gray-600 text-md lg:text-lg mt-10 text-center lg:text-left">
              {t("p1")}
              <br></br>
              {t("p2")}
            </p>
            <Image src="/images/blatvodka-barrels.webp" alt="Botella izquierda" className="mt-4 w-full border-amber-600 border-2 rounded-lg drop-shadow-md" width={500} height={200} style={{ objectFit: "contain" }} loading="lazy" />
            <p className="text-gray-600 text-md lg:text-lg mt-10 text-center lg:text-left">{t("p3")}</p>
            <p className="text-gray-600 text-md lg:text-lg mt-2 text-center lg:text-left">{t("p4")}</p>
            <Image src="/images/agua.webp" alt="Botella izquierda" className="mt-4 w-full border-amber-600 border-2 rounded-lg drop-shadow-md" width={500} height={200} style={{ objectFit: "contain" }} loading="lazy" />
          </div>

          {/* Botella derecha */}
          <motion.div ref={ref} initial={{ y: -100, opacity: 0, filter: "blur(10px)" }} animate={controls} className="mt-[60px] hidden md:flex justify-center drop-shadow-lg w-full sticky top-[160px]">
            <Image src="/images/blatvodka-bottle-full.webp" alt="Botella izquierda" className="drop-shadow-lg" width={350} height={600} loading="lazy" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
