import { notFound } from "next/navigation";
import { EventService } from "@/lib/eventService";
import EventDetailClient from "./EventDetailClient";

interface EventPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;

  try {
    const event = await EventService.getEventById(id);

    if (!event) {
      notFound();
    }

    return <EventDetailClient event={event} />;
  } catch {
    console.error("Error fetching event");
    notFound();
  }
}

export async function generateMetadata({ params }: EventPageProps) {
  const { id } = await params;

  try {
    const event = await EventService.getEventById(id);

    if (!event) {
      return {
        title: "Event Not Found",
        description: "The requested event could not be found.",
      };
    }

    return {
      title: `${event.name} - Blat Vodka Events`,
      description: event.description,
      openGraph: {
        title: event.name,
        description: event.description,
        images: event.images.length > 0 ? [{ url: event.images[0] }] : [],
        type: "article",
      },
    };
  } catch {
    return {
      title: "Event Not Found",
      description: "The requested event could not be found.",
    };
  }
}
