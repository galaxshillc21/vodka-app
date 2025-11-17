"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Plus, CalendarDays, Store as StoreIcon, Truck, Database, Loader2 } from "lucide-react";
import EventForm from "@/components/EventForm";
import EventList from "@/components/EventList";
import StoreForm from "@/components/StoreForm";
import StoreList from "@/components/StoreList";
import { Event } from "@/types/event";
import { Store } from "@/types/store";
import { auth } from "@/lib/firebase";

type ViewMode = "list" | "create" | "edit";
type Section = "events" | "stores" | "distributors";

export default function AdminDashboard() {
  const { logout, user } = useAuth();
  const [section, setSection] = useState<Section>("events");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationComplete, setMigrationComplete] = useState(false);

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

  const handleMigrateData = async () => {
    if (!confirm("¿Migrar datos de JSON a Firestore? Esta acción copiará todos los stores y distribuidores a la base de datos.")) {
      return;
    }

    try {
      setIsMigrating(true);
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Not authenticated");
      }

      const token = await user.getIdToken();
      const response = await fetch("/api/migrate-data", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Migration failed");
      }

      const result = await response.json();
      alert(`✅ Migración completada!\n${result.storesCount} tiendas y ${result.distributorsCount} distribuidores migrados.`);
      setMigrationComplete(true);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Migration error:", error);
      alert("❌ Error durante la migración");
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 p-4">
      {/* Header */}
      <div className="mb-8 mt-20">
        <div className="flex justify-between items-center bg-white/70 backdrop-blur-md border border-white/50 rounded-xl p-6 shadow-lg">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-700 bg-clip-text text-transparent">Panel de Administración</h1>
            <p className="text-gray-600">
              Bienvenido de vuelta, <b>{getUserDisplayName()}</b>
            </p>
          </div>
          <div className="flex gap-3">
            {!migrationComplete && (
              <Button onClick={handleMigrateData} disabled={isMigrating} variant="outline" className="flex items-center gap-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600">
                {isMigrating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Migrando...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" />
                    Migrar Datos
                  </>
                )}
              </Button>
            )}
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2 border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600">
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mb-6">
        <div className="flex justify-between items-center bg-white/70 backdrop-blur-md border border-white/50 rounded-lg p-2 shadow-lg">
          <div className="flex gap-2">
            <Button onClick={() => handleSectionChange("events")} variant={section === "events" ? "default" : "outline"} className={`flex items-center gap-2 ${section === "events" ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white" : "border-amber-200 hover:bg-amber-50"}`}>
              <CalendarDays className="w-4 h-4" />
              Eventos
            </Button>

            <Button onClick={() => handleSectionChange("stores")} variant={section === "stores" ? "default" : "outline"} className={`flex items-center gap-2 ${section === "stores" ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white" : "border-amber-200 hover:bg-amber-50"}`}>
              <StoreIcon className="w-4 h-4" />
              Tiendas
            </Button>

            <Button
              onClick={() => handleSectionChange("distributors")}
              variant={section === "distributors" ? "default" : "outline"}
              className={`flex items-center gap-2 ${section === "distributors" ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white" : "border-amber-200 hover:bg-amber-50"}`}
            >
              <Truck className="w-4 h-4" />
              Distribuidores
            </Button>
          </div>

          {viewMode === "list" && (
            <Button onClick={() => setViewMode("create")} className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700">
              <Plus className="w-4 h-4" />
              {section === "events" ? "Crear Evento" : section === "stores" ? "Crear Tienda" : "Crear Distribuidor"}
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
      </div>
    </div>
  );
}
