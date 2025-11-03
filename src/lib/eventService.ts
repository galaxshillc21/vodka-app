import { collection, getDocs, doc, query, orderBy, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { auth } from "@/lib/firebase";
import { Event, CreateEventData } from "@/types/event";

const EVENTS_COLLECTION = "events";

export class EventService {
  // Helper method to get auth token for API calls
  private static async getAuthToken(): Promise<string> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }
    return await user.getIdToken();
  }

  // Create a new event (via API route)
  static async createEvent(eventData: CreateEventData): Promise<string> {
    try {
      const token = await this.getAuthToken();

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: eventData.name,
          date: eventData.date,
          description: eventData.description,
          location: eventData.location,
          website: eventData.website,
          images: [], // Will be populated after image upload
          featured: false,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create event");
      }

      const result = await response.json();
      return result.id;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  }

  // Upload images for an event
  static async uploadEventImages(eventId: string, images: File[]): Promise<string[]> {
    try {
      const uploadPromises = images.map(async (image, index) => {
        const fileName = `${Date.now()}_${index}_${image.name}`;
        const storageRef = ref(storage, `events/${eventId}/originals/${fileName}`);

        await uploadBytes(storageRef, image);
        return getDownloadURL(storageRef);
      });

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    }
  }

  // Update event with image URLs (via API route)
  static async updateEventImages(eventId: string, imageUrls: string[]): Promise<void> {
    try {
      const token = await this.getAuthToken();

      const response = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          images: imageUrls,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update event images");
      }
    } catch (error) {
      console.error("Error updating event images:", error);
      throw error;
    }
  }

  // Delete a specific image from an event and Firebase Storage
  static async deleteEventImage(eventId: string, imageUrl: string): Promise<void> {
    try {
      // Extract the file path from the URL to delete from storage
      const url = new URL(imageUrl);
      const pathMatch = url.pathname.match(/\/o\/(.+?)\?/);

      if (pathMatch) {
        const filePath = decodeURIComponent(pathMatch[1]);
        const imageRef = ref(storage, filePath);

        // Delete from storage
        await deleteObject(imageRef);

        // Get current event data to update images array
        const event = await this.getEventById(eventId);
        if (event) {
          const updatedImages = event.images.filter((img: string) => img !== imageUrl);

          // Update via API route
          const token = await this.getAuthToken();
          const response = await fetch(`/api/events/${eventId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              images: updatedImages,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to update event after image deletion");
          }
        }
      }
    } catch (error) {
      console.error("Error deleting event image:", error);
      throw error;
    }
  }

  // Remove image from event without deleting from storage (for bulk operations)
  static async removeImageFromEvent(eventId: string, imageUrl: string): Promise<string[]> {
    try {
      // Get current event data
      const event = await this.getEventById(eventId);

      if (event) {
        const updatedImages = event.images.filter((img: string) => img !== imageUrl);

        // Update via API route
        const token = await this.getAuthToken();
        const response = await fetch(`/api/events/${eventId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            images: updatedImages,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to remove image from event");
        }

        return updatedImages;
      }

      return [];
    } catch (error) {
      console.error("Error removing image from event:", error);
      throw error;
    }
  }

  // Get all events - client-side Firebase calls only
  static async getAllEvents(): Promise<Event[]> {
    try {
      if (!db) {
        console.warn("Firebase not initialized");
        return [];
      }

      const q = query(collection(db, EVENTS_COLLECTION), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Event)
      );
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  }

  // Get a single event by ID - client-side Firebase calls only
  static async getEventById(eventId: string): Promise<Event | null> {
    try {
      if (!db) {
        console.warn("Firebase not initialized");
        return null;
      }

      const eventRef = doc(db, EVENTS_COLLECTION, eventId);
      const eventDoc = await getDoc(eventRef);

      if (eventDoc.exists()) {
        return {
          id: eventDoc.id,
          ...eventDoc.data(),
        } as Event;
      }

      return null;
    } catch (error) {
      console.error("Error fetching event by ID:", error);
      return null;
    }
  }

  // Update an event (via API route)
  static async updateEvent(eventId: string, eventData: Partial<Event>): Promise<void> {
    try {
      const token = await this.getAuthToken();

      const response = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  }

  // Delete an event and its images (via API route)
  static async deleteEvent(eventId: string): Promise<void> {
    try {
      // Delete images from storage first
      const eventImagesRef = ref(storage, `events/${eventId}`);
      const imageList = await listAll(eventImagesRef);

      const deletePromises = imageList.items.map((imageRef) => deleteObject(imageRef));
      await Promise.all(deletePromises);

      // Delete event document via API
      const token = await this.getAuthToken();
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  }

  // Get the featured event - client-side Firebase calls only
  static async getFeaturedEvent(): Promise<Event | null> {
    try {
      if (!db) {
        console.warn("Firebase not initialized");
        return null;
      }

      const eventsQuery = query(collection(db, EVENTS_COLLECTION));
      const querySnapshot = await getDocs(eventsQuery);

      const events = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];

      return events.find((event) => event.featured) || null;
    } catch (error) {
      console.error("Error getting featured event:", error);
      return null;
    }
  }

  // Set an event as featured (only one can be featured) - via API route
  static async setFeaturedEvent(eventId: string): Promise<void> {
    try {
      // First, remove featured status from all events
      const events = await this.getAllEvents();
      const token = await this.getAuthToken();

      const unfeaturedPromises = events
        .filter((event) => event.featured)
        .map((event) =>
          fetch(`/api/events/${event.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ featured: false }),
          })
        );

      await Promise.all(unfeaturedPromises);

      // Now set the selected event as featured
      const response = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ featured: true }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to set featured event");
      }
    } catch (error) {
      console.error("Error setting featured event:", error);
      throw error;
    }
  }

  // Remove featured status from an event (via API route)
  static async removeFeaturedEvent(eventId: string): Promise<void> {
    try {
      const token = await this.getAuthToken();

      const response = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ featured: false }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to remove featured status");
      }
    } catch (error) {
      console.error("Error removing featured status:", error);
      throw error;
    }
  }
}
