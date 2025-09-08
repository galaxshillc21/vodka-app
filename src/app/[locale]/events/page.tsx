import { useTranslations } from "next-intl";
import { Calendar, MapPin } from "lucide-react";
import events from "@/data/events.json";

type EventLocation = {
  latitude: number;
  longitude: number;
  town: string;
  municipality: string;
};

type Event = {
  id: number;
  name: string;
  date: string;
  description: string;
  website: string;
  location: EventLocation;
  image?: string;
};

export default function EventsPage() {
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

          {/* Events Grid */}
          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event: Event) => (
                <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {/* Event Image Placeholder */}
                  <div className="h-48 bg-gradient-to-r from-amber-600 to-amber-700 flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: event.image ? `url('/images/eventos/mambo/${event.image}')` : undefined }}>
                    {/* <div className="text-white text-center bg-black/40 p-4 rounded-lg backdrop-blur-sm">
                      <Calendar size={48} className="mx-auto mb-2" />
                      <p className="font-semibold">{event.name}</p>
                    </div> */}
                  </div>

                  {/* Event Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 font-fraunces">{event.name}</h3>

                    {/* <p className="text-gray-600 mb-4 text-sm leading-relaxed">{event.description}</p> */}

                    {/* Event Details */}
                    <div className="space-y-3 mb-4">
                      {/* Date */}
                      <div className="flex items-start text-gray-700">
                        <Calendar size={16} className="mr-2 text-amber-600" />
                        <span className="text-sm">
                          <strong>{t("eventDate")}:</strong> {event.date}
                        </span>
                      </div>

                      {/* Location */}
                      <div className="flex items-start text-gray-700">
                        <MapPin size={16} className="mr-2 text-amber-600" />
                        <span className="text-sm">
                          <strong>{t("eventLocation")}:</strong> {event.location.town}, {event.location.municipality}
                        </span>
                      </div>

                      {/* Website
                      {event.website && (
                        <div className="flex items-center text-gray-700">
                          <Globe size={16} className="mr-2 text-amber-600" />
                          <a href={event.website} target="_blank" rel="noopener noreferrer" className="text-sm text-amber-600 hover:text-amber-700 underline">
                            {t("visitWebsite")}
                          </a>
                        </div>
                      )} */}
                    </div>

                    {/* Action Button
                    {event.website && (
                      <a href={event.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200">
                        <Globe size={16} className="mr-2" />
                        {t("eventWebsite")}
                      </a>
                    )} */}
                  </div>
                </div>
              ))}
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
