"use client";

import { useState, useEffect, useCallback } from "react";
import { Search as SearchIcon, LocateFixed } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkeletonTiendas } from "@/components/SkeletonCard";
import stores from "@/data/stores.json";
import { haversineDistance } from "@/utils/distance";
import Image from "next/image";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import type { Store } from "@/types/store";

// Lazy load tab components
const TiendasTab = dynamic(() => import("@/components/TiendasTab"), {
  loading: () => <SkeletonTiendas />,
  ssr: false,
});
const FavoritosTab = dynamic(() => import("@/components/FavoritosTab"), {
  loading: () => (
    <div className="space-y-4">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded-lg mb-4"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded-lg mb-3"></div>
        ))}
      </div>
    </div>
  ),
  ssr: false,
});
const MapComponent = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
});

export default function SearchClient() {
  const t = useTranslations("SearchPage");
  const [zipcode, setZipcode] = useState("");
  const [closestStores, setClosestStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<Store[]>([]);

  const findClosestStore = useCallback(async (coords: [number, number]) => {
    try {
      const sortedStores = stores
        .map((store: Store) => {
          const storeCoords: [number, number] = [store.longitude, store.latitude];
          const distance = haversineDistance(coords, storeCoords);
          return { ...store, distance };
        })
        .sort((a, b) => a.distance - b.distance);

      setClosestStores(sortedStores.slice(0, 5));
    } catch (error) {
      console.error("Error finding closest store:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const findClosestStoreByZipcode = useCallback(
    async (zipcode: string) => {
      try {
        const response = await fetch(`/api/geo?q=${zipcode}`);
        const data = await response.json();
        if (!data.length) return;
        const { lon, lat } = data[0];
        const coords: [number, number] = [parseFloat(lon), parseFloat(lat)];
        setUserCoords(coords);
        await findClosestStore(coords);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    },
    [findClosestStore]
  );

  useEffect(() => {
    const savedZip = localStorage.getItem("zipcode");
    if (savedZip) {
      setZipcode(savedZip);
      findClosestStoreByZipcode(savedZip);
    }
  }, [findClosestStoreByZipcode]);

  const handleZipcodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipcode.trim()) return;
    localStorage.setItem("zipcode", zipcode);
    setLoading(true);
    await findClosestStoreByZipcode(zipcode);
  };

  const handleLocationShare = () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude];
        setUserCoords(coords);
        await findClosestStore(coords);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setLoading(false);
      }
    );
  };

  const toggleFavorite = (store: Store) => {
    setFavorites((prev) => (prev.some((fav) => fav.id === store.id) ? prev.filter((fav) => fav.id !== store.id) : [...prev, store]));
  };

  const formatDistance = (d: number) => (d < 1 ? `${(d * 1000).toFixed(0)} m` : `${d.toFixed(2)} km`);

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <section className="pb-0">
      <div className="flex flex-col md:flex-row h-[100vh] lg:h-[100vh] max-h-screen relative">
        <div className="absolute w-full h-[40px] rounded-t-xl lg:rounded-t-none bg-gradient-to-b lg:top-0 top-[35vh] lg:w-[30px] lg:h-full lg:left-[40vw] lg:bg-gradient-to-r from-white from-40% to-transparent to-90% z-[9] "></div>
        {/* LEFT: Content */}
        <div id="Content" className="bg-white shadow-[0_-10px_10px_#00000014] rounded-t-xl lg:rounded-t-none relative md:w-[40vw] w-full h-[75vh] md:h-full overflow-y-auto custom-scroll p-4 lg:p-8 lg:pt-20 order-last md:order-first mt-[-20px] lg:mt-0">
          <div className="justify-center mb-4 hidden lg:flex ">
            <Image src="/images/blat_logo_bronze.png" alt="Blat Logo Bronze" width={100} height={100} priority className="invisible" />
          </div>
          <h4 className="subTitle text-center">{t("heroTitlePart1")}</h4>

          <form onSubmit={handleZipcodeSubmit} className="mt-4 space-y-2">
            <div className="flex gap-2">
              <input type="text" value={zipcode} onChange={(e) => setZipcode(e.target.value)} placeholder={t("zipcodePlaceholder")} className="p-2 w-full border rounded" />
              <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
                <SearchIcon size={16} />
              </button>
              <button type="button" onClick={handleLocationShare} className="bg-primary text-white px-2 py-2 rounded">
                <LocateFixed size={16} />
              </button>
            </div>
          </form>

          <Tabs defaultValue="tiendas" className="mt-6">
            <TabsList className="w-full bg-bronze-muted rounded-md hidden">
              <TabsTrigger value="tiendas" className="w-1/2">
                {t("tabStores")}
              </TabsTrigger>
              <TabsTrigger value="favoritos" className="w-1/2">
                {t("tabFavorites")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tiendas">
              {loading ? (
                <SkeletonTiendas />
              ) : (
                <>
                  <h3 className="mt-4 mb-2 text-center">{t("closestStoresHeading")}</h3>
                  <TiendasTab closestStores={closestStores} formatDistance={formatDistance} favorites={favorites} toggleFavorite={toggleFavorite} onStoreSelect={(store) => setSelectedStore(store)} selectedStore={selectedStore} />
                </>
              )}
            </TabsContent>

            <TabsContent value="favoritos">
              <FavoritosTab favorites={favorites} formatDistance={formatDistance} toggleFavorite={toggleFavorite} />
            </TabsContent>
          </Tabs>
        </div>

        {/* RIGHT: Map */}
        <div id="Map" className="md:w-[60vw] w-full h-[45vh] md:h-full order-first md:order-last">
          <MapComponent userCoords={userCoords} stores={closestStores} selectedStore={selectedStore} />
        </div>
      </div>
    </section>
  );
}
