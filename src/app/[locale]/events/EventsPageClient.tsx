"use client";

import { useTranslations, useLocale } from "next-intl";
import { Calendar, MapPin, Star, CalendarPlus } from "lucide-react";
import { Event } from "@/types/event";
import { Link } from "@/i18n/navigation";
import { downloadICSFile, CalendarEvent } from "@/utils/calendar";
import Image from "next/image";

interface EventsPageClientProps {
  events: Event[];
  featuredEvent: Event | null;
}

export default function EventsPageClient({ events, featuredEvent }: EventsPageClientProps) {
  const t = useTranslations("Index.EventsSection");
  const locale = useLocale();

  // Helper function to format date with proper locale
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    const localeCode = locale === "es" ? "es-ES" : "en-US";

    if (locale === "en") {
      // English format: "October 24th, 2024"
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
      return `${month} ${day}${getOrdinalSuffix(day)}, ${year}`;
    } else {
      // Spanish format: "24 de octubre de 2024"
      return date.toLocaleDateString(localeCode, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  const handleAddToCalendar = (event: Event, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to event detail page
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-[120px]">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 font-fraunces">{t("pageTitle")}</h1>
            <p className="text-gray-600 text-md lg:text-lg max-w-2xl mx-auto">{t("pageDescription")}</p>
          </div>

          {/* Featured Event */}
          {featuredEvent && (
            <div className="mb-12">
              <div className="flex items-center justify-center mb-6">
                <Star className="w-6 h-6 text-amber-500 mr-2 fill-current" />
                <h2 className="text-2xl font-bold text-gray-900 font-fraunces">{t("featuredEvent")}</h2>
                <Star className="w-6 h-6 text-amber-500 ml-2 fill-current" />
              </div>

              <Link href={`/events/${featuredEvent.id}`}>
                <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 text-white shadow-2xl cursor-pointer transition-all duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-3xl font-bold mb-4 font-fraunces">{featuredEvent.name}</h3>
                      <p className="text-amber-100 mb-6 text-lg leading-relaxed line-clamp-3">{featuredEvent.description}</p>

                      <div className="space-y-3">
                        <div className="flex items-start">
                          <Calendar size={20} className="mr-3 text-amber-200 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-lg">{formatEventDate(featuredEvent.date)}</span>
                            <br />
                            <button onClick={(e) => handleAddToCalendar(featuredEvent, e)} className="inline-flex items-center gap-1 text-sm text-amber-200 hover:text-white underline transition-colors mt-1">
                              <CalendarPlus size={14} />
                              {t("addToCalendar")}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <MapPin size={20} className="mr-3 text-amber-200" />
                          <span className="text-lg">{featuredEvent.location.venue ? `${featuredEvent.location.venue}, ${featuredEvent.location.town}, ${featuredEvent.location.municipality}` : `${featuredEvent.location.town}, ${featuredEvent.location.municipality}`}</span>
                        </div>
                      </div>

                      <div className="mt-6 inline-block px-6 py-3 bg-white text-amber-600 font-semibold rounded-lg hover:bg-amber-50 transition-colors duration-200">{t("viewEventDetails")} →</div>
                    </div>

                    {featuredEvent.images.length > 0 && (
                      <div className="relative h-64 lg:h-[350px] flex items-center justify-end">
                        <Image src={featuredEvent.images[0]} alt={featuredEvent.name} width={600} height={350} className="object-contain h-full w-auto rounded-xl shadow-lg" />
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Events Grid */}
          {events.length > 0 ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8 font-fraunces text-center">{featuredEvent ? t("allEvents") : t("upcomingEvents")}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event: Event) => (
                  <Link key={event.id} href={`/events/${event.id}`}>
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                      {/* Event Image */}
                      <div className="h-48 bg-gradient-to-r from-amber-600 to-amber-700 flex items-center justify-center bg-cover bg-center relative">
                        {event.images.length > 0 ? (
                          <Image src={event.images[0]} alt={event.name} fill className="object-cover" />
                        ) : (
                          <div className="text-white text-center">
                            <Calendar size={48} className="mx-auto mb-2" />
                            <p className="font-semibold">{event.name}</p>
                          </div>
                        )}

                        {event.featured && (
                          <div className="absolute top-2 right-2">
                            <Star className="w-6 h-6 text-amber-400 fill-current" />
                          </div>
                        )}
                      </div>

                      {/* Event Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 font-fraunces">{event.name}</h3>

                        <p
                          className="text-gray-600 mb-4 text-sm leading-relaxed overflow-hidden"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical" as const,
                          }}
                        >
                          {event.description}
                        </p>

                        {/* Event Details */}
                        <div className="space-y-3 mb-4">
                          {/* Date */}
                          <div className="flex items-start text-gray-700">
                            <Calendar size={16} className="mr-2 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <span className="text-sm">
                                <strong>{t("eventDate")}:</strong> {formatEventDate(event.date)}
                              </span>
                              <br />
                              <button onClick={(e) => handleAddToCalendar(event, e)} className="inline-flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 underline transition-colors mt-1">
                                <CalendarPlus size={12} />
                                {t("addToCalendar")}
                              </button>
                            </div>
                          </div>

                          {/* Location */}
                          <div className="flex items-start text-gray-700">
                            <MapPin size={16} className="mr-2 text-amber-600 mt-0.5" />
                            <span className="text-sm">
                              <strong>{t("eventLocation")}:</strong> {event.location.venue ? `${event.location.venue}, ${event.location.town}, ${event.location.municipality}` : `${event.location.town}, ${event.location.municipality}`}
                            </span>
                          </div>
                        </div>

                        {event.website && <div className="text-amber-600 text-sm font-semibold">{t("viewEventDetails")} →</div>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-md lg:text-lg">{t("noEvents")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
