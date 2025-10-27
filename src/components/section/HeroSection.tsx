"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl"; // Import useTranslations
import { Button } from "@/components/ui/button";
import LazyBlurText from "@/components/LazyBlurText";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";

export function Hero() {
  const t = useTranslations("Index");
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"], // Try the original offset
  });

  // Alternative: Try using global scroll instead of target-specific
  const { scrollY } = useScroll();

  // Different parallax rates - Image is left column, Text is right column
  const imageColumnY = useTransform(scrollY, [0, 1000], [0, -150]); // Left column (image) - faster
  const textColumnY = useTransform(scrollY, [0, 1000], [0, 150]); // Right column (text) - slower

  // Debug: Log scroll progress and parallax values
  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      // console.log("Scroll Y:", latest);
      // console.log("Image Y:", imageColumnY.get());
      // console.log("Text Y:", textColumnY.get());
    });

    return () => unsubscribe();
  }, [scrollY, imageColumnY, textColumnY]);
  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };
  return (
    <section ref={ref} id="Hero" className="min-h-auto pt-20 pb-10 lg:py-0 lg:min-h-screen bg-contain bg-no-repeat bg-left flex flex-col items-center justify-center relative">
      <motion.div className="container mx-auto px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <div className="flex flex-col-reverse lg:flex-row justify-between items-center gap-8 lg:gap-12">
          {/* Image goes last on mobile, side-by-side on desktop */}
          <motion.div
            className="imageWrapper overflow-hidden w-full flex justify-center lg:justify-end"
            style={{ y: imageColumnY }}
            initial={{
              opacity: 0,
              filter: "blur(8px)",
            }}
            animate={{
              opacity: 1,
              filter: "blur(0px)",
            }}
            transition={{
              duration: 1.0,
              delay: 0.3,
              ease: "easeOut",
            }}
          >
            <Image src="/images/blat_beach.webp" alt="Blat Bottle at the Beach" width={600} height={600} priority className="rounded-3xl w-full max-w-[300px] lg:!max-w-[520px] lg:max-w-none" />
          </motion.div>

          {/* Text content */}
          <motion.div
            className="flex flex-col items-center lg:items-start sm:justify-start justify-center text-center lg:text-left w-full"
            style={{ y: textColumnY }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease: "easeOut",
            }}
          >
            {/* Keep original BlurText for above-the-fold content */}
            <LazyBlurText text={t("description")} delay={60} animateBy="words" direction="top" onAnimationComplete={handleAnimationComplete} className="font-heading justify-center lg:justify-start text-4xl  md:text-5xl lg:text-7xl font-bold mt-6 text-amber-600 mb-6 leading-tight" />
            {/* <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mt-6 text-amber-600 mb-6 leading-tight">{t("description")}</h1> */}

            <motion.div
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{
                duration: 0.8,
                delay: 1.2,
                ease: "easeOut",
              }}
            >
              <Link href="/search">
                <Button size="lg" className="rounded-full h-12 px-12 bg-amber-600 text-white text-lg sm:text-xl hover:bg-amber-700 transition-colors ">
                  {t("heroButton")}
                  <div></div>
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
