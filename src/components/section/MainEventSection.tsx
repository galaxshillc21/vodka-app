"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl"; // Import useTranslations
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import BlurText from "@/components/BlurText";
import { useAnimation, useInView } from "framer-motion";
import Link from "next/link";
import { EventService } from "@/lib/eventService";
import { Event } from "@/types/event";

export function MainEvent() {
  const t = useTranslations("Index.EventsSection");
  const [featuredEvent, setFeaturedEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fallback images for when no featured event exists
  const fallbackImages = ["/images/eventos/mambo/img1.jpg", "/images/eventos/mambo/img2.jpg", "/images/eventos/mambo/img3.jpg", "/images/eventos/mambo/img4.jpg", "/images/eventos/mambo/img5.jpg"];

  const controls = useAnimation();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  // Fetch featured event on component mount
  useEffect(() => {
    const fetchFeaturedEvent = async () => {
      try {
        setIsLoading(true);
        const event = await EventService.getFeaturedEvent();
        setFeaturedEvent(event);
      } catch (error) {
        console.error("Error fetching featured event:", error);
        setFeaturedEvent(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedEvent();
  }, []);

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

  // Use featured event images if available, otherwise use fallback
  const displayImages = featuredEvent?.images && featuredEvent.images.length > 0 ? featuredEvent.images : fallbackImages;

  // Format date for display
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("es-ES", { month: "long" });
    const weekday = date.toLocaleDateString("es-ES", { weekday: "long" });
    return { day, month, weekday };
  };

  // Get event date info (either featured event or fallback)
  const eventDateInfo = featuredEvent ? formatEventDate(featuredEvent.date) : { day: 24, month: t("july"), weekday: t("thursday") };

  // Get event details (either featured event or fallback)
  const eventName = featuredEvent?.name || "Mambo Lounge Bar";
  const eventLocation = featuredEvent?.location ? `${featuredEvent.location.town}, ${featuredEvent.location.municipality}` : "Rooftop CC Sandia Playa del Ingles";

  return (
    <section id="MainEvent" className="w-full mt-0 lg:mt-[0px] flex flex-col items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center h-full">
          <BlurText text={t("title")} delay={80} animateBy="words" direction="top" onAnimationComplete={handleAnimationComplete} className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold mt-6 text-center text-amber-600 mb-6 leading-tight justify-center" />
          <p className="text-lg mb-8 text-center">{t("description")}</p>

          {/* Featured event indicator */}
          {!isLoading && featuredEvent && (
            <div className="mb-4 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              Evento Destacado
            </div>
          )}

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent>
              {displayImages.map((src, i) => (
                <CarouselItem key={i} className="basis-2/3 lg:basis-1/3">
                  <div className="relative h-64 md:h-80 lg:h-96 w-full overflow-hidden rounded-md">
                    <Image src={src} loading="lazy" alt={`Evento ${featuredEvent?.name || "mambo"} ${i + 1}`} fill sizes="(max-width: 768px) 66vw, (max-width: 1024px) 50vw, 33vw" className="hover:cursor-grab active:cursor-grabbing object-cover transition-transform duration-300 hover:scale-105" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="flex flex-row items-center justify-center h-full w-full mt-8">
            <div className="basis-1/3 flex flex-col items-end lg:px-6 px-0 border-r-2 border-amber-600 py-5 items-center lg:items-end">
              <div className="text-center">
                <p className="text-amber-600 font-medium text-xl">{eventDateInfo.weekday}</p>
                <h2 className="text-3xl">
                  {eventDateInfo.day} {eventDateInfo.month}
                </h2>
              </div>
            </div>
            <div className="basis-2/3 px-6 lg:pr-6 pr-0 flex flex-col">
              {featuredEvent?.website ? (
                <a href={featuredEvent.website} target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 transition-colors">
                  <h2 className="text-xxl lg:text-5xl">{eventName}</h2>
                </a>
              ) : (
                <h2 className="text-xxl lg:text-5xl">{eventName}</h2>
              )}
              <p>{eventLocation}</p>
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
