import { auth } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Setup utility to create admin user in Firestore
 * Run this once after signing in with your admin account
 */
export async function setupAdminUser() {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user is currently signed in");
    }

    const userDocRef = doc(db, "users", user.uid);

    // Check if user document already exists
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      console.log("User document already exists:", userDoc.data());
      return userDoc.data();
    }

    // Create new user document with admin privileges
    const userData = {
      uid: user.uid,
      email: user.email,
      isAdmin: true,
      role: "admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(userDocRef, userData);
    console.log("Admin user created successfully:", userData);

    return userData;
  } catch (error) {
    console.error("Error setting up admin user:", error);
    throw error;
  }
}

/**
 * Check if current user is admin
 */
export async function checkAdminStatus(): Promise<{
  isAdmin: boolean;
  message: string;
  userData?: Record<string, unknown>;
  error?: unknown;
}> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { isAdmin: false, message: "No user signed in" };
    }

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return { isAdmin: false, message: "User document not found" };
    }

    const userData = userDoc.data();
    return {
      isAdmin: userData.isAdmin === true,
      message: userData.isAdmin ? "User is admin" : "User is not admin",
      userData,
    };
  } catch (error) {
    console.error("Error checking admin status:", error);
    return { isAdmin: false, message: "Error checking admin status", error };
  }
}
