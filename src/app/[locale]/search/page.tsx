// app/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search as SearchIcon, LocateFixed } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import TiendasTab from "@/src/components/TiendasTab";
import EventosTab from "@/src/components/EventosTab";
import FavoritosTab from "@/src/components/FavoritosTab";
import { SkeletonTiendas, SkeletonEventos } from "@/src/components/SkeletonCard";
import stores from "@/src/data/stores.json";
import { haversineDistance } from "@/src/utils/distance";
// import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import type { Store } from "@/src/types/store"; // <-- Create this type if not present

// Dynamic import of map to avoid SSR issues
const MapComponent = dynamic(() => import("@/src/components/Map"), { ssr: false });

export default function Search() {
	const t = useTranslations("SearchPage");
	const [zipcode, setZipcode] = useState("");
	const [closestStores, setClosestStores] = useState<Store[]>([]);
	const [selectedStore, setSelectedStore] = useState<Store | null>(null);
	const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
	const [loading, setLoading] = useState(false);
	const [favorites, setFavorites] = useState<Store[]>([]);

	const findClosestStore = useCallback(async (coords: [number, number]) => {
		try {
			const sortedStores = stores
				.map((store: Store) => {
					const storeCoords: [number, number] = [store.longitude, store.latitude]; // lon, lat
					const distance = haversineDistance(coords, storeCoords);
					return { ...store, distance };
				})
				.sort((a, b) => a.distance - b.distance);

			setClosestStores(sortedStores.slice(0, 5));
		} catch (error) {
			console.error("Error finding closest store:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	const findClosestStoreByZipcode = useCallback(
		async (zipcode: string) => {
			try {
				const response = await fetch(
					`https://nominatim.openstreetmap.org/search?q=${zipcode}&format=json&addressdetails=1&countrycodes=ES`
				);
				const data = await response.json();

				if (!data.length) return;

				const { lon, lat } = data[0];
				const coords: [number, number] = [parseFloat(lon), parseFloat(lat)]; // lon, lat
				setUserCoords(coords);
				await findClosestStore(coords);
			} catch (error) {
				console.error("Error:", error);
			} finally {
				setLoading(false);
			}
		},
		[findClosestStore]
	);

	useEffect(() => {
		const savedZip = localStorage.getItem("zipcode");
		if (savedZip) {
			setZipcode(savedZip);
			findClosestStoreByZipcode(savedZip);
		}
	}, [findClosestStoreByZipcode]);

	const handleZipcodeSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!zipcode.trim()) return;
		localStorage.setItem("zipcode", zipcode);
		setLoading(true);
		await findClosestStoreByZipcode(zipcode);
	};

	const handleLocationShare = () => {
		if (!navigator.geolocation) return;
		setLoading(true);
		navigator.geolocation.getCurrentPosition(
			async (pos) => {
				const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude]; // lon, lat
				setUserCoords(coords);
				await findClosestStore(coords);
			},
			(err) => {
				console.error("Geolocation error:", err);
				setLoading(false);
			}
		);
	};

	const toggleFavorite = (store) => {
		setFavorites((prev) =>
			prev.some((fav) => fav.id === store.id)
				? prev.filter((fav) => fav.id !== store.id)
				: [...prev, store]
		);
	};

	const formatDistance = (d: number) =>
		d < 1 ? `${(d * 1000).toFixed(0)} m` : `${d.toFixed(2)} km`;

	useEffect(() => {
		const saved = localStorage.getItem("favorites");
		if (saved) setFavorites(JSON.parse(saved));
	}, []);

	useEffect(() => {
		localStorage.setItem("favorites", JSON.stringify(favorites));
	}, [favorites]);

	return (
		<section className="container mx-auto px-2 py-4 bg-bottle">
			<div className="flex flex-col md:flex-row h-screen gap-4">
				{/* LEFT: Content */}
				<div className="md:w-1/2 w-full overflow-y-auto p-4">
					<div className="flex justify-center mb-4">
						<Image
							src="/images/blat_logo_bronze.png"
							alt="Blat Logo Bronze"
							width={100}
							height={100}
							priority
						/>
					</div>
					<h4 className="subTitle text-center">{t("heroTitlePart1")}</h4>

					<form onSubmit={handleZipcodeSubmit} className="mt-4 space-y-2">
						<div className="flex gap-2">
							<input
								type="text"
								value={zipcode}
								onChange={(e) => setZipcode(e.target.value)}
								placeholder={t("zipcodePlaceholder")}
								className="p-2 w-full border rounded"
							/>
							<button type="submit" className="bg-primary text-white px-4 py-2 rounded">
								<SearchIcon size={16} />
							</button>
							<button
								type="button"
								onClick={handleLocationShare}
								className="bg-primary text-white px-2 py-2 rounded"
							>
								<LocateFixed size={16} />
							</button>
						</div>
					</form>

					<Tabs defaultValue="tiendas" className="mt-6">
						<TabsList className="w-full bg-bronze-muted rounded-md">
							<TabsTrigger value="tiendas" className="w-1/3">
								{t("tabStores")}
							</TabsTrigger>
							<TabsTrigger value="eventos" className="w-1/3">
								{t("tabEvents")}
							</TabsTrigger>
							<TabsTrigger value="favoritos" className="w-1/3">
								{t("tabFavorites")}
							</TabsTrigger>
						</TabsList>

						<TabsContent value="tiendas">
							{loading ? (
								<SkeletonTiendas />
							) : (
								<>
									<h3 className="mt-4 mb-2 text-center">{t("closestStoresHeading")}</h3>
									<TiendasTab
										closestStores={closestStores}
										formatDistance={formatDistance}
										favorites={favorites}
										toggleFavorite={toggleFavorite}
										onStoreSelect={(store) => setSelectedStore(store)} // Pass clicked store to zoom
									/>
									<div className="text-center mt-2">
										<Link href="/stores" className="text-primary underline">
											{t("viewAllStoresLink")}
										</Link>
									</div>
								</>
							)}
						</TabsContent>

						<TabsContent value="eventos">
							{loading ? (
								<SkeletonEventos />
							) : (
								<EventosTab userCoords={userCoords} formatDistance={formatDistance} />
							)}
						</TabsContent>

						<TabsContent value="favoritos">
							<FavoritosTab
								favorites={favorites}
								formatDistance={formatDistance}
								toggleFavorite={toggleFavorite}
							/>
						</TabsContent>
					</Tabs>
				</div>

				{/* RIGHT: Map */}
				<div className="md:w-1/2 w-full h-[30vh] md:h-full sticky top-0 z-10">
					<MapComponent
						userCoords={userCoords}
						stores={closestStores}
						selectedStore={selectedStore}
					/>
				</div>
			</div>
		</section>
	);
}
