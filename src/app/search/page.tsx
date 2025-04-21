"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search as SearchIcon, LocateFixed } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TiendasTab from "@/components/TiendasTab";
import EventosTab from "@/components/EventosTab";
import FavoritosTab from "@/components/FavoritosTab";
import { SkeletonTiendas, SkeletonEventos } from "@/components/SkeletonCard";
import stores from "@/data/stores.json";
import { haversineDistance } from "@/utils/distance";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Search() {
  const [zipcode, setZipcode] = useState("");
  const [closestStores, setClosestStores] = useState([]);
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const findClosestStore = useCallback(async (coords: [number, number]) => {
    try {
      const sortedStores = stores
        .map((store) => {
          const storeCoords: [number, number] = [store.latitude, store.longitude];
          const distance = haversineDistance(coords, storeCoords);
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

  const findClosestStoreByZipcode = useCallback(
    async (zipcode: string) => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${zipcode}&format=json&addressdetails=1&countrycodes=ES`);
        const data = await response.json();

        if (data.length === 0) {
          console.warn("No coordinates found for given zipcode.");
          return;
        }

        const { lon, lat } = data[0];
        const userCoords: [number, number] = [parseFloat(lat), parseFloat(lon)];
        setUserCoords(userCoords);
        await findClosestStore(userCoords);
      } catch (error) {
        console.error("Error finding closest store:", error);
      } finally {
        setLoading(false);
      }
    },
    [findClosestStore]
  );
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedZipcode = localStorage.getItem("zipcode");
      if (savedZipcode) {
        setZipcode(savedZipcode);
        findClosestStoreByZipcode(savedZipcode);
      }
    }
  }, [findClosestStore, findClosestStoreByZipcode]);
  const handleZipcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZipcode(e.target.value);
  };

  const handleZipcodeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Searching for zipcode...");
    if (!zipcode.trim()) {
      console.warn("Zipcode field is empty.");
      return;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("zipcode", zipcode);
    }
    setLoading(true);
    setTimeout(async () => {
      await findClosestStoreByZipcode(zipcode);
    }, 1000);
  };

  const handleLocationShare = () => {
    console.log("Getting user location...");
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserCoords(coords);
          await findClosestStore(coords);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoading(false);
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
    }
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
    <section className="container mx-auto pl-2 pr-2 bg-bottle" id="searchPage">
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: "easeOut" }} className="heroBG animate-slide-down">
        <div className="frosted-card shadow-md" id="Hero">
          <div className="flex justify-center mb-4">
            <Image
              src="/images/blat_logo_bronze.png" // Path to your image in the public directory
              alt="Blat Logo Bronze"
              width={100} // Adjust the width as needed
              height={100}
              priority // Ensures the image is loaded quickly
            />
          </div>
          <h4 className="subTitle text-center">
            Encuentre su distribuidor de Blat <br />
            más cercano
          </h4>
          <form name="zipcode" id="zipcodeForm" onSubmit={handleZipcodeSubmit} className="text-left mb-4 mt-4">
            <div className="flex items-center flex-wrap gap-2 w-3/4 m-auto">
              <div className="flex lower-zip">
                <input type="text" value={zipcode} onChange={handleZipcodeChange} placeholder="Enter Zipcode" className="p-2 w-2/3 " />
                <button type="submit" className="useZip ml-2 p-2 w-1/3 bg-primary text-white rounded flex flex items-center justify-center gap-1">
                  <SearchIcon size={15} className="inline" /> Buscar
                </button>
                <button type="button" onClick={handleLocationShare} className="useLocation ml-2 p-2 bg-primary text-white rounded flex flex items-center justify-center gap-1">
                  <LocateFixed size={15} className="inline" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
      <Tabs defaultValue="tiendas" className="w-full">
        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: "easeOut" }}>
          <TabsList className="w-full bg-bronze-muted frosted-sm">
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
    </section>
  );
}
