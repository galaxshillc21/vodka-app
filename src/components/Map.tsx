"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface MapProps {
  center: [number, number];
  zoom: number;
}

const Map: React.FC<MapProps> = ({ center, zoom }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstance.current) return;

    mapInstance.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://api.maptiler.com/maps/streets-v2/style.json?key=1vVunb6izrFWlkamr2Is", // Use the "streets" style
      center,
      zoom,
    });

    new maplibregl.Marker().setLngLat(center).addTo(mapInstance.current);

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null; // Prevent memory leaks
    };
  }, [center, zoom]);

  return <div ref={mapContainerRef} style={{ height: "200px", width: "100%" }} />;
};

export default Map;
