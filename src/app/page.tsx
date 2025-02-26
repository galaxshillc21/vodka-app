"use client";

import { useState, useEffect, useCallback } from "react";
// import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TiendasTab from "@/components/TiendasTab";
import EventosTab from "@/components/EventosTab";
import FavoritosTab from "@/components/FavoritosTab";
import stores from "@/data/stores.json";
import { haversineDistance } from "@/utils/distance";

export default function Home() {
  const [zipcode, setZipcode] = useState("");
  const [closestStores, setClosestStores] = useState([]);
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  // const router = useRouter(); // Initialize router

  // const handleStoreClick = (storeId) => {
  //   router.push(`/stores/${storeId}`);
  // };

  const findClosestStore = useCallback(async (zipcode: string) => {
    try {
      console.log("Fetching coordinates for zipcode:", zipcode);
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${zipcode}&format=json&addressdetails=1&countrycodes=ES`);
      const data = await response.json();

      if (data.length === 0) {
        console.warn("No coordinates found for given zipcode.");
        return;
      }

      const { lon, lat } = data[0];
      console.log(`Fetched coordinates: lon=${lon}, lat=${lat}`);

      // Convert to numbers to avoid string issues
      const userCoords: [number, number] = [parseFloat(lat), parseFloat(lon)];
      console.log("User coordinates parsed:", userCoords);
      setUserCoords(userCoords);

      // Sort stores based on distance
      const sortedStores = stores
        .map((store) => {
          const storeCoords: [number, number] = [store.latitude, store.longitude];
          const distance = haversineDistance(userCoords, storeCoords);
          console.log(`Store: ${store.name} | Distance: ${distance} km`);
          return { ...store, distance };
        })
        .sort((a, b) => a.distance - b.distance);

      setClosestStores(sortedStores.slice(0, 4)); // Get the four closest stores
    } catch (error) {
      console.error("Error finding closest store:", error);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedZipcode = localStorage.getItem("zipcode");
      if (savedZipcode) {
        setZipcode(savedZipcode);
        findClosestStore(savedZipcode);
      }
    }
  }, [findClosestStore]);

  const handleZipcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZipcode(e.target.value);
  };

  const handleZipcodeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!zipcode.trim()) {
      console.warn("Zipcode field is empty.");
      return;
    }

    // Save the zipcode to local storage
    if (typeof window !== "undefined") {
      localStorage.setItem("zipcode", zipcode);
    }
    console.log("Zipcode submitted:", zipcode);
    await findClosestStore(zipcode);
  };

  const formatDistance = (distance: number) => {
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)} m`;
    }
    return `${distance.toFixed(2)} km`;
  };

  return (
    <main className="container mx-auto">
      <div className="heroBG">
        <div className="frosted-card" id="Hero">
          <h1 className="main-title text-center font-extrabold">BLAT</h1>
          <h4 className="subTitle text-center">Encuentre su distribuidor de Blat más cercano</h4>
          <form name="zipcode" id="zipcodeForm" onSubmit={handleZipcodeSubmit} className="text-left mb-4 mt-4">
            <div className="flex items-center flex-wrap gap-2 w-3/4 m-auto">
              <div className="flex lower-zip">
                <input type="text" value={zipcode} onChange={handleZipcodeChange} placeholder="Enter Zipcode" className="p-2 w-2/3 " />
                <button type="submit" className="ml-2 p-2 w-1/3 bg-primary text-white rounded flex flex items-center justify-center gap-1">
                  <Search size={15} className="inline" /> Buscar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Tabs defaultValue="tiendas" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger className="w-1/3" value="tiendas">
            Tiendas
          </TabsTrigger>
          <TabsTrigger className="w-1/3" value="eventos">
            Eventos
          </TabsTrigger>
          <TabsTrigger className="w-1/3" value="favoritos">
            Favoritos
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tiendas">
          <h3 className="mb-3 text-center">Tiendas más cercanas</h3>
          <TiendasTab closestStores={closestStores} formatDistance={formatDistance} />
          <div className="flex align-center justify-center">
            <Link href="/stores" className="text-center w-100">
              Ver todas las tiendas
            </Link>
          </div>
        </TabsContent>
        <TabsContent value="eventos">
          <EventosTab userCoords={userCoords} formatDistance={formatDistance} />
        </TabsContent>
        <TabsContent value="favoritos">
          <FavoritosTab />
        </TabsContent>
      </Tabs>

      {/* <Disclaimer /> */}
    </main>
  );
}
