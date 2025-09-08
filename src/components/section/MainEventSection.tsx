"use client";

import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl"; // Import useTranslations
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import BlurText from "@/components/BlurText";
import { useAnimation, useInView } from "framer-motion";
import { useEffect } from "react";
import Link from "next/link";

export function MainEvent() {
  const t = useTranslations("Index.EventsSection");
  const images = ["/images/eventos/mambo/img1.jpg", "/images/eventos/mambo/img2.jpg", "/images/eventos/mambo/img3.jpg", "/images/eventos/mambo/img4.jpg", "/images/eventos/mambo/img5.jpg"];
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
    <section id="MainEvent" className="w-full mt-0 lg:mt-[0px] flex flex-col items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center h-full">
          <BlurText text={t("title")} delay={80} animateBy="words" direction="top" onAnimationComplete={handleAnimationComplete} className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold mt-6 text-center text-amber-600 mb-6 leading-tight justify-center" />
          <p className="text-lg mb-8 text-center">{t("description")}</p>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent>
              {images.map((src, i) => (
                <CarouselItem key={i} className="basis-2/3 lg:basis-1/3">
                  <Image src={src} loading="lazy" alt={`Evento mambo ${i + 1}`} width={800} height={600} className="hover:cursor-grab active:cursor-grabbing rounded-md" />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="flex flex-row items-center justify-center h-full w-full mt-8">
            <div className="basis-1/3 flex flex-col items-end lg:px-6 px-0 border-r-2 border-amber-600 py-5 items-center lg:items-end">
              <div className="text-center">
                <p className="text-amber-600 font-medium text-xl">{t("thursday")}</p>
                <h2 className="text-3xl">24 {t("july")}</h2>
              </div>
            </div>
            <div className="basis-2/3 px-6 lg:pr-6 pr-0 flex flex-col">
              <h2 className="text-xxl lg:text-5xl">Mambo Lounge Bar</h2>
              <p>Rooftop CC Sandia Playa del Ingles</p>
              <Link href="/events">
                <button className="mt-4 w-[150px] lg:w-[200px] bg-amber-600 text-white px-1 py-2 rounded-full hover:bg-amber-700 transition-colors">{t("verEventos")}</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
