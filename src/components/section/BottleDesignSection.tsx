"use client";

import Image from "next/image";
import { useTranslations } from "next-intl"; // Import useTranslations
import BlurText from "@/src/components/BlurText";

export function BottleDesignParallax() {
  const t = useTranslations("BottleShow");
  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };
  return (
    <section className="BottleShow relative bg-gradient-to-b from-white from-40% to-gray-100 to-90%">
      <div className="relative h-[200vh]">
        {/* Sticky text container */}
        <div className="sticky mx-auto top-0 z-20 flex flex-col items-center justify-center h-screen max-w-4xl w-full text-center">
          <BlurText text={t("title")} delay={80} animateBy="words" direction="top" onAnimationComplete={handleAnimationComplete} className="text-4xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mt-6 text-amber-600 mb-6 leading-tight text-center justify-center" />
        </div>
        {/* Bottle image coming from bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end h-full z-30">
          <Image src="/images/blatvodka-bottle-full.webp" alt="Blat Vodka Bottle" className="drop-shadow-2xl" width={400} height={800} priority />
        </div>
      </div>
    </section>
  );
}

export function BottleDesign() {
  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };
  return (
    <section className="BottleDesign h-auto relative py-20 ">
      <div className="bg ">
        <div className="relative container mx-auto">
          <div className="w-full text-center mx-auto flex flex-col items-center justify-center">
            <BlurText text="Diseño que Refleja la Pureza" delay={80} animateBy="words" direction="top" onAnimationComplete={handleAnimationComplete} className="text-4xl sm:text-4xl md:text-5xl lg:text-5xl font-bold mt-6 text-center text-amber-600 mb-6 leading-tight" />
          </div>

          <div className="mt-20 relative flex flex-row justify-center items-center text-center  bg-cover bg-no-repeat relative z-10 border rounded-xl w-full h-96 drop-shadow-md">
            <div className="w-full h-full backdrop-blur-xl bg-gray-100 z-10 rounded-xl flex flex-row justify-center align-center items-center">
              <div className="relative bottom-20 flex-[0_1_30%] bottle-wrapper align-center flex justify-center items-center">
                <Image src="/images/blatvodka-bottle-full.webp" alt="Blat Vodka Bottle" className="rotate-[-10deg]" width={250} height={800} priority />
              </div>
              <div className="content flex-1 text-left">
                <p className="text-xl mb-4 text-gray-600">
                  La botella de Blat Vodka es un reflejo de su contenido: <span className="font-bold">limpia, cristalina y de una elegancia singular.</span>
                </p>
                <p className="text-xl mb-4 text-gray-600">
                  Diseñada por el prestigioso <span className="font-semibold">Peter Schmidt Group</span>, cuyas obras son exhibidas incluso en el Museo Metropolitano de Arte Moderno de Nueva York, nuestra botella ha sido galardonada con{" "}
                  <span className="font-bold">tres premios internacionales.</span>
                </p>
                <p className="text-xl text-gray-600">Su diseño está ingeniosamente inspirado en el tradicional vaso de vodka, incorporando los relieves del propio nombre para una estética distintiva y táctil.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
