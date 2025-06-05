"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import RotatingText from "@/src/components/RotatingText";

export default function PuritySection() {
  const t = useTranslations("Index");
  return (
    <section className="min-h-screen py-20 bg-gray-100 text-center Purity flex items-center justify-center relative">
      <div className="absolute w-full h-full bottom-[10%] z-10 overflow-x-hidden object-cover pointer-events-none user-select-none top-[40%] z-0">
        <Image src="/images/curvy-line.svg" alt="Curvy Line" width={102} height={100} className="w-[104vw] max-w-[104vw] mx-auto absolute left-[-2]" priority />
      </div>
      <div className="container  relative z-10">
        <div className="flex flex-row">
          <div className="left flex-1 max-width-[480px]">
            <div className="PurityBg drop-shadow-xl w-[480px] h-[700px] mx-auto flex flex-col items-center justify-center relative overflow-hidden bg-[url('/images/bartender.webp')] bg-cover bg-no-repeat rounded-full bg-center z-20">
              <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />
            </div>
          </div>
          <div className="right flex-1 flex justify-start align-center items-center">
            <div className="text-left bg-white/40 p-6 rounded-lg z-20 drop-shadow-xl backdrop-blur-md">
              <p className="text-xl text-amber-600 font-medium mb-0">{t("purityHeading")}</p>
              <div className="inline-flex items-center justify-center gap-0 mb-6">
                <span className="text-[40px] font-semibold text-gray-800">Mejor</span>
                <RotatingText
                  texts={["Sabor", "Calidad", "Suavidad", "Para Combinar"]}
                  colors={["text-orange-400", "text-blue-400", "text-green-400", "text-purple-400", "text-red-400"]}
                  mainClassName="inline px-2 sm:px-2 md:px-3 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                  splitLevelClassName="overflow-hidden  text-[40px] font-semibold text-gray-800"
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
              <p>
                La pureza excepcional de Blat Vodka transforma su experiencia de consumo, ofreciendo un Mejor Sabor que se disfruta tanto con hielo como sin él. Gracias a su proceso único, garantiza una Mejor Calidad que ayuda a reducir los efectos negativos de la resaca, haciendo que cada momento
                sea más placentero.
                <br />
                <br />
                Además, su suavidad inigualable lo convierte en la Bebida Ideal para cualquier ocasión, ya sea en tragos cortos o largos. Blat Vodka también es Mejor para Combinar, ya que su pureza realza los sabores de otros ingredientes, permitiéndote crear cócteles verdaderamente excepcionales.
              </p>
              {/* <div className="flex flex-row">
                <h3 className="text-amber-600 ">{t("puritySabor")}</h3>
                <p className="mx-3 text-lg mb-6">{t("purity1")}</p>
              </div>
              <div className="flex flex-row">
                <h3 className="text-amber-600">{t("purityCalidad")}</h3>
                <p className="mx-3 text-lg mb-6">{t("purity2")}</p>
              </div>
              <div className="flex flex-row">
                <h3 className="text-amber-600">{t("purityCombinar")}</h3>
                <p className="mx-3 text-lg mb-6">{t("purity3")}</p>
              </div>
              <div className="flex flex-row">
                <h3 className="text-amber-600">{t("puritySuavidad")}</h3>
                <p className="mx-3 text-lg mb-6">{t("purity4")}</p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
