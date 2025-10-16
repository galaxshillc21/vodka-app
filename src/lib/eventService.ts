import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Event, CreateEventData } from "@/types/event";

const EVENTS_COLLECTION = "events";

export class EventService {
  // Create a new event
  static async createEvent(eventData: CreateEventData): Promise<string> {
    try {
      const now = new Date().toISOString();

      // Create event document without images first
      const eventDoc = {
        name: eventData.name,
        date: eventData.date,
        description: eventData.description,
        location: eventData.location,
        website: eventData.website,
        images: [], // Will be populated after image upload
        featured: false, // default to not featured
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(collection(db, EVENTS_COLLECTION), eventDoc);
      return docRef.id;
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

  // Update event with image URLs
  static async updateEventImages(eventId: string, imageUrls: string[]): Promise<void> {
    try {
      const eventRef = doc(db, EVENTS_COLLECTION, eventId);
      await updateDoc(eventRef, {
        images: imageUrls,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating event images:", error);
      throw error;
    }
  }

  // Get all events
  static async getAllEvents(): Promise<Event[]> {
    try {
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
      throw error;
    }
  }

  // Update an event
  static async updateEvent(eventId: string, eventData: Partial<Event>): Promise<void> {
    try {
      const eventRef = doc(db, EVENTS_COLLECTION, eventId);
      await updateDoc(eventRef, {
        ...eventData,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  }

  // Delete an event and its images
  static async deleteEvent(eventId: string): Promise<void> {
    try {
      // Delete images from storage
      const eventImagesRef = ref(storage, `events/${eventId}`);
      const imageList = await listAll(eventImagesRef);

      const deletePromises = imageList.items.map((imageRef) => deleteObject(imageRef));
      await Promise.all(deletePromises);

      // Delete event document
      await deleteDoc(doc(db, EVENTS_COLLECTION, eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  }

  // Get the featured event
  static async getFeaturedEvent(): Promise<Event | null> {
    try {
      const eventsQuery = query(collection(db, EVENTS_COLLECTION));
      const querySnapshot = await getDocs(eventsQuery);

      const events = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];

      return events.find((event) => event.featured) || null;
    } catch (error) {
      console.error("Error getting featured event:", error);
      throw error;
    }
  }

  // Set an event as featured (only one can be featured)
  static async setFeaturedEvent(eventId: string): Promise<void> {
    try {
      // First, remove featured status from all events
      const eventsQuery = query(collection(db, EVENTS_COLLECTION));
      const querySnapshot = await getDocs(eventsQuery);

      const unfeaturedPromises = querySnapshot.docs.map((docSnapshot) => {
        if (docSnapshot.data().featured) {
          return updateDoc(doc(db, EVENTS_COLLECTION, docSnapshot.id), {
            featured: false,
            updatedAt: new Date().toISOString(),
          });
        }
        return Promise.resolve();
      });

      await Promise.all(unfeaturedPromises);

      // Now set the selected event as featured
      await updateDoc(doc(db, EVENTS_COLLECTION, eventId), {
        featured: true,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error setting featured event:", error);
      throw error;
    }
  }

  // Remove featured status from an event
  static async removeFeaturedEvent(eventId: string): Promise<void> {
    try {
      await updateDoc(doc(db, EVENTS_COLLECTION, eventId), {
        featured: false,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error removing featured status:", error);
      throw error;
    }
  }
}
