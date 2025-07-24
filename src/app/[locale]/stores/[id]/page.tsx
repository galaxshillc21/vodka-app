// app/[locale]/stores/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import stores from "@/data/stores.json";
import Map from "@/components/InlineMap"; // Use InlineMap if it accepts center/zoom
import type { Store } from "@/types/store";

const StoreDetails = () => {
  const router = useRouter();
  const params = useParams();

  const { id } = params as { id: string };

  const [store, setStore] = useState<Store | null>(null);

  useEffect(() => {
    if (!id) return;

    const selectedStore = stores.find((s) => s.id.toString() === id);

    if (!selectedStore) {
      console.warn("Store not found for ID:", id);
      router.push("/stores");
      return;
    }

    setStore(selectedStore);
  }, [id, router]);

  if (!store) return <p className="text-center p-8">Loading...</p>;

  const { latitude, longitude, name, address, phone, hours } = store;

  return (
    <div className="container mx-auto p-4">
      <button onClick={() => router.push("/")} className="mb-4 p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        ← Back to Home
      </button>

      <h2 className="main-title text-center font-extrabold text-2xl mb-4">{name}</h2>

      <div className="frosted-card p-4 space-y-2">
        <p>
          <strong>Address:</strong> {address}
        </p>
        <p>
          <strong>Phone:</strong> {phone}
        </p>
        <p>
          <strong>Hours:</strong> {hours}
        </p>
        <p>
          <strong>Coordinates:</strong> {latitude}, {longitude}
        </p>

        <Map center={[longitude, latitude]} zoom={13} />
      </div>
    </div>
  );
};

export default StoreDetails;
