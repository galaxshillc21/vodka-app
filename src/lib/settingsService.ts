import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

const SETTINGS_DOC = "settings/homepage";

export interface HomepageSettings {
  showFeaturedEvent: boolean;
  updatedAt?: string;
  updatedBy?: string;
}

export class SettingsService {
  // Get homepage settings
  static async getHomepageSettings(): Promise<HomepageSettings> {
    try {
      if (!db) {
        console.warn("Firebase not initialized");
        return { showFeaturedEvent: true }; // Default to showing
      }

      const settingsRef = doc(db, SETTINGS_DOC);
      const settingsDoc = await getDoc(settingsRef);

      if (settingsDoc.exists()) {
        return settingsDoc.data() as HomepageSettings;
      }

      // Return default settings if document doesn't exist
      return { showFeaturedEvent: true };
    } catch (error) {
      console.error("Error fetching homepage settings:", error);
      return { showFeaturedEvent: true }; // Default to showing on error
    }
  }

  // Update homepage settings (admin only)
  static async updateHomepageSettings(settings: Partial<HomepageSettings>): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      const token = await user.getIdToken();
      const response = await fetch("/api/settings/homepage", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update settings");
      }
    } catch (error) {
      console.error("Error updating homepage settings:", error);
      throw error;
    }
  }
}
