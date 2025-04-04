"use client";

import { useEffect, useState } from "react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white text-black">
      <h1 className="text-3xl main-title text-center font-extrabold font-semibold animate-in fade-in zoom-in duration-700">BLAT</h1>
    </div>
  );
}
