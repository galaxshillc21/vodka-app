// src/components/Map.tsx
"use client";

import { useEffect, useRef } from "react";
import maplibregl, { NavigationControl, AttributionControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Store } from "@/types/store";

interface MapProps {
  userCoords: [number, number] | null;
  stores: Store[];
  selectedStore: Store | null;
}

const MADRID_COORDS: [number, number] = [-3.7038, 40.4168]; // default fallback

const Map: React.FC<MapProps> = ({ userCoords, stores, selectedStore }) => {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const isCoordsAvailable = userCoords !== null;

    mapRef.current = new maplibregl.Map({
      container: containerRef.current,
      style: "https://api.maptiler.com/maps/streets-v2/style.json?key=1vVunb6izrFWlkamr2Is",
      center: isCoordsAvailable ? userCoords! : MADRID_COORDS,
      zoom: isCoordsAvailable ? 10 : 5,
      attributionControl: false,
    });
    mapRef.current.addControl(
      new NavigationControl({
        showCompass: true,
        showZoom: true,
        visualizePitch: false,
      }),

      "bottom-right"
    );
    mapRef.current.addControl(
      new AttributionControl({
        compact: false,
      }),
      "top-right"
    );
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [userCoords]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear previous markers
    const markers: maplibregl.Marker[] = [];

    stores.forEach((store) => {
      const marker = new maplibregl.Marker().setLngLat([store.longitude, store.latitude]).addTo(mapRef.current!);
      markers.push(marker);
    });

    return () => {
      markers.forEach((marker) => marker.remove());
    };
  }, [stores]);

  useEffect(() => {
    if (!mapRef.current || !selectedStore) return;

    mapRef.current.flyTo({
      center: [selectedStore.longitude, selectedStore.latitude],
      zoom: 14,
      speed: 1.2,
      essential: true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedStore]);

  return <div ref={containerRef} className="w-full h-full relative" />;
};

export default Map;
