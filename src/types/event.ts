export interface EventLocation {
  venue?: string; // Optional venue/place name
  town: string;
  municipality: string;
  latitude?: number; // Made optional for backward compatibility
  longitude?: number; // Made optional for backward compatibility
  googleMapsLink?: string; // New field for Google Maps share links
}

export interface Event {
  id: string;
  name: string;
  date: string; // ISO format
  description: string;
  location: EventLocation;
  website: string;
  images: string[]; // array of URLs (optimized versions)
  featured: boolean; // only one event can be featured at a time
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEventData {
  name: string;
  date: string;
  description: string;
  location: EventLocation;
  website: string;
  images?: File[]; // for form uploads
}
