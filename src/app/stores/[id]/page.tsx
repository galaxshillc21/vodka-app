"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Map from "@/components/Map";
import stores from "@/data/stores.json";

const StoreDetails = () => {
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const [store, setStore] = useState(null);

  useEffect(() => {
    if (id) {
      const foundStore = stores.find((store) => store.id === parseInt(id as string));
      setStore(foundStore);
    }
  }, [id]);

  if (!store) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <Link href="/">Back to Home</Link>
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
        <Map center={[store.latitude, store.longitude]} zoom={13} />
      </div>
    </div>
  );
};

export default StoreDetails;
