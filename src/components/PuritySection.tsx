"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import RotatingText from "@/src/components/RotatingText";

export default function PuritySection() {
  const t = useTranslations("Index");
  return (
    <section className="min-h-screen py-20 bg-gray-100 text-center Purity flex items-center justify-center relative">
      <div className="absolute w-full h-full bottom-[10%] z-10 overflow-hidden object-cover pointer-events-none user-select-none top-[40%]">
        <Image src="/images/curvy-line.svg" alt="Curvy Line" width={102} height={100} className="w-[102vw]" priority />
      </div>
      <div className="container">
        <div className="flex flex-row">
          <div className="left flex-1">
            <div className="PurityBg w-[480px] h-[700px] mx-auto flex flex-col items-center justify-center relative overflow-hidden bg-[url('/images/bartender.webp')] bg-cover bg-no-repeat rounded-full bg-center z-20">
              <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />
            </div>
          </div>
          <div className="right flex-1 flex justify-start align-center items-center">
            <div className="text-left">
              <p className="text-xl text-amber-600 font-bold mb-12">{t("purityHeading")}</p>
              <RotatingText
                texts={["Sabor", "Calidad", "Suavidad", "Para Combinar"]}
                mainClassName="px-2 sm:px-2 md:px-3 bg-cyan-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                staggerFrom={"last"}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2000}
              />
              <h1 className="text-xl text-amber-600 font-bold mb-12">MAS</h1>
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
