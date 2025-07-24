import { Phone, Clock10, Star, Navigation } from "lucide-react";
import InlineMap from "@/components/InlineMap"; // ✅ NOT the full Map
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FavoritosTab = ({ favorites, formatDistance, toggleFavorite }) => {
  if (favorites.length === 0) {
    return (
      <div>
        <p>No tienes tiendas favoritas.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-3 text-center">Tus Tiendas Favoritas</h3>
      <ul>
        {favorites.map((store) => (
          <li key={store.id} className="frosted-card store relative shadow-md">
            <Tabs defaultValue="info" className="w-full">
              <div className="flex justify-center items-center">
                <TabsList className="frosted-tabs mb-2">
                  <TabsTrigger value="info">Información</TabsTrigger>
                  <TabsTrigger value="mapa">Mapa</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="info">
                <div className="info flex flex-col gap-2">
                  <h4>{store.name}</h4>
                  <div className="store-address">
                    <span className="distance">{formatDistance(store.distance)}</span> • <span className="address">{store.address}</span>
                  </div>
                  <p className="hours">
                    <Clock10 size={15} className="inline" /> {store.hours}
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="mapa" className="relative">
                <InlineMap key={`${store.latitude}-${store.longitude}`} center={[store.longitude, store.latitude]} zoom={13} />
                <div className="store-address pill">
                  <span className="distance">{formatDistance(store.distance)}</span> • <span className="address">{store.address}</span>
                </div>
              </TabsContent>
              <div className="action-links flex gap-4 mt-3">
                <a href={`tel:${store.phone.replace(/\s+/g, "")}`} className="text-bronze">
                  <Phone size={15} className="inline" /> Llamar
                </a>
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`} target="_blank" rel="noopener noreferrer" className="text-bronze w-1/3">
                  <Navigation size={15} className="inline" /> Navegar
                </a>
              </div>
            </Tabs>
            {favorites.some((fav) => fav.id === store.id) ? (
              <div className="star starred absolute top-1 right-2" onClick={() => toggleFavorite(store)}>
                <Star size={15} className="inline" />
              </div>
            ) : (
              <div className="star not-starred absolute top-1 right-2" onClick={() => toggleFavorite(store)}>
                <Star size={15} className="inline" />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoritosTab;
