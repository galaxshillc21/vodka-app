"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateEventData, Event } from "@/types/event";
import { EventService } from "@/lib/eventService";
import { ImageProcessor, ProcessedImage } from "@/lib/imageProcessor";
import { Upload, X, MapPin, Calendar, Globe, FileText, Image as ImageIcon } from "lucide-react";

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
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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
      setSelectedImages([]); // Reset new images when editing
      setExistingImages(editingEvent.images || []); // Set existing images
    } else {
      // Reset form when creating new event
      setFormData({
        name: "",
        date: "",
        description: "",
        location: {
          venue: "",
          town: "",
          municipality: "",
          latitude: 0,
          longitude: 0,
          googleMapsLink: "",
        },
        website: "",
        images: [],
      });
      setSelectedImages([]);
      setExistingImages([]);
      setError("");
      setSuccessMessage("");
    }
  }, [editingEvent]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];

      // Validate Google Maps link format
      if (locationField === "googleMapsLink" && value) {
        const isValidGoogleMapsLink = value.includes("maps.app.goo.gl") || value.includes("google.com/maps") || value.includes("maps.google.com");

        if (!isValidGoogleMapsLink) {
          setError("Por favor, ingresa un enlace válido de Google Maps");
        } else {
          setError(""); // Clear error if link is valid
        }
      }

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

  const removeExistingImage = async (imageUrl: string) => {
    if (!editingEvent) return;

    // Show confirmation dialog before deleting
    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar esta imagen? Esta acción no se puede deshacer y la imagen se eliminará permanentemente del almacenamiento.");

    if (!confirmed) return;

    setIsDeletingImage(imageUrl);
    try {
      await EventService.deleteEventImage(editingEvent.id, imageUrl);
      setExistingImages((prev) => prev.filter((img) => img !== imageUrl));
      setError(""); // Clear any previous errors
      setSuccessMessage("Imagen eliminada correctamente");
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting image:", error);
      setError("Error al eliminar la imagen. Por favor, inténtalo de nuevo.");
    } finally {
      setIsDeletingImage(null);
    }
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
    setSuccessMessage("");

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
          // Combine existing images with new images
          const allImages = [...existingImages, ...imageUrls];
          await EventService.updateEventImages(editingEvent.id, allImages);
        } else if (existingImages.length !== editingEvent.images?.length) {
          // Update images if existing images were removed but no new ones added
          await EventService.updateEventImages(editingEvent.id, existingImages);
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
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || "Error al crear el evento");
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
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="location.venue" className="text-sm text-gray-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Nombre del Lugar (Opcional)
                </Label>
                <Input id="location.venue" name="location.venue" value={formData.location.venue || ""} onChange={handleInputChange} placeholder="Ej: Palacio Rocha, Hotel Seaside Sandy Beach, Auditorio Alfredo Kraus" className="bg-white/80 border-gray-200" />
                <p className="text-xs text-gray-500">Nombre específico del lugar, hotel, centro de convenciones, etc.</p>
              </div>

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

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="location.googleMapsLink" className="text-sm text-gray-600 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Enlace de Google Maps (Recomendado)
                </Label>
                <Input id="location.googleMapsLink" name="location.googleMapsLink" type="url" value={formData.location.googleMapsLink || ""} onChange={handleInputChange} placeholder="https://maps.app.goo.gl/S7J2vWzTTTjupSRu9" className="bg-white/80 border-gray-200" />
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-700 font-medium mb-1">💡 Cómo obtener el enlace:</p>
                  <ol className="text-xs text-blue-600 space-y-1 ml-4 list-decimal">
                    <li>Ve a Google Maps y busca la ubicación</li>
                    <li>Haz clic en &quot;Compartir&quot;</li>
                    <li>Copia el enlace y pégalo aquí</li>
                  </ol>
                </div>
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
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive ? "border-amber-500 bg-amber-50" : "border-gray-300 bg-white/50"} ${isProcessingImages || isDeletingImage ? "opacity-50 pointer-events-none" : ""}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
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
            {(existingImages.length > 0 || selectedImages.length > 0) && (
              <div className="space-y-4">
                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Imágenes Existentes ({existingImages.length})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {existingImages.map((imageUrl, index) => (
                        <div key={`existing-${index}`} className="relative group">
                          <div className="relative w-full h-24">
                            <Image src={imageUrl} alt={`Existing ${index + 1}`} fill className="object-cover rounded-lg border-2 border-blue-200" />
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => removeExistingImage(imageUrl)}
                              disabled={isDeletingImage === imageUrl}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isDeletingImage === imageUrl ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> : <X className="w-3 h-3" />}
                            </button>
                          </div>
                          <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">Existente</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images */}
                {selectedImages.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Nuevas Imágenes ({selectedImages.length})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedImages.map((image, index) => (
                        <div key={`new-${index}`} className="relative group">
                          <div className="relative w-full h-24">
                            <Image src={image.url} alt={`Preview ${index + 1}`} fill className="object-cover rounded-lg border-2 border-green-200" />
                          </div>
                          <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600">
                            <X className="w-3 h-3" />
                          </button>
                          <div className="absolute bottom-1 left-1 bg-green-600 text-white text-xs px-2 py-1 rounded">Nueva</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

          {/* Success Message */}
          {successMessage && <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">{successMessage}</div>}

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
