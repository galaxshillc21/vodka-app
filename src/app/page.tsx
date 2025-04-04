"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TiendasTab from "@/components/TiendasTab";
import EventosTab from "@/components/EventosTab";
import FavoritosTab from "@/components/FavoritosTab";
import { SkeletonTiendas, SkeletonEventos } from "@/components/SkeletonCard";
import stores from "@/data/stores.json";
import { haversineDistance } from "@/utils/distance";
import { motion } from "framer-motion";

export default function Home() {
  const [zipcode, setZipcode] = useState("");
  const [closestStores, setClosestStores] = useState([]);
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);

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

      const userCoords: [number, number] = [parseFloat(lat), parseFloat(lon)];
      console.log("User coordinates parsed:", userCoords);
      setUserCoords(userCoords);

      const sortedStores = stores
        .map((store) => {
          const storeCoords: [number, number] = [store.latitude, store.longitude];
          const distance = haversineDistance(userCoords, storeCoords);
          console.log(`Store: ${store.name} | Distance: ${distance} km`);
          return { ...store, distance };
        })
        .sort((a, b) => a.distance - b.distance);

      setClosestStores(sortedStores.slice(0, 4));
    } catch (error) {
      console.error("Error finding closest store:", error);
    } finally {
      setLoading(false);
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

    if (typeof window !== "undefined") {
      localStorage.setItem("zipcode", zipcode);
    }
    console.log("Zipcode submitted:", zipcode);
    setLoading(true);
    setTimeout(async () => {
      await findClosestStore(zipcode);
    }, 1000);
  };

  const formatDistance = (distance: number) => {
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)} m`;
    }
    return `${distance.toFixed(2)} km`;
  };

  const toggleFavorite = (store) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.some((fav) => fav.id === store.id)) {
        // Remove from favorites
        return prevFavorites.filter((fav) => fav.id !== store.id);
      } else {
        // Add to favorites
        return [...prevFavorites, store];
      }
    });
  };

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <main className="container mx-auto">
      <motion.div
        initial={{ y: -50, opacity: 0 }} // Start slightly above and invisible
        animate={{ y: 0, opacity: 1 }} // Slide down and become visible
        transition={{ duration: 0.5, ease: "easeOut" }} // Adjust speed and easing
        className="heroBG animate-slide-down"
      >
        <div className="frosted-card" id="Hero">
          <h1 className="main-title text-center font-extrabold">BLAT</h1>
          <h4 className="subTitle text-center">
            Encuentre su distribuidor de Blat <br />
            más cercano
          </h4>
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
      </motion.div>
      <Tabs defaultValue="tiendas" className="w-full">
        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: "easeOut" }}>
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
        </motion.div>
        <TabsContent value="tiendas">
          {loading ? (
            <SkeletonTiendas />
          ) : (
            <>
              <h3 className="mb-3 text-center">Tiendas más cercanas</h3>
              <TiendasTab closestStores={closestStores} formatDistance={formatDistance} favorites={favorites} toggleFavorite={toggleFavorite} />
              <div className="flex align-center justify-center">
                <Link href="/stores" className="text-center w-100">
                  Ver todas las tiendas
                </Link>
              </div>
            </>
          )}
        </TabsContent>
        <TabsContent value="eventos">
          {loading ? (
            <SkeletonEventos />
          ) : (
            <>
              <h3 className="mb-3 text-center">Eventos más cercanos</h3>
              <EventosTab userCoords={userCoords} formatDistance={formatDistance} />
            </>
          )}
        </TabsContent>
        <TabsContent value="favoritos">
          <FavoritosTab favorites={favorites} formatDistance={formatDistance} toggleFavorite={toggleFavorite} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
