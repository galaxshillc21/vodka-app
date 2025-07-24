"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl"; // Import useTranslations
import { Button } from "@/components/ui/button";
import LazyBlurText from "@/components/LazyBlurText";

export function Hero() {
  const t = useTranslations("Index");
  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };
  return (
    <section id="Hero" className="min-h-auto pt-20 pb-10 lg:py-0 lg:min-h-screen bg-contain bg-no-repeat bg-left flex flex-col items-center justify-center relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse lg:flex-row justify-between items-center gap-8 lg:gap-12">
          {/* Image goes last on mobile, side-by-side on desktop */}
          <div className="imageWrapper overflow-hidden w-full flex justify-center lg:justify-end">
            <Image src="/images/blat_beach.webp" alt="Blat Bottle at the Beach" width={600} height={600} priority className="rounded-3xl w-full max-w-[300px] lg:!max-w-[520px] lg:max-w-none" />
          </div>

          {/* Text content */}
          <div className="flex flex-col items-center lg:items-start sm:justify-start justify-center text-center lg:text-left w-full">
            {/* Keep original BlurText for above-the-fold content */}
            <LazyBlurText text={t("description")} delay={60} animateBy="words" direction="top" onAnimationComplete={handleAnimationComplete} className="font-heading justify-center lg:justify-start text-4xl  md:text-5xl lg:text-7xl font-bold mt-6 text-amber-600 mb-6 leading-tight" />
            {/* <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mt-6 text-amber-600 mb-6 leading-tight">{t("description")}</h1> */}

            <Link href="/search">
              <Button size="lg" className="rounded-full h-12 px-12 bg-amber-600 text-white text-lg sm:text-xl hover:bg-amber-700 transition-colors ">
                {t("heroButton")}
                <div></div>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
