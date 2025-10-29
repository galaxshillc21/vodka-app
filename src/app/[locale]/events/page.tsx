import { EventService } from "@/lib/eventService";
import EventsPageClient from "./EventsPageClient";

export default async function EventsPage() {
  const events = await EventService.getAllEvents();
  const featuredEvent = await EventService.getFeaturedEvent();

  return <EventsPageClient events={events} featuredEvent={featuredEvent} />;
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  // Import translations for the current locale
  const messages = (await import(`@/../messages/${locale}.json`)).default;
  const title = messages.EventsSection?.pageTitle || "Events – Blat Vodka";
  const description = messages.EventsSection?.pageDescription || "Discover upcoming Blat Vodka events and experiences.";

  const baseUrl = "https://blatvodka.com";

  return {
    title,
    description,
    alternates: {
      languages: {
        en: `${baseUrl}/en/events`,
        es: `${baseUrl}/es/events`,
        "x-default": `${baseUrl}/en/events`,
      },
      canonical: `${baseUrl}/${locale}/events`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/events`,
      siteName: "Blat Vodka",
      locale: locale,
      type: "website",
    },
  };
}
