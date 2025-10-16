"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Plus, List } from "lucide-react";
import EventForm from "@/components/EventForm";
import EventList from "@/components/EventList";
import { Event } from "@/types/event";

type ViewMode = "list" | "create" | "edit";

export default function AdminDashboard() {
  const { logout, user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
    setRefreshTrigger((prev) => prev + 1); // Trigger EventList refresh
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setViewMode("edit");
  };

  const handleEditSuccess = () => {
    setViewMode("list");
    setEditingEvent(null);
    setRefreshTrigger((prev) => prev + 1); // Trigger EventList refresh
  };

  const handleCancel = () => {
    setViewMode("list");
    setEditingEvent(null);
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
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2 border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600">
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6">
        <div className="flex gap-2 bg-white/70 backdrop-blur-md border border-white/50 rounded-lg p-2 shadow-lg">
          <Button onClick={() => setViewMode("list")} variant={viewMode === "list" ? "default" : "outline"} className={`flex items-center gap-2 ${viewMode === "list" ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white" : "border-amber-200 hover:bg-amber-50"}`}>
            <List className="w-4 h-4" />
            Lista de Eventos
          </Button>

          <Button onClick={() => setViewMode("create")} variant={viewMode === "create" ? "default" : "outline"} className={`flex items-center gap-2 ${viewMode === "create" ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white" : "border-amber-200 hover:bg-amber-50"}`}>
            <Plus className="w-4 h-4" />
            Crear Evento
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {viewMode === "list" && <EventList onEdit={handleEditEvent} refreshTrigger={refreshTrigger} />}

        {(viewMode === "create" || viewMode === "edit") && <EventForm onSuccess={viewMode === "create" ? handleCreateSuccess : handleEditSuccess} onCancel={handleCancel} editingEvent={editingEvent} />}
      </div>
    </div>
  );
}
