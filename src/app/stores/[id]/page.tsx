"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import stores from "@/data/stores.json";
import Map from "@/components/Map";

const StoreDetails = () => {
  const router = useRouter();
  const params = useParams(); // Correct way to get dynamic route params
  const { id } = params; // id is now properly extracted

  const [store, setStore] = useState(null);

  useEffect(() => {
    if (!id) return;

    console.log("Fetching store details for ID:", id);

    const selectedStore = stores.find((s) => s.id.toString() === id);

    if (!selectedStore) {
      console.warn("Store not found for ID:", id);
      router.push("/stores"); // Redirect if not found
      return;
    }

    setStore(selectedStore);
    console.log("Store data loaded:", selectedStore);
  }, [id, router]);

  if (!store) return <p>Loading...</p>;

  const latitude = parseFloat(store.latitude);
  const longitude = parseFloat(store.longitude);

  console.log("Latitude:", latitude, "Longitude:", longitude);

  return (
    <div className="container mx-auto p-4">
      <button onClick={() => router.push("/")} className="p-2 bg-blue-500 text-white rounded">
        Back to Home
      </button>
      <h2 className="main-title text-center font-extrabold frosted-card">{store.name}</h2>
      <div className="frosted-card">
        <p>
          <strong>Address:</strong> {store.address}
        </p>
        <p>
          <strong>Phone:</strong> {store.phone}
        </p>
        <p>
          <strong>Hours:</strong> {store.hours}
        </p>
        <p>
          <strong>Latitude:</strong> {latitude}, <strong>Longitude:</strong> {longitude}
        </p>
        <Map key={`${latitude}-${longitude}`} center={[longitude, latitude]} zoom={13} />
      </div>
    </div>
  );
};

export default StoreDetails;
