export type Store = {
  id: string | number;
  name: string;
  latitude?: number;
  longitude?: number;
  googleMapsUrl?: string;
  distance?: number;
  hours: string;
  phone: string;
  address: string;
  storeType?: "public" | "private"; // public: retail stores for any customer, private: wholesale/big retail
  // Add other properties as needed
};
