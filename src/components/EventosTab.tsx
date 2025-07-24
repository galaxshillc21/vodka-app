"use client";

import { Navigation, Calendar, Globe } from "lucide-react";
import InlineMap from "@/components/InlineMap"; // use this instead of full-page map
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import events from "@/data/events.json";
import { haversineDistance } from "@/utils/distance";

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
  distance?: number;
};

type EventosTabProps = {
  userCoords: [number, number] | null;
  formatDistance: (distance: number) => string;
};

const EventosTab = ({ userCoords, formatDistance }: EventosTabProps) => {
  const sortedEvents: Event[] = events
    .map((event: Event) => {
      const eventCoords: [number, number] = [event.location.longitude, event.location.latitude]; // Correct order
      const distance = userCoords ? haversineDistance(userCoords, eventCoords) : Infinity;
      return { ...event, distance };
    })
    .sort((a, b) => a.distance - b.distance);

  return (
    <div id="Events">
      {sortedEvents.length > 0 && (
        <ul>
          {sortedEvents.map((event) => (
            <li key={event.id} className="frosted-card event relative shadow-md">
              <Tabs defaultValue="info" className="w-full">
                <div className="flex justify-center items-center">
                  <TabsList className="frosted-tabs">
                    <TabsTrigger value="info">Información</TabsTrigger>
                    <TabsTrigger value="mapa">Mapa</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="info">
                  <div className="info flex flex-col gap-2">
                    <h4>{event.name}</h4>
                    <p className="date">
                      <Calendar size={15} className="inline" /> {event.date}
                    </p>
                    <p className="description">{event.description}</p>
                    <div className="event-location">
                      <span className="distance">{formatDistance(event.distance ?? 0)}</span> •{" "}
                      <span className="address">
                        {event.location.town}, {event.location.municipality}
                      </span>
                    </div>
                    <a href={event.website} target="_blank" rel="noopener noreferrer" className="website">
                      <Globe size={15} className="inline" /> Sitio web
                    </a>
                  </div>
                </TabsContent>

                <TabsContent value="mapa" className="relative">
                  <InlineMap key={`${event.location.latitude}-${event.location.longitude}`} center={[event.location.longitude, event.location.latitude]} zoom={13} />
                  <div className="event-location pill">
                    <span className="distance">{formatDistance(event.distance ?? 0)}</span> •{" "}
                    <span className="address">
                      {event.location.town}, {event.location.municipality}
                    </span>
                  </div>
                </TabsContent>

                <div className="action-links flex gap-4 mt-3">
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${event.location.latitude},${event.location.longitude}`} target="_blank" rel="noopener noreferrer" className="text-bronze w-1/3">
                    <Navigation size={15} className="inline" /> Navegar
                  </a>
                </div>
              </Tabs>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventosTab;
