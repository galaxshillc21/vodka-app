"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Plus, CalendarDays, Store as StoreIcon, Truck, Loader2, Settings } from "lucide-react";
import EventForm from "@/components/EventForm";
import EventList from "@/components/EventList";
import StoreForm from "@/components/StoreForm";
import StoreList from "@/components/StoreList";
import { Event } from "@/types/event";
import { Store } from "@/types/store";
import { SettingsService } from "@/lib/settingsService";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type ViewMode = "list" | "create" | "edit";
type Section = "events" | "stores" | "distributors" | "settings";

export default function AdminDashboard() {
  const { logout, user } = useAuth();
  const [section, setSection] = useState<Section>("events");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showFeaturedEvent, setShowFeaturedEvent] = useState(true);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoadingSettings(true);
        const settings = await SettingsService.getHomepageSettings();
        setShowFeaturedEvent(settings.showFeaturedEvent);
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setIsLoadingSettings(false);
      }
    };

    loadSettings();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getUserDisplayName = () => {
    if (user?.displayName) {
      return user.displayName;
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "Administrador";
  };

  const handleCreateSuccess = () => {
    setViewMode("list");
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setViewMode("edit");
  };

  const handleEditStore = (store: Store) => {
    setEditingStore(store);
    setViewMode("edit");
  };

  const handleEditSuccess = () => {
    setViewMode("list");
    setEditingEvent(null);
    setEditingStore(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleCancel = () => {
    setViewMode("list");
    setEditingEvent(null);
    setEditingStore(null);
  };

  const handleSectionChange = (newSection: Section) => {
    setSection(newSection);
    setViewMode("list");
    setEditingEvent(null);
    setEditingStore(null);
  };

  const handleToggleFeaturedEvent = async (checked: boolean) => {
    try {
      setIsSavingSettings(true);
      await SettingsService.updateHomepageSettings({ showFeaturedEvent: checked });
      setShowFeaturedEvent(checked);
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("❌ Error al actualizar la configuración");
    } finally {
      setIsSavingSettings(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8 mt-16 sm:mt-20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/70 backdrop-blur-md border border-white/50 rounded-xl p-4 sm:p-6 shadow-lg">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-700 bg-clip-text text-transparent">Panel de Administración</h1>
              <p className="text-sm sm:text-base text-gray-600">
                Bienvenido de vuelta, <b>{getUserDisplayName()}</b>
              </p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2 border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 flex-1 sm:flex-initial">
                <LogOut className="w-4 h-4" />
                <span className="text-sm sm:text-base">Cerrar Sesión</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-white/70 backdrop-blur-md border border-white/50 rounded-lg p-2 shadow-lg">
            <div className="flex gap-2 overflow-x-auto pb-1">
              <Button
                onClick={() => handleSectionChange("events")}
                variant={section === "events" ? "default" : "outline"}
                className={`flex items-center gap-2 whitespace-nowrap text-sm sm:text-base ${section === "events" ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white" : "border-amber-200 hover:bg-amber-50"}`}
              >
                <CalendarDays className="w-4 h-4" />
                Eventos
              </Button>

              <Button
                onClick={() => handleSectionChange("stores")}
                variant={section === "stores" ? "default" : "outline"}
                className={`flex items-center gap-2 whitespace-nowrap text-sm sm:text-base ${section === "stores" ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white" : "border-amber-200 hover:bg-amber-50"}`}
              >
                <StoreIcon className="w-4 h-4" />
                Tiendas
              </Button>

              <Button
                onClick={() => handleSectionChange("distributors")}
                variant={section === "distributors" ? "default" : "outline"}
                className={`flex items-center gap-2 whitespace-nowrap text-sm sm:text-base ${section === "distributors" ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white" : "border-amber-200 hover:bg-amber-50"}`}
              >
                <Truck className="w-4 h-4" />
                Distribuidores
              </Button>

              <Button
                onClick={() => handleSectionChange("settings")}
                variant={section === "settings" ? "default" : "outline"}
                className={`flex items-center gap-2 whitespace-nowrap text-sm sm:text-base ${section === "settings" ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white" : "border-amber-200 hover:bg-amber-50"}`}
              >
                <Settings className="w-4 h-4" />
                Configuración
              </Button>
            </div>

            {viewMode === "list" && (
              <Button onClick={() => setViewMode("create")} className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 text-sm sm:text-base w-full sm:w-auto">
                <Plus className="w-4 h-4" />
                {section === "events" ? "Crear Evento" : section === "stores" ? "Crear Tienda" : section === "settings" ? "" : "Crear Distribuidor"}
              </Button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {section === "events" && (
            <>
              {viewMode === "list" && <EventList onEdit={handleEditEvent} refreshTrigger={refreshTrigger} />}

              {(viewMode === "create" || viewMode === "edit") && <EventForm onSuccess={viewMode === "create" ? handleCreateSuccess : handleEditSuccess} onCancel={handleCancel} editingEvent={editingEvent} />}
            </>
          )}

          {section === "stores" && (
            <>
              {viewMode === "list" && <StoreList onEdit={handleEditStore} refreshTrigger={refreshTrigger} type="store" />}

              {(viewMode === "create" || viewMode === "edit") && <StoreForm onSuccess={handleEditSuccess} onCancel={handleCancel} editingStore={editingStore} type="store" />}
            </>
          )}

          {section === "distributors" && (
            <>
              {viewMode === "list" && <StoreList onEdit={handleEditStore} refreshTrigger={refreshTrigger} type="distributor" />}

              {(viewMode === "create" || viewMode === "edit") && <StoreForm onSuccess={handleEditSuccess} onCancel={handleCancel} editingStore={editingStore} type="distributor" />}
            </>
          )}

          {section === "settings" && (
            <div className="bg-white/70 backdrop-blur-md border border-white/50 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Configuración de la Página Principal</h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <Label htmlFor="featured-event-toggle" className="text-base font-medium text-gray-900 cursor-pointer">
                      Mostrar evento destacado en página principal
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">Cuando está activado, el evento destacado aparece en la sección principal de la página de inicio</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isSavingSettings && <Loader2 className="w-4 h-4 animate-spin text-amber-600" />}
                    <Switch id="featured-event-toggle" checked={showFeaturedEvent} onCheckedChange={handleToggleFeaturedEvent} disabled={isLoadingSettings || isSavingSettings} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
