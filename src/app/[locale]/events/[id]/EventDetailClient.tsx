"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Calendar, MapPin, ExternalLink, Share2, Tag, CalendarPlus } from "lucide-react";
import { Event } from "@/types/event";
import { EventService } from "@/lib/eventService";
import { Link } from "@/i18n/navigation";
import InlineMap from "@/components/InlineMap";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { downloadICSFile, CalendarEvent } from "@/utils/calendar";

interface EventDetailClientProps {
  eventId: string;
}

// Helper function to extract coordinates from Google Maps link
async function extractCoordinatesFromGoogleMapsLink(link: string): Promise<[number, number] | null> {
  try {
    let urlToProcess = link;

    // Check if it's a shortened Google Maps URL
    if (link.includes("goo.gl") || link.includes("maps.app.goo.gl")) {
      try {
        // Use our API route to resolve the shortened URL
        const response = await fetch(`/api/resolve-url?url=${encodeURIComponent(link)}`);
        const data = await response.json();
        if (data.resolvedUrl) {
          urlToProcess = data.resolvedUrl;
        }
      } catch (error) {
        console.log("Could not resolve shortened URL:", error);
      }
    }

    // Handle different Google Maps URL formats
    // Format 1: Direct coordinates in URL with @ symbol
    const coordRegex = /@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const match = urlToProcess.match(coordRegex);

    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      return [lng, lat]; // [longitude, latitude] for MapLibre
    }

    // Format 2: Coordinates in query parameter
    try {
      const urlParams = new URL(urlToProcess);
      const query = urlParams.searchParams.get("query");
      if (query) {
        const queryCoordMatch = query.match(/(-?\d+\.?\d*),(-?\d+\.?\d*)/);
        if (queryCoordMatch) {
          const lat = parseFloat(queryCoordMatch[1]);
          const lng = parseFloat(queryCoordMatch[2]);
          return [lng, lat];
        }
      }
    } catch (urlError) {
      console.log("Could not parse URL:", urlError);
    }

    return null;
  } catch (error) {
    console.log("Could not extract coordinates from Google Maps link:", error);
    return null;
  }
}

export default function EventDetailClient({ eventId }: EventDetailClientProps) {
  const t = useTranslations("Index.EventsSection");
  const locale = useLocale();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [mapCoordinates, setMapCoordinates] = useState<[number, number] | null>(null);

  // Fetch event data on client side
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const eventData = await EventService.getEventById(eventId);
        if (eventData) {
          setEvent(eventData);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to fetch event:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  // Helper function to format date with proper locale
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    const localeCode = locale === "es" ? "es-ES" : "en-US";

    if (locale === "en") {
      const day = date.getDate();
      const getOrdinalSuffix = (day: number) => {
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
      };
      const month = date.toLocaleDateString(localeCode, { month: "long" });
      const year = date.getFullYear();
      const weekday = date.toLocaleDateString(localeCode, { weekday: "long" });
      return `${weekday}, ${month} ${day}${getOrdinalSuffix(day)}, ${year}`;
    } else {
      return date.toLocaleDateString(localeCode, {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      });
    }
  };

  // Try to get coordinates for map display
  useEffect(() => {
    if (!event) return;

    const getCoordinates = async () => {
      let coordinates: [number, number] | null = null;

      // First, try existing lat/lng if available
      if (event.location.latitude && event.location.longitude) {
        coordinates = [event.location.longitude, event.location.latitude];
      }
      // Otherwise, try to extract from Google Maps link
      else if (event.location.googleMapsLink) {
        coordinates = await extractCoordinatesFromGoogleMapsLink(event.location.googleMapsLink);
      }

      setMapCoordinates(coordinates);
    };

    getCoordinates();
  }, [event]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-[120px]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-[120px]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{t("eventNotFound") || "Event Not Found"}</h1>
              <p className="text-gray-600 mb-6">{t("eventNotFoundDescription") || "The event you're looking for could not be found."}</p>
              <Link href="/events" className="inline-flex items-center text-amber-600 hover:text-amber-700 transition-colors">
                ← {t("backToEvents") || "Back to Events"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    const shareData = {
      title: event.name,
      text: event.description,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error sharing:", err);
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      // Could show a toast notification here
    }
  };

  const handleAddToCalendar = () => {
    const locationText = event.location.venue ? `${event.location.venue}, ${event.location.town}, ${event.location.municipality}` : `${event.location.town}, ${event.location.municipality}`;

    const calendarEvent: CalendarEvent = {
      title: event.name,
      description: event.description,
      startDate: event.date,
      location: locationText,
      url: window.location.href,
    };

    downloadICSFile(calendarEvent);
  };

  const locationText = event.location.venue ? `${event.location.venue}, ${event.location.town}, ${event.location.municipality}` : `${event.location.town}, ${event.location.municipality}`;

  return (
    <div className="min-h-screen w-full flex flex-row items-stretch bg-gradient-to-br from-amber-50 to-white">
      {/* Left side - Image */}
      <div className="basis-2/5 min-h-screen hidden lg:block relative">
        {event.images.length > 0 ? (
          <div className="relative w-full h-full">
            <Image src={event.images[0]} alt={event.name} fill className="object-cover" priority />
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-amber-600 to-amber-700 flex items-center justify-center">
            <Calendar size={64} className="text-white" />
          </div>
        )}
      </div>

      {/* Right side - Content */}
      <div className="basis-1/1 lg:basis-3/5 pt-[80px] w-full flex flex-col items-center justify-start p-4 lg:p-8 overflow-y-auto">
        <div className="w-full max-w-3xl">
          {/* Back navigation */}
          <div className="mb-6">
            <Link href="/events" className="inline-flex items-center text-amber-600 hover:text-amber-700 transition-colors">
              ← {t("backToEvents") || "Back to Events"}
            </Link>
          </div>

          {/* Event card */}
          {/* Featured badge */}
          {event.featured && (
            <div className="bg-gradient-to-r from-amber-600 to-transparent text-white px-6 py-3 text-left">
              <span className="flex items-center justify-start gap-2 font-semibold">
                <Tag size={16} />
                {t("featuredEvent")}
              </span>
            </div>
          )}

          {/* Event content */}
          <div className="p-6 md:p-8">
            {/* Title and share button */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-fraunces">{event.name}</h1>
              <button onClick={handleShare} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0">
                <Share2 size={16} />
                {t("share")}
              </button>
            </div>

            {/* Event details */}
            <div className="Details space-y-4 mb-8">
              {/* Location */}
              <div className="flex flex-col md:flex-row align-items-center gap-3">
                <div className="Left w-full md:w-2/5">
                  {/* Date */}
                  <div className="flex flex-row gap-2 items center align-items-center">
                    <Calendar className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <p className=" font-semibold text-gray-900">{t("eventDate")}</p>
                  </div>
                  <p className="text-gray-600 mb-2">{formatEventDate(event.date)}</p>
                  <button onClick={handleAddToCalendar} className="inline-flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 underline transition-colors">
                    <CalendarPlus size={14} />
                    {t("addToCalendar")}
                  </button>
                  <div className="flex flex-row mt-3 gap-2 items center align-items-center">
                    <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <p className="font-semibold text-gray-900">{t("eventLocation")}</p>
                  </div>
                  <div className="flex flex-col justify-start align-items-start">
                    {event.location.googleMapsLink ? (
                      <a href={event.location.googleMapsLink} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 underline">
                        {locationText}
                      </a>
                    ) : (
                      <p className="text-gray-600">{locationText}</p>
                    )}
                    {event.location.googleMapsLink && (
                      <a href={event.location.googleMapsLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium">
                        {t("openInGoogleMaps")} →
                      </a>
                    )}
                  </div>
                </div>
                <div className="Right w-full md:w-3/5">
                  {/* Map section - only if coordinates exist */}
                  {mapCoordinates && (
                    <div className="md:border-l md:pl-6">
                      <div className="rounded-lg overflow-hidden">
                        <InlineMap center={mapCoordinates} zoom={15} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Image carousel at top - visible on all screens */}
              {event.images.length > 0 && (
                <Carousel
                  opts={{
                    align: event.images.length < 3 ? "start" : "start",
                    loop: event.images.length > 1,
                  }}
                  className={event.images.length < 3 ? "w-full flex justify-start" : "w-full"}
                >
                  <CarouselContent className={event.images.length < 3 ? "justify-start" : ""}>
                    {event.images.map((src, i) => (
                      <CarouselItem key={i} className="basis-auto pl-4">
                        <div className="relative h-[200px] overflow-hidden rounded-md flex items-center justify-start bg-gray-100">
                          <Image src={src} loading="lazy" alt={`${event.name} ${i + 1}`} width={600} height={200} className="hover:cursor-grab active:cursor-grabbing h-full w-auto object-contain transition-transform duration-300 hover:scale-105" />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">{t("aboutThisEvent")}</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{event.description}</p>
            </div>

            {/* Website link */}
            {event.website && (
              <div className="mb-8">
                <a href={event.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors">
                  <ExternalLink size={16} />
                  {t("visitEventWebsite")}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
