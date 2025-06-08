// src/components/TiendasTab.tsx
import { Phone, Clock10, Star, Navigation } from "lucide-react";
import type { Store } from "@/src/types/store";
import { useTranslations } from "next-intl";

type TiendasTabProps = {
	closestStores: Store[];
	formatDistance: (distance: number) => string;
	favorites: Store[];
	toggleFavorite: (store: Store) => void;
	onStoreSelect: (store: Store) => void;
	selectedStore: Store | null; // 👈 NEW
};

const TiendasTab = ({
	closestStores,
	formatDistance,
	favorites,
	toggleFavorite,
	onStoreSelect,
	selectedStore,
}: TiendasTabProps) => {
	const t = useTranslations("SearchPage");

	return (
		<div id="Stores">
			{closestStores.length > 0 && (
				<ul>
					{closestStores.map((store) => {
						const isSelected = selectedStore?.id === store.id;
						return (
							<li
								key={store.id}
								className={`store relative shadow-md rounded-xl p-4 mb-6 py-8 hover:cursor-pointer bg-blue-50/30 transition-all duration-200 ${
									isSelected ? "border-2 border-blue-300" : "border border-transparent"
								}`}
								onClick={() => onStoreSelect(store)}
							>
								<div className="w-full">
									<div className="info flex flex-col gap-2">
										<h4>{store.name}</h4>
										<div className="store-address">
											<span className="distance">{formatDistance(store.distance)}</span> •{" "}
											<span className="address">{store.address}</span>
										</div>
										<p className="hours">
											<Clock10 size={15} className="inline" /> {store.hours}
										</p>
									</div>
									<div className="action-links flex gap-4 mt-3">
										<a
											href={`tel:${store.phone.replace(/\s+/g, "")}`}
											className="text-bronze hover:underline"
										>
											<Phone size={15} className="inline" /> {t("callStore")}
										</a>
										<a
											href={`https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`}
											target="_blank"
											rel="noopener noreferrer"
											className="text-bronze w-auto hover:underline"
										>
											<Navigation size={15} className="inline" /> {t("navigateToStore")}
										</a>
									</div>
								</div>

								<div
									className={`star absolute top-1 right-2 ${
										favorites.some((fav) => fav.id === store.id) ? "starred" : "not-starred"
									}`}
									onClick={(e) => {
										e.stopPropagation(); // Prevent triggering onStoreSelect
										toggleFavorite(store);
									}}
								>
									<Star size={15} className="inline" />
								</div>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
};

export default TiendasTab;
