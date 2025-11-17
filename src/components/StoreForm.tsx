"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store } from "@/types/store";
import { Loader2, X } from "lucide-react";
import { auth } from "@/lib/firebase";

interface StoreFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  editingStore?: Store | null;
  type: "store" | "distributor";
}

export default function StoreForm({ onSuccess, onCancel, editingStore, type }: StoreFormProps) {
  const [formData, setFormData] = useState<Partial<Store>>({
    name: "",
    address: "",
    googleMapsUrl: "",
    phone: "",
    hours: "",
    storeType: "public",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Populate form when editing
  useEffect(() => {
    if (editingStore) {
      setFormData(editingStore);
    } else {
      setFormData({
        name: "",
        address: "",
        googleMapsUrl: "",
        phone: "",
        hours: "",
        storeType: "public",
      });
      setError("");
      setSuccessMessage("");
    }
  }, [editingStore]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Not authenticated");
      }

      const token = await user.getIdToken();
      const endpoint = type === "store" ? "/api/stores" : "/api/distributors";

      if (editingStore) {
        // Update existing
        const response = await fetch(`${endpoint}/${editingStore.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Failed to update");
        }

        setSuccessMessage(`${type === "store" ? "Store" : "Distributor"} updated successfully!`);
      } else {
        // Create new
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Failed to create");
        }

        setSuccessMessage(`${type === "store" ? "Store" : "Distributor"} created successfully!`);
      }

      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white/70 backdrop-blur-md border-white/50 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-700 bg-clip-text text-transparent">{editingStore ? `Editar ${type === "store" ? "Tienda" : "Distribuidor"}` : `Crear ${type === "store" ? "Tienda" : "Distribuidor"}`}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <Label htmlFor="name">Nombre *</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required className="bg-white" />
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="address">Dirección *</Label>
            <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required className="bg-white" />
          </div>

          {/* Google Maps URL */}
          <div>
            <Label htmlFor="googleMapsUrl">Google Maps URL *</Label>
            <Input id="googleMapsUrl" name="googleMapsUrl" value={formData.googleMapsUrl} onChange={handleInputChange} required placeholder="https://maps.app.goo.gl/..." className="bg-white" />
            <p className="text-xs text-gray-500 mt-1">Pega el enlace de &quot;Compartir&quot; desde Google Maps</p>
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="bg-white" />
          </div>

          {/* Hours */}
          <div>
            <Label htmlFor="hours">Horario</Label>
            <Input id="hours" name="hours" value={formData.hours} onChange={handleInputChange} placeholder="e.g., 9:00 AM - 5:00 PM" className="bg-white" />
          </div>

          {/* Store Type - only for stores */}
          {type === "store" && (
            <div>
              <Label htmlFor="storeType">Tipo de Tienda</Label>
              <select id="storeType" name="storeType" value={formData.storeType || "public"} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-white">
                <option value="public">Público (Minorista)</option>
                <option value="private">Privado (Mayorista)</option>
              </select>
            </div>
          )}

          {/* Error/Success Messages */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-600 text-sm">{successMessage}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button type="submit" disabled={isLoading} className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {editingStore ? "Actualizando..." : "Creando..."}
                </>
              ) : (
                <>{editingStore ? "Actualizar" : "Crear"}</>
              )}
            </Button>

            <Button type="button" onClick={onCancel} variant="outline" className="border-gray-300 hover:bg-gray-50">
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
