import { EventService } from "@/lib/eventService";
import EventsPageClient from "./EventsPageClient";

export default async function EventsPage() {
  const events = await EventService.getAllEvents();
  const featuredEvent = await EventService.getFeaturedEvent();

  return <EventsPageClient events={events} featuredEvent={featuredEvent} />;
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
