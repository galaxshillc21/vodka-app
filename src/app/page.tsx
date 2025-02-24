"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Map from "@/components/Map";
import Disclaimer from "@/components/Disclaimer";
import stores from "@/data/stores.json";
import { haversineDistance } from "@/utils/distance";

export default function Home() {
  const [zipcode, setZipcode] = useState("");
  const [closestStore, setClosestStore] = useState(null);
  const [closestStores, setClosestStores] = useState([]);
  const router = useRouter(); // Initialize router

  const handleStoreClick = (storeId) => {
    router.push(`/stores/${storeId}`);
  };

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

      // Sort stores based on distance
      const sortedStores = stores
        .map((store) => {
          const storeCoords: [number, number] = [store.latitude, store.longitude];
          const distance = haversineDistance(userCoords, storeCoords);
          console.log(`Store: ${store.name} | Distance: ${distance} km`);
          return { ...store, distance };
        })
        .sort((a, b) => a.distance - b.distance);

      setClosestStore(sortedStores[0]);
      setClosestStores(sortedStores.slice(1, 4)); // Get next three closest stores
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
    <main className="container mx-auto p-4">
      <div className="frosted-card" id="Hero">
        <h1 className="main-title text-center font-extrabold">BLAT</h1>
        <h4 className="subTitle text-center">Encuentre su distribuidor de Blat más cercano</h4>
        <form name="zipcode" id="zipcodeForm" onSubmit={handleZipcodeSubmit} className="text-left mb-4 mt-4">
          <label htmlFor="zipcode" className="block">
            Codigo Postal:
          </label>
          <input type="text" value={zipcode} onChange={handleZipcodeChange} placeholder="Enter Zipcode" className="p-2 border rounded" />
          <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded">
            Buscar
          </button>
          <button type="button" className="mt-2 mb-2 p-2 bg-blue-500 text-white rounded">
            Usar mi localización
          </button>
        </form>
        <Link href="/stores" className="text-center w-100">
          Ver todas las tiendas
        </Link>
      </div>
      <div className="frosted-card">
        {closestStore && (
          <div className="mt-4">
            <h2 className="mb-3">Tienda más cercana</h2>
            <h3>{closestStore.name}</h3>
            <a className="link address" href={`https://www.google.com/maps/search/?api=1&query=${closestStore.address}`} target="_blank" rel="noopener noreferrer">
              {closestStore.address}
            </a>
            <a className="link tel" href={`tel:${closestStore.phone.replace(/\s+/g, "")}`}>
              {closestStore.phone}
            </a>
            <p>{closestStore.hours}</p>
            <p>Distancia: {formatDistance(closestStore.distance)}</p>
            <Map key={`${closestStore.latitude}-${closestStore.longitude}`} center={[closestStore.longitude, closestStore.latitude]} zoom={13} />
            <button onClick={() => handleStoreClick(closestStore.id)} className="mt-2 p-2 bg-blue-500 text-white rounded">
              Ver Detalles
            </button>
          </div>
        )}
        {closestStores.length > 0 && (
          <div className="mt-4">
            <h2 className="mb-3">Otras tiendas cercanas</h2>
            <ul>
              {closestStores.map((store) => (
                <li key={store.id} className="frosted-card">
                  <button onClick={() => handleStoreClick(store.id)} className="store-title w-full text-left">
                    <p>{store.name}</p>
                    <p>{store.address}</p>
                    <p>{store.phone}</p>
                    <p>{store.hours}</p>
                    <p>Distancia: {formatDistance(store.distance)}</p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <Disclaimer />
    </main>
  );
}
