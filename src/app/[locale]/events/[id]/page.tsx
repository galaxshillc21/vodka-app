import EventDetailClient from "./EventDetailClient";

interface EventPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;

  // Pass only the ID to the client component - no server-side data fetching
  return <EventDetailClient eventId={id} />;
}

export async function generateMetadata() {
  // Static metadata - no data fetching during build
  return {
    title: "Event Details - Blat Vodka Events",
    description: "Discover exclusive Blat Vodka events and experiences.",
    openGraph: {
      title: "Blat Vodka Events",
      description: "Discover exclusive Blat Vodka events and experiences.",
      type: "article",
    },
  };
}
