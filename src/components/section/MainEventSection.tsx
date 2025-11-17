"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl"; // Import useTranslations and useLocale
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import BlurText from "@/components/BlurText";
import { useAnimation, useInView } from "framer-motion";
import { EventService } from "@/lib/eventService";
import { Event } from "@/types/event";
import { Link, usePathname } from "@/i18n/navigation";
import { MapPin, Loader2, CalendarPlus, CalendarDays } from "lucide-react";
import { downloadICSFile, CalendarEvent } from "@/utils/calendar";

export function MainEvent() {
  const t = useTranslations("Index.EventsSection");
  const locale = useLocale();
  const pathname = usePathname();
  const [featuredEvent, setFeaturedEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingPath, setLoadingPath] = useState<string | null>(null);

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
    if (loadingPath && pathname === loadingPath) {
      setLoadingPath(null);
    }
  }, [pathname, loadingPath]);

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

  // Format date for display
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    const localeCode = locale === "es" ? "es-ES" : "en-US";

    const day = date.getDate();
    const month = date.toLocaleDateString(localeCode, { month: "long" });
    const weekday = date.toLocaleDateString(localeCode, { weekday: "long" });

    // Add ordinal suffix for English dates
    const getOrdinalSuffix = (day: number) => {
      if (locale === "en") {
        if (day > 3 && day < 21) return "th";
        switch (day % 10) {
          case 1:
            return "st";
          case 2:
            return "nd";
          case 3:
            return "rd";
          default:
            return "th";
        }
      }
      return "";
    };

    const ordinalSuffix = getOrdinalSuffix(day);

    return {
      day,
      month: month.charAt(0).toUpperCase() + month.slice(1), // Capitalize first letter
      weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1), // Capitalize first letter
      ordinalSuffix,
    };
  };

  const handleLinkClick = (href: string) => {
    setLoadingPath(href);
  };

  const handleAddToCalendar = (event: Event, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any navigation
    e.stopPropagation();

    const locationText = event.location.venue ? `${event.location.venue}, ${event.location.town}, ${event.location.municipality}` : `${event.location.town}, ${event.location.municipality}`;

    const calendarEvent: CalendarEvent = {
      title: event.name,
      description: event.description,
      startDate: event.date,
      location: locationText,
      url: `${window.location.origin}/events/${event.id}`,
    };

    downloadICSFile(calendarEvent);
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="w-full">
      {/* Skeleton carousel */}
      <div className="flex gap-4 mb-8">
        <Skeleton className="h-64 md:h-80 lg:h-96 w-full rounded-md basis-3/4 md:basis-2/3 lg:basis-1/3" />
        <Skeleton className="h-64 md:h-80 lg:h-96 w-full rounded-md basis-3/4 md:basis-2/3 lg:basis-1/3" />
        <Skeleton className="h-64 md:h-80 lg:h-96 w-full rounded-md basis-3/4 md:basis-2/3 lg:basis-1/3 hidden lg:block" />
      </div>

      {/* Skeleton event details */}
      <div className="flex flex-row items-center justify-center h-full w-full mt-8">
        <div className="basis-1/3 flex flex-col items-end lg:px-6 px-0 border-r-2 border-gray-200 py-5 items-center lg:items-end">
          <div className="text-center">
            <Skeleton className="h-6 w-20 mb-2" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
        <div className="basis-2/3 px-6 lg:pr-6 pr-0 flex flex-col">
          <Skeleton className="h-12 w-48 mb-2" />
          <Skeleton className="h-4 w-36 mb-4" />
          <Skeleton className="h-10 w-[150px] lg:w-[200px] rounded-full" />
        </div>
      </div>
    </div>
  );

  return (
    <section id="MainEvent" className="w-full mt-0 lg:mt-[0px] flex flex-col items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center h-full">
          {/* Title and description always show */}
          <BlurText text={t("title")} delay={80} animateBy="words" direction="top" onAnimationComplete={handleAnimationComplete} className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold mt-6 text-center text-amber-600 mb-6 leading-tight justify-center" />
          <BlurText text={t("description")} delay={120} animateBy="words" direction="top" className="text-lg text-center justify-center mb-8 text-center" />

          {/* Conditional content based on loading and event state */}
          {isLoading ? (
            <LoadingSkeleton />
          ) : !featuredEvent ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No hay eventos destacados en este momento</p> {/* Spanish fallback text */}
              <Link href="/events" onClick={() => handleLinkClick("/events")}>
                <button className="bg-amber-600 text-white px-6 py-2 rounded-full hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 mx-auto">
                  {loadingPath === "/events" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {t("verEventos")}
                    </>
                  ) : (
                    t("verEventos")
                  )}
                </button>
              </Link>
            </div>
          ) : (
            <>
              {/* Featured event indicator */}
              <div className="mb-4 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                {t("featuredEvent")}
              </div>

              <Carousel
                opts={{
                  align: featuredEvent.images.length < 3 ? "center" : "start",
                  loop: featuredEvent.images.length > 1,
                }}
                id="Carousel"
                className={featuredEvent.images.length < 3 ? "w-full flex justify-center" : "w-full"}
              >
                <CarouselContent className={featuredEvent.images.length < 3 ? "justify-center" : ""}>
                  {featuredEvent.images.map((src, i) => (
                    <CarouselItem key={i} className="basis-auto pl-4">
                      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden rounded-md flex items-center justify-center bg-gray-100">
                        <Image src={src} loading="lazy" alt={`Evento ${featuredEvent.name} ${i + 1}`} width={600} height={384} className="hover:cursor-grab active:cursor-grabbing h-full w-auto object-contain transition-transform duration-300 hover:scale-105" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              {/* Desktop View */}
              <div className="hidden md:block ">
                <div className="flex flex-col items-center justify-center h-full w-full mt-8">
                  <div className="text-center">
                    <p className="text-amber-600 font-medium text-xl">
                      {formatEventDate(featuredEvent.date).weekday} |{" "}
                      {locale === "en" ? `${formatEventDate(featuredEvent.date).month} ${formatEventDate(featuredEvent.date).day}${formatEventDate(featuredEvent.date).ordinalSuffix}` : `${formatEventDate(featuredEvent.date).day} ${formatEventDate(featuredEvent.date).month}`}
                    </p>
                  </div>
                  <h2 className="text-xxl lg:text-3xl font-bold flex items-center gap-2">{featuredEvent.name}</h2>
                  <a href={featuredEvent.location.googleMapsLink || `https://www.google.com/maps/search/?api=1&query=${featuredEvent.location.latitude},${featuredEvent.location.longitude}`} target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 transition-colors">
                    <MapPin className="inline-block mr-1" />
                    {featuredEvent.location.venue ? `${featuredEvent.location.venue}, ${featuredEvent.location.town}, ${featuredEvent.location.municipality}` : `${featuredEvent.location.town}, ${featuredEvent.location.municipality}`}
                  </a>
                  {/* {featuredEvent.website && (
                        <a href={featuredEvent.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 transition-colors">
                          <ExternalLink size={14} />
                          {featuredEvent.website.replace(/^https?:\/\//, "")}
                        </a>
                      )} */}
                  <div className="flex flex-row gap-8 items-center justify-center mt-6">
                    <Link href={`/events/${featuredEvent.id}`} onClick={() => handleLinkClick(`/events/${featuredEvent.id}`)}>
                      <button className=" w-[150px] lg:w-[200px] bg-amber-600 text-white px-1 py-2 rounded-full hover:bg-amber-700 transition-colors flex items-center justify-center gap-2">
                        {loadingPath === `/events/${featuredEvent.id}` ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            {t("verEventos")}
                          </>
                        ) : (
                          <>
                            <CalendarDays className="text-white" size={20} /> {t("verEventos")}
                          </>
                        )}
                      </button>
                    </Link>
                    <button onClick={(e) => handleAddToCalendar(featuredEvent, e)} className="inline-flex items-center gap-1 text-lg text-amber-600 hover:text-amber-700 underline transition-colors">
                      <CalendarPlus size={20} />
                      {t("addToCalendar")}
                    </button>
                  </div>
                </div>
              </div>
              {/* Mobile View */}
              <div className="block md:hidden ">
                <div className="flex flex-col text-center items-center justify-center h-full w-full mt-8">
                  <div className="my-2">
                    <p className="text-amber-600 font-sm text-lg">
                      {formatEventDate(featuredEvent.date).weekday} |{" "}
                      {locale === "en" ? `${formatEventDate(featuredEvent.date).month} ${formatEventDate(featuredEvent.date).day}${formatEventDate(featuredEvent.date).ordinalSuffix}` : `${formatEventDate(featuredEvent.date).day} ${formatEventDate(featuredEvent.date).month}`}
                    </p>
                  </div>
                  <h2 className="text-xxl lg:text-3xl font-bold flex items-center gap-2">{featuredEvent.name}</h2>
                  <div className="mt-2 flex flex-col items-center gap-3">
                    <a href={featuredEvent.location.googleMapsLink || `https://www.google.com/maps/search/?api=1&query=${featuredEvent.location.latitude},${featuredEvent.location.longitude}`} target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 transition-colors">
                      <MapPin className="inline-block mr-1" />
                      {featuredEvent.location.venue ? `${featuredEvent.location.venue}, ${featuredEvent.location.town}, ${featuredEvent.location.municipality}` : `${featuredEvent.location.town}, ${featuredEvent.location.municipality}`}
                    </a>
                    {/* {featuredEvent.website && (
                      <a href={featuredEvent.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 transition-colors">
                        <ExternalLink size={14} />
                        {featuredEvent.website.replace(/^https?:\/\//, "")}
                      </a>
                    )} */}
                  </div>
                  <div className="flex align-items-center justify-center mt-4 gap-2">
                    <Link href={`/events/${featuredEvent.id}`} onClick={() => handleLinkClick(`/events/${featuredEvent.id}`)}>
                      <button className="w-[150px] lg:w-[200px] bg-amber-600 text-white px-1 py-2 rounded-full hover:bg-amber-700 transition-colors flex items-center justify-center gap-2">
                        {loadingPath === `/events/${featuredEvent.id}` ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            {t("verEventos")}
                          </>
                        ) : (
                          <>
                            <CalendarDays className="text-white" size={20} /> {t("verEventos")}
                          </>
                        )}
                      </button>
                    </Link>
                    <button onClick={(e) => handleAddToCalendar(featuredEvent, e)} className="inline-flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 underline transition-colors">
                      <CalendarPlus size={14} />
                      {t("addToCalendar")}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
