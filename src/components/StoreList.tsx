"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store } from "@/types/store";
import { auth } from "@/lib/firebase";
import { Edit, Trash2, MapPin, Phone, Clock, Loader2 } from "lucide-react";

interface StoreListProps {
  onEdit: (store: Store) => void;
  refreshTrigger: number;
  type: "store" | "distributor";
}

export default function StoreList({ onEdit, refreshTrigger, type }: StoreListProps) {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger, type]);

  const fetchStores = async () => {
    try {
      setIsLoading(true);
      const endpoint = type === "store" ? "/api/stores" : "/api/distributors";
      const response = await fetch(endpoint);
      const data = await response.json();
      setStores(data);
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar este ${type === "store" ? "tienda" : "distribuidor"}?`)) {
      return;
    }

    try {
      setDeletingId(String(id));
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Not authenticated");
      }

      const token = await user.getIdToken();
      const endpoint = type === "store" ? "/api/stores" : "/api/distributors";
      const response = await fetch(`${endpoint}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      await fetchStores();
    } catch (error) {
      console.error("Error deleting store:", error);
      alert("Error al eliminar");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white/70 backdrop-blur-md border-white/50 shadow-xl">
        <CardContent className="p-12">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/70 backdrop-blur-md border-white/50 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-700 bg-clip-text text-transparent">
          {type === "store" ? "Tiendas" : "Distribuidores"} ({stores.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {stores.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No hay {type === "store" ? "tiendas" : "distribuidores"} registrados.</p>
          </div>
        ) : (
          <div className="flex flex-wrap align-items-stretch row-gap-4">
            {stores.map((store) => (
              <div key={store.id} className="p-3 w-1/3">
                <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow w-full h-full">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{store.name}</h3>

                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-amber-600" />
                          <span>{store.address}</span>
                        </div>

                        {store.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-amber-600" />
                            <span>{store.phone}</span>
                          </div>
                        )}

                        {store.hours && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-600" />
                            <span>{store.hours}</span>
                          </div>
                        )}

                        {/* Debug: Show coordinates */}
                        {store.latitude && store.longitude && (
                          <div className="text-xs text-gray-400 mt-2">
                            Coords: {store.latitude}, {store.longitude}
                          </div>
                        )}

                        {type === "store" && store.storeType && (
                          <div className="mt-2">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${store.storeType === "public" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>{store.storeType === "public" ? "Particular" : "Profesional"}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button onClick={() => onEdit(store)} variant="outline" size="sm" className="border-amber-200 hover:bg-amber-50">
                        <Edit className="w-4 h-4" />
                      </Button>

                      <Button onClick={() => handleDelete(store.id)} variant="outline" size="sm" disabled={deletingId === String(store.id)} className="border-red-200 hover:bg-red-50 hover:text-red-600">
                        {deletingId === String(store.id) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
