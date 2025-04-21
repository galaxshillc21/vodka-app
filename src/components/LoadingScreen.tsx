"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Adjust this to your preferred delay

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-black" id="LoadingScreen">
      <Image
        src="/images/blat_vodka_logo_bronze.png" // Path to your image in the public directory
        alt="Blat Vodka Logo Bronze"
        width={200} // Adjust the width as needed
        height={200} // Adjust the height as needed
        priority // Ensures the image is loaded quickly
      />
      <p className="mt-6 text-grey">El Vodka más puro del mundo.</p>
    </div>
  );
}
