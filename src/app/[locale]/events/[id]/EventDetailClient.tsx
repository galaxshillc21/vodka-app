"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Calendar, MapPin, ExternalLink, Share2, Tag, CalendarPlus } from "lucide-react";
import { Event } from "@/types/event";
import { EventService } from "@/lib/eventService";
import { Link } from "@/i18n/navigation";
import InlineMap from "@/components/InlineMap";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { downloadICSFile, CalendarEvent } from "@/utils/calendar";

interface EventDetailClientProps {
  eventId: string;
}

// Helper function to extract coordinates from Google Maps link
function extractCoordinatesFromGoogleMapsLink(link: string): [number, number] | null {
  try {
    // Handle different Google Maps URL formats
    // Format 1: https://maps.app.goo.gl/... or https://goo.gl/maps/...
    // Format 2: https://www.google.com/maps/...
    // Format 3: https://maps.google.com/...

    // For share links, we'll try to decode them but it's complex
    // For now, let's handle direct coordinate URLs
    const coordRegex = /@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const match = link.match(coordRegex);

    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      return [lng, lat]; // [longitude, latitude] for MapLibre
    }

    // Try to handle query parameter format
    const urlParams = new URL(link);
    const query = urlParams.searchParams.get("query");
    if (query) {
      const queryCoordMatch = query.match(/(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (queryCoordMatch) {
        const lat = parseFloat(queryCoordMatch[1]);
        const lng = parseFloat(queryCoordMatch[2]);
        return [lng, lat];
      }
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

    let coordinates: [number, number] | null = null;

    // First, try existing lat/lng if available
    if (event.location.latitude && event.location.longitude) {
      coordinates = [event.location.longitude, event.location.latitude];
    }
    // Otherwise, try to extract from Google Maps link
    else if (event.location.googleMapsLink) {
      coordinates = extractCoordinatesFromGoogleMapsLink(event.location.googleMapsLink);
    }

    setMapCoordinates(coordinates);
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-[120px]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back navigation */}
          <div className="mb-8">
            <Link href="/events" className="inline-flex items-center text-amber-600 hover:text-amber-700 transition-colors">
              ← {t("backToEvents") || "Back to Events"}
            </Link>
          </div>

          {/* Event header */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            {/* Featured badge */}
            {event.featured && (
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-2 text-center">
                <span className="flex items-center justify-center gap-2">
                  <Tag size={16} />
                  {t("featuredEvent")}
                </span>
              </div>
            )}

            {/* Image carousel */}
            {event.images.length > 0 && (
              <div className="relative">
                <Carousel className="w-full">
                  <CarouselContent>
                    {event.images.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="relative h-64 md:h-96 lg:h-[500px] w-full">
                          <Image src={image} alt={`${event.name} - Image ${index + 1}`} fill className="object-cover" priority={index === 0} />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {event.images.length > 1 && (
                    <>
                      <CarouselPrevious className="left-4" />
                      <CarouselNext className="right-4" />
                    </>
                  )}
                </Carousel>
              </div>
            )}

            {/* Event content */}
            <div className="p-6 md:p-8">
              {/* Title and share button */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-fraunces">{event.name}</h1>
                <button onClick={handleShare} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  <Share2 size={16} />
                  {t("share")}
                </button>
              </div>

              {/* Event details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Date */}
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">{t("eventDate")}</p>
                    <p className="text-gray-600 mb-2">{formatEventDate(event.date)}</p>
                    <button onClick={handleAddToCalendar} className="inline-flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 underline transition-colors">
                      <CalendarPlus size={14} />
                      {t("addToCalendar")}
                    </button>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">{t("eventLocation")}</p>
                    {event.location.googleMapsLink ? (
                      <a href={event.location.googleMapsLink} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 underline">
                        {locationText}
                      </a>
                    ) : (
                      <p className="text-gray-600">{locationText}</p>
                    )}
                  </div>
                </div>
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

          {/* Map section */}
          {mapCoordinates && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 md:p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{t("eventLocationMap")}</h2>
                <div className="rounded-lg overflow-hidden">
                  <InlineMap center={mapCoordinates} zoom={15} />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-gray-600">{locationText}</p>
                  {event.location.googleMapsLink && (
                    <a href={event.location.googleMapsLink} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 font-medium">
                      {t("openInGoogleMaps")} →
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* No map fallback */}
          {!mapCoordinates && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 md:p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{t("eventLocationMap")}</h2>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">{locationText}</p>
                  {event.location.googleMapsLink && (
                    <a href={event.location.googleMapsLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors">
                      <MapPin size={16} />
                      {t("viewOnGoogleMaps")}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
