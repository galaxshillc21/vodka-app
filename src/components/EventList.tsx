"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Event } from "@/types/event";
import { EventService } from "@/lib/eventService";
import { Edit, Trash2, Calendar, MapPin, Globe, Image as ImageIcon, Star } from "lucide-react";

interface EventListProps {
  onEdit: (event: Event) => void;
  refreshTrigger: number; // Used to trigger refresh after creating new events
}

export default function EventList({ onEdit, refreshTrigger }: EventListProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const [togglingFeaturedId, setTogglingFeaturedId] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const fetchedEvents = await EventService.getAllEvents();
      setEvents(fetchedEvents);
      setError("");
    } catch (err: any) {
      setError("Error al cargar los eventos");
      console.error("Error fetching events:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [refreshTrigger]);

  const handleDelete = async (eventId: string, eventName: string) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar el evento "${eventName}"?`)) {
      return;
    }

    try {
      setDeletingEventId(eventId);
      await EventService.deleteEvent(eventId);
      await fetchEvents(); // Refresh the list
    } catch (err: any) {
      setError("Error al eliminar el evento");
      console.error("Error deleting event:", err);
    } finally {
      setDeletingEventId(null);
    }
  };

  const handleToggleFeatured = async (eventId: string, currentFeatured: boolean) => {
    try {
      setTogglingFeaturedId(eventId);

      if (currentFeatured) {
        // Remove featured status
        await EventService.removeFeaturedEvent(eventId);
      } else {
        // Set as featured (this will automatically unfeature other events)
        await EventService.setFeaturedEvent(eventId);
      }

      await fetchEvents(); // Refresh the list
    } catch (err: any) {
      setError("Error al cambiar el estado destacado del evento");
      console.error("Error toggling featured status:", err);
    } finally {
      setTogglingFeaturedId(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getMainImage = (event: Event) => {
    return event.images && event.images.length > 0 ? event.images[0] : null;
  };

  if (isLoading) {
    return (
      <Card className="backdrop-blur-md bg-white/70 border-white/50 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
              <p className="text-amber-700 font-medium">Cargando eventos...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-md bg-white/70 border-white/50 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-700">
          <Calendar className="w-5 h-5" />
          Eventos Existentes ({events.length})
        </CardTitle>
      </CardHeader>

      <CardContent>
        {error && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

        {events.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay eventos creados aún.</p>
            <p className="text-sm text-gray-500">Crea tu primer evento usando el formulario de arriba.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-white/80 rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Event Image */}
                <div className="relative h-48 bg-gray-100">
                  {getMainImage(event) ? (
                    <img src={getMainImage(event)!} alt={event.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100">
                      <ImageIcon className="w-12 h-12 text-amber-400" />
                    </div>
                  )}

                  {/* Featured Badge */}
                  {event.featured && (
                    <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Destacado
                    </div>
                  )}

                  {/* Image Count Badge */}
                  {event.images && event.images.length > 1 && <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">+{event.images.length - 1}</div>}
                </div>

                {/* Event Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">{event.name}</h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-amber-600" />
                      {formatDate(event.date)}
                    </div>

                    {event.location.town && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-amber-600" />
                        {event.location.town}
                        {event.location.municipality && `, ${event.location.municipality}`}
                      </div>
                    )}

                    {event.website && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Globe className="w-4 h-4 text-amber-600" />
                        <a href={event.website} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline truncate">
                          {event.website.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{event.description}</p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleToggleFeatured(event.id, event.featured)}
                      variant="outline"
                      size="sm"
                      disabled={togglingFeaturedId === event.id}
                      className={`${event.featured ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100" : "border-gray-200 hover:bg-amber-50 hover:border-amber-300"}`}
                    >
                      {togglingFeaturedId === event.id ? <div className="w-4 h-4 border-2 border-amber-300 border-t-amber-600 rounded-full animate-spin mr-2" /> : <Star className={`w-4 h-4 mr-2 ${event.featured ? "fill-current" : ""}`} />}
                      {event.featured ? "Destacado" : "Destacar"}
                    </Button>

                    <Button onClick={() => onEdit(event)} variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50 hover:border-blue-300">
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>

                    <Button onClick={() => handleDelete(event.id, event.name)} variant="outline" size="sm" disabled={deletingEventId === event.id} className="border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600">
                      {deletingEventId === event.id ? <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Refresh Button */}
        {events.length > 0 && (
          <div className="mt-6 text-center">
            <Button onClick={fetchEvents} variant="outline" className="border-amber-200 hover:bg-amber-50">
              Actualizar Lista
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
