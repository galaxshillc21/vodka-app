// src/components/InlineMap.tsx
"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface InlineMapProps {
	center: [number, number];
	zoom: number;
}

const InlineMap: React.FC<InlineMapProps> = ({ center, zoom }) => {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!ref.current) return;

		const map = new maplibregl.Map({
			container: ref.current,
			style: "https://api.maptiler.com/maps/streets-v2/style.json?key=1vVunb6izrFWlkamr2Is",
			center,
			zoom,
		});

		new maplibregl.Marker().setLngLat(center).addTo(map);

		return () => map.remove();
	}, [center, zoom]);

	return <div ref={ref} className="w-full h-[200px] rounded-lg" />;
};

export default InlineMap;
