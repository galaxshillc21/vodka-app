"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateEventData, Event } from "@/types/event";
import { EventService } from "@/lib/eventService";
import { ImageProcessor, ProcessedImage } from "@/lib/imageProcessor";
import { Upload, X, MapPin, Calendar, Globe, FileText, Image as ImageIcon, Zap } from "lucide-react";

interface EventFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  editingEvent?: Event | null;
}

export default function EventForm({ onSuccess, onCancel, editingEvent }: EventFormProps) {
  const [formData, setFormData] = useState<CreateEventData>({
    name: "",
    date: "",
    description: "",
    location: {
      town: "",
      municipality: "",
      latitude: 0,
      longitude: 0,
    },
    website: "",
    images: [],
  });

  const [selectedImages, setSelectedImages] = useState<ProcessedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  // Populate form when editing an event
  useEffect(() => {
    if (editingEvent) {
      setFormData({
        name: editingEvent.name,
        date: editingEvent.date,
        description: editingEvent.description,
        location: editingEvent.location,
        website: editingEvent.website,
        images: [],
      });
      setSelectedImages([]); // Reset images when editing
    } else {
      // Reset form when creating new event
      setFormData({
        name: "",
        date: "",
        description: "",
        location: {
          town: "",
          municipality: "",
          latitude: 0,
          longitude: 0,
        },
        website: "",
        images: [],
      });
      setSelectedImages([]);
    }
  }, [editingEvent]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: locationField === "latitude" || locationField === "longitude" ? parseFloat(value) || 0 : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageSelect = async (files: FileList | null) => {
    if (!files) return;

    const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) return;

    setIsProcessingImages(true);
    try {
      const processedImages = await ImageProcessor.processImages(imageFiles);
      setSelectedImages((prev) => [...prev, ...processedImages]);
    } catch (error) {
      console.error("Error processing images:", error);
      setError("Error al procesar las imágenes. Por favor, inténtalo de nuevo.");
    } finally {
      setIsProcessingImages(false);
    }
  };

  const removeImage = (index: number) => {
    const imageToRemove = selectedImages[index];
    // Clean up the object URL to prevent memory leaks
    if (imageToRemove?.url) {
      ImageProcessor.cleanupUrl(imageToRemove.url);
    }
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isProcessingImages) return;

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (isProcessingImages) return;

    if (e.dataTransfer.files) {
      handleImageSelect(e.dataTransfer.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate required fields
      if (!formData.name || !formData.date || !formData.description) {
        throw new Error("Por favor, completa todos los campos requeridos");
      }

      if (editingEvent) {
        // Update existing event
        await EventService.updateEvent(editingEvent.id, {
          name: formData.name,
          date: formData.date,
          description: formData.description,
          location: formData.location,
          website: formData.website,
        });

        // Upload new images if any
        if (selectedImages.length > 0) {
          const imageUrls = await EventService.uploadEventImages(
            editingEvent.id,
            selectedImages.map((img) => img.file)
          );
          // Append new images to existing ones
          const updatedImages = [...(editingEvent.images || []), ...imageUrls];
          await EventService.updateEventImages(editingEvent.id, updatedImages);
        }
      } else {
        // Create new event
        const eventId = await EventService.createEvent(formData);

        // Upload images if any
        if (selectedImages.length > 0) {
          const imageUrls = await EventService.uploadEventImages(
            eventId,
            selectedImages.map((img) => img.file)
          );
          await EventService.updateEventImages(eventId, imageUrls);
        }
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Error al crear el evento");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="backdrop-blur-md bg-white/70 border-white/50 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-700">
          <Calendar className="w-5 h-5" />
          {editingEvent ? "Editar Evento" : "Crear Nuevo Evento"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Nombre del Evento *
            </Label>
            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Ej: Gran Cata de Vodka Premium" className="bg-white/80 border-gray-200" required />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-gray-700 font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Fecha *
            </Label>
            <Input id="date" name="date" type="datetime-local" value={formData.date} onChange={handleInputChange} className="bg-white/80 border-gray-200" required />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700 font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Descripción *
            </Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe el evento, actividades, y detalles importantes..."
              className="w-full min-h-[100px] p-3 rounded-md border border-gray-200 bg-white/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-4">
            <Label className="text-gray-700 font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Ubicación
            </Label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location.town" className="text-sm text-gray-600">
                  Ciudad
                </Label>
                <Input id="location.town" name="location.town" value={formData.location.town} onChange={handleInputChange} placeholder="Ej: Las Palmas" className="bg-white/80 border-gray-200" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location.municipality" className="text-sm text-gray-600">
                  Municipio
                </Label>
                <Input id="location.municipality" name="location.municipality" value={formData.location.municipality} onChange={handleInputChange} placeholder="Ej: Las Palmas de Gran Canaria" className="bg-white/80 border-gray-200" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location.latitude" className="text-sm text-gray-600">
                  Latitud
                </Label>
                <Input id="location.latitude" name="location.latitude" type="number" step="any" value={formData.location.latitude || ""} onChange={handleInputChange} placeholder="28.12355" className="bg-white/80 border-gray-200" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location.longitude" className="text-sm text-gray-600">
                  Longitud
                </Label>
                <Input id="location.longitude" name="location.longitude" type="number" step="any" value={formData.location.longitude || ""} onChange={handleInputChange} placeholder="-15.43626" className="bg-white/80 border-gray-200" />
              </div>
            </div>
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website" className="text-gray-700 font-medium flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Sitio Web
            </Label>
            <Input id="website" name="website" type="url" value={formData.website} onChange={handleInputChange} placeholder="https://ejemplo.com" className="bg-white/80 border-gray-200" />
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <Label className="text-gray-700 font-medium flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Imágenes del Evento
            </Label>

            {/* Drag and Drop Area */}
            <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive ? "border-amber-500 bg-amber-50" : "border-gray-300 bg-white/50"}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-2">
                Arrastra las imágenes aquí o{" "}
                <label className="text-amber-600 cursor-pointer hover:underline">
                  selecciona archivos
                  <input type="file" multiple accept="image/*" onChange={(e) => handleImageSelect(e.target.files)} className="hidden" disabled={isProcessingImages} />
                </label>
              </p>
              <p className="text-sm text-gray-500">{isProcessingImages ? "Procesando imágenes..." : "Las imágenes se redimensionarán automáticamente y convertirán a WebP"}</p>
            </div>

            {/* Selected Images Preview */}
            {selectedImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img src={image.url} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading || isProcessingImages} className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  {editingEvent ? "Actualizando Evento..." : "Creando Evento..."}
                </>
              ) : editingEvent ? (
                "Actualizar Evento"
              ) : (
                "Crear Evento"
              )}
            </Button>

            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading} className="border-gray-200 hover:bg-gray-50">
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
