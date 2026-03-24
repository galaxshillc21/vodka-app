import EventDetailClient from "./EventDetailClient";
import type { Metadata } from "next";
import { Event } from "@/types/event";
import { getAdminDb } from "@/lib/server/firebaseAdmin";

interface EventPageProps {
  params: Promise<{ id: string; locale: string }>;
}

const BASE_URL = "https://blatvodka.com";

async function getEventById(id: string): Promise<Event | null> {
  try {
    const eventDoc = await getAdminDb().collection("events").doc(id).get();

    if (!eventDoc.exists) {
      return null;
    }

    return {
      id: eventDoc.id,
      ...eventDoc.data(),
    } as Event;
  } catch (error) {
    console.error("Failed to fetch event metadata:", error);
    return null;
  }
}

function formatEventDateTime(dateString: string, locale: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return { dateText: dateString, timeText: "" };
  }

  const localeCode = locale === "es" ? "es-ES" : "en-US";

  return {
    dateText: new Intl.DateTimeFormat(localeCode, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date),
    timeText: new Intl.DateTimeFormat(localeCode, {
      hour: "numeric",
      minute: "2-digit",
    }).format(date),
  };
}

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;

  // Pass only the ID to the client component - no server-side data fetching
  return <EventDetailClient eventId={id} />;
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { id, locale } = await params;
  const event = await getEventById(id);

  if (!event) {
    return {
      title: "Event Details - Blat Vodka Events",
      description: "Discover exclusive Blat Vodka events and experiences.",
    };
  }

  const messages = (await import(`@/../messages/${locale}.json`)).default;
  const eventLabels = messages.Index.EventsSection;
  const { dateText, timeText } = formatEventDateTime(event.date, locale);
  const locationText = event.location.venue ? `${event.location.venue}, ${event.location.town}, ${event.location.municipality}` : `${event.location.town}, ${event.location.municipality}`;
  const pageUrl = `${BASE_URL}/${locale}/events/${id}`;
  const imageUrl = event.images[0] || `${BASE_URL}/images/blat_beach.webp`;
  const summaryParts = [event.name, `${eventLabels.eventDate}: ${dateText}`, timeText ? `${eventLabels.eventTime}: ${timeText}` : "", locationText].filter(Boolean);
  const description = truncateText([summaryParts.join(" | "), event.description].filter(Boolean).join(". "), 220);

  return {
    title: `${event.name} | ${eventLabels.pageTitle}`,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: event.name,
      description,
      type: "article",
      url: pageUrl,
      images: [
        {
          url: imageUrl,
          alt: event.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: event.name,
      description,
      images: [imageUrl],
    },
  };
}
