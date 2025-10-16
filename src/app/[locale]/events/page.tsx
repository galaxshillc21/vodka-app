import { useTranslations } from "next-intl";
import { Calendar, MapPin, Star } from "lucide-react";
import { EventService } from "@/lib/eventService";
import { Event } from "@/types/event";

export default async function EventsPage() {
  const events = await EventService.getAllEvents();
  const featuredEvent = await EventService.getFeaturedEvent();

  return <EventsPageClient events={events} featuredEvent={featuredEvent} />;
}

function EventsPageClient({ events, featuredEvent }: { events: Event[]; featuredEvent: Event | null }) {
  const t = useTranslations("Index.EventsSection");

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
                <h2 className="text-2xl font-bold text-gray-900 font-fraunces">Evento Destacado</h2>
                <Star className="w-6 h-6 text-amber-500 ml-2 fill-current" />
              </div>

              <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 text-white shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-3xl font-bold mb-4 font-fraunces">{featuredEvent.name}</h3>
                    <p className="text-amber-100 mb-6 text-lg leading-relaxed">{featuredEvent.description}</p>

                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Calendar size={20} className="mr-3 text-amber-200" />
                        <span className="text-lg">
                          {new Date(featuredEvent.date).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <MapPin size={20} className="mr-3 text-amber-200" />
                        <span className="text-lg">
                          {featuredEvent.location.town}, {featuredEvent.location.municipality}
                        </span>
                      </div>
                    </div>

                    {featuredEvent.website && (
                      <a href={featuredEvent.website} target="_blank" rel="noopener noreferrer" className="inline-block mt-6 px-6 py-3 bg-white text-amber-600 font-semibold rounded-lg hover:bg-amber-50 transition-colors duration-200">
                        Más información
                      </a>
                    )}
                  </div>

                  {featuredEvent.images.length > 0 && (
                    <div className="relative">
                      <img src={featuredEvent.images[0]} alt={featuredEvent.name} className="w-full h-64 lg:h-80 object-cover rounded-xl shadow-lg" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Events Grid */}
          {events.length > 0 ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8 font-fraunces text-center">{featuredEvent ? "Todos los Eventos" : "Próximos Eventos"}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event: Event) => (
                  <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    {/* Event Image */}
                    <div className="h-48 bg-gradient-to-r from-amber-600 to-amber-700 flex items-center justify-center bg-cover bg-center relative">
                      {event.images.length > 0 ? (
                        <img src={event.images[0]} alt={event.name} className="w-full h-full object-cover" />
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
                          <Calendar size={16} className="mr-2 text-amber-600 mt-0.5" />
                          <span className="text-sm">
                            <strong>{t("eventDate")}:</strong>{" "}
                            {new Date(event.date).toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>

                        {/* Location */}
                        <div className="flex items-start text-gray-700">
                          <MapPin size={16} className="mr-2 text-amber-600 mt-0.5" />
                          <span className="text-sm">
                            <strong>{t("eventLocation")}:</strong> {event.location.town}, {event.location.municipality}
                          </span>
                        </div>
                      </div>

                      {event.website && (
                        <a href={event.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200">
                          Más información
                        </a>
                      )}
                    </div>
                  </div>
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

export async function generateMetadata({ params }) {
  // Import translations for the current locale
  const messages = (await import(`@/../messages/${params.locale}.json`)).default;
  const title = messages.Events?.pageTitle || "Events – Blat Vodka";
  const description = messages.Events?.pageDescription || "Discover upcoming Blat Vodka events and experiences.";

  return {
    title,
    description,
  };
}
