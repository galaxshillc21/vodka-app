// src/components/Map.tsx
"use client";

// TO CHANGE MAP STYLE:
// 1. Edit mapStyles.ts and change DEFAULT_MAP_STYLE
// 2. Or uncomment one of the alternative styles below in the maplibregl.Map constructor

import { useEffect, useRef, useCallback, useMemo } from "react";
import maplibregl, { NavigationControl, AttributionControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Store } from "@/types/store";
import { mapStyles } from "./mapStyles";
import { useTranslations } from "next-intl";
import { Phone, Navigation2, Clock, MapPin } from "lucide-react";
import { renderToString } from "react-dom/server";

interface MapProps {
  userCoords: [number, number] | null;
  stores: Store[];
  selectedStore: Store | null;
}

const MADRID_COORDS: [number, number] = [-3.7038, 40.4168]; // default fallback

const Map: React.FC<MapProps> = ({ userCoords, stores, selectedStore }) => {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);
  const t = useTranslations("SearchPage");

  // Memoize the initial coordinates to prevent unnecessary re-renders
  const initialCoords = useMemo(() => {
    return userCoords !== null ? userCoords : MADRID_COORDS;
  }, [userCoords]);

  // Helper function to create popup content with Lucide icons
  const createPopupContent = useCallback(
    (store: Store) => {
      const PopupContent = () => (
        <div className="map-popup">
          <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "600", color: "#333" }}>{store.name}</h3>
          <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#666", lineHeight: "1.4" }}>{store.address}</p>
          <div style={{ margin: "8px 0", fontSize: "13px", color: "#555" }}>
            {store.distance && typeof store.distance === "number" && !isNaN(store.distance) && (
              <div style={{ marginBottom: "4px", fontWeight: "500", color: "#1976d2", display: "flex", alignItems: "center", gap: "4px" }}>
                <MapPin size={14} />
                {store.distance < 1 ? `${(store.distance * 1000).toFixed(0)} m` : `${store.distance.toFixed(2)} km`}
              </div>
            )}
            <div style={{ marginBottom: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
              <Phone size={14} />
              {store.phone}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Clock size={14} />
              {store.hours}
            </div>
          </div>
          <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#1976d2",
                color: "white",
                padding: "8px 12px",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: "500",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                cursor: "pointer",
              }}
            >
              <Navigation2 size={14} />
              {t("navigateToStore")}
            </a>
            <a
              href={`tel:${store.phone.replace(/\s+/g, "")}`}
              style={{
                background: "#388e3c",
                color: "white",
                padding: "8px 12px",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: "500",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Phone size={14} />
              {t("callStore")}
            </a>
          </div>
        </div>
      );

      return renderToString(<PopupContent />);
    },
    [t]
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current || isInitializedRef.current) return;

    isInitializedRef.current = true;
    const isCoordsAvailable = userCoords !== null;

    try {
      mapRef.current = new maplibregl.Map({
        container: containerRef.current,
        // style: DEFAULT_MAP_STYLE, // Google Maps-like appearance
        // Alternative styles you can try:
        // style: mapStyles.bright, // More colorful
        style: mapStyles.streetsv4, // With terrain
        // style: mapStyles.outdoor, // With terrain
        // style: mapStyles.hybrid, // Satellite with labels
        center: initialCoords,
        zoom: userCoords !== null ? 10 : 5,
        attributionControl: false,
      });

      // Add error handling for map load errors
      mapRef.current.on("error", (e) => {
        console.warn("Map load error (this is normal if requests are aborted):", e);
        // Don't throw error, just log it to prevent app crashes
      });

      // Handle style load events
      mapRef.current.on("styledata", () => {
        // Style has loaded successfully
      });

      mapRef.current.on("sourcedataloading", () => {
        // Suppress the "signal is aborted" errors in console by handling source loading
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
    } catch (error) {
      console.error("Error initializing map:", error);
      isInitializedRef.current = false;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      isInitializedRef.current = false;
    };
  }, []); // Remove userCoords dependency to prevent recreation

  // Separate effect to handle coordinate changes without recreating the map
  useEffect(() => {
    if (!mapRef.current || !userCoords) return;

    mapRef.current.flyTo({
      center: userCoords,
      zoom: 10,
      speed: 1.2,
      essential: true,
    });
  }, [userCoords]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear previous markers
    const markers: maplibregl.Marker[] = [];
    const popups: maplibregl.Popup[] = [];

    stores.forEach((store) => {
      // Create popup with store information and navigation button
      const popup = new maplibregl.Popup({
        closeButton: true,
        closeOnClick: false,
        maxWidth: "300px",
      }).setHTML(createPopupContent(store));

      // Create marker with popup
      const isSelected = selectedStore?.id === store.id;
      const marker = new maplibregl.Marker({
        color: isSelected ? "#ff5722" : "#1976d2", // Orange for selected, blue for others
        scale: isSelected ? 1.2 : 1, // Slightly larger for selected
      })
        .setLngLat([store.longitude, store.latitude])
        .setPopup(popup)
        .addTo(mapRef.current!);

      // Auto-open popup for selected store
      if (isSelected) {
        popup.addTo(mapRef.current!);
      }

      markers.push(marker);
      popups.push(popup);
    });

    return () => {
      markers.forEach((marker) => marker.remove());
      popups.forEach((popup) => popup.remove());
    };
  }, [stores, selectedStore, createPopupContent]);

  useEffect(() => {
    if (!mapRef.current || !selectedStore) return;

    mapRef.current.flyTo({
      center: [selectedStore.longitude, selectedStore.latitude],
      zoom: 17, // Increased zoom for closer view (was 14)
      speed: 1.5, // Slightly faster animation
      essential: true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedStore]);

  return (
    <>
      <style jsx global>{`
        .maplibregl-popup-content {
          padding: 16px !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }
        .maplibregl-popup-anchor-bottom .maplibregl-popup-tip {
          border-top-color: white !important;
        }
        .maplibregl-popup-anchor-top .maplibregl-popup-tip {
          border-bottom-color: white !important;
        }
        .maplibregl-popup-anchor-left .maplibregl-popup-tip {
          border-right-color: white !important;
        }
        .maplibregl-popup-anchor-right .maplibregl-popup-tip {
          border-left-color: white !important;
        }
        .map-popup a:hover {
          opacity: 0.9;
          transform: translateY(-1px);
          transition: all 0.2s ease;
        }
        .map-popup svg {
          flex-shrink: 0;
        }
      `}</style>
      <div ref={containerRef} className="w-full h-full relative" />
    </>
  );
};

export default Map;
