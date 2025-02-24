"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
// import Map from "@/components/Map";
import Disclaimer from "@/components/Disclaimer";
import Info from "@/components/Info";
import stores from "@/data/stores.json";
import { haversineDistance } from "@/utils/distance";

export default function Home() {
  const [zipcode, setZipcode] = useState("");
  const [closestStore, setClosestStore] = useState(null);
  const [closestStores, setClosestStores] = useState([]);

  const findClosestStore = useCallback(async (zipcode: string) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${zipcode}&format=json&addressdetails=1&countrycodes=ES`);
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        const sortedStores = stores
          .map((store) => ({
            ...store,
            distance: haversineDistance([lat, lon], [store.latitude, store.longitude]),
          }))
          .sort((a, b) => a.distance - b.distance);

        setClosestStore(sortedStores[0]);
        setClosestStores(sortedStores.slice(1, 4)); // Get the next three closest stores
      }
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
    // Save the zipcode to local storage
    if (typeof window !== "undefined") {
      localStorage.setItem("zipcode", zipcode);
    }
    console.log("Zipcode submitted:", zipcode);
    await findClosestStore(zipcode);
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="main-title text-center font-extrabold frosted-card">BLAT</h1>
      <Info />
      <div className="frosted-card">
        <form name="zipcode" id="zipcodeForm" onSubmit={handleZipcodeSubmit} className="text-center mb-4">
          <label htmlFor="zipcode" className="block">
            Ingresa tu código postal para encontrar la tienda más cercana:
          </label>
          <input type="text" value={zipcode} onChange={handleZipcodeChange} placeholder="Enter Zipcode" className="p-2 border rounded" />
          <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded">
            Buscar
          </button>
        </form>
        <Link href="/stores" className="text-center">
          Ver todas las tiendas
        </Link>
        {closestStore && (
          <div className="mt-4">
            <h2>Tienda más cercana</h2>
            <h3>{closestStore.name}</h3>
            <p>{closestStore.address}</p>
            <p>{closestStore.phone}</p>
            <p>{closestStore.hours}</p>
            {/* <Map key={`${closestStore.latitude}-${closestStore.longitude}`} center={[closestStore.latitude, closestStore.longitude]} zoom={13} /> */}
          </div>
        )}
        {closestStores.length > 0 && (
          <div className="mt-4">
            <h2>Otras tiendas cercanas</h2>
            <ul>
              {closestStores.map((store) => (
                <li key={store.id} className="frosted-card">
                  <Link href={`/stores/${store.id}`}>
                    <p className="store-title">{store.name}</p>
                    <p>{store.address}</p>
                    <p>{store.phone}</p>
                    <p>{store.hours}</p>
                  </Link>
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
