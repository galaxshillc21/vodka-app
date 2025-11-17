import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";

// Server-side coordinate extraction
async function extractCoordinatesFromGoogleMapsLink(link: string): Promise<{ latitude: number; longitude: number } | null> {
  try {
    let urlToProcess = link;

    // Check if it's a shortened Google Maps URL - resolve it server-side
    if (link.includes("goo.gl") || link.includes("maps.app.goo.gl")) {
      try {
        const response = await fetch(link, { redirect: "follow" });
        urlToProcess = response.url;
      } catch (error) {
        console.log("Could not resolve shortened URL:", error);
      }
    }

    // Extract coordinates from URL
    const coordRegex = /@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const match = urlToProcess.match(coordRegex);

    if (match) {
      const latitude = parseFloat(match[1]);
      const longitude = parseFloat(match[2]);
      return { latitude, longitude };
    }

    // Try query parameter format
    try {
      const urlParams = new URL(urlToProcess);
      const query = urlParams.searchParams.get("query");
      if (query) {
        const coords = query.split(",");
        if (coords.length === 2) {
          const latitude = parseFloat(coords[0]);
          const longitude = parseFloat(coords[1]);
          if (!isNaN(latitude) && !isNaN(longitude)) {
            return { latitude, longitude };
          }
        }
      }
    } catch (e) {
      console.log("Error parsing URL params:", e);
    }

    return null;
  } catch (error) {
    console.error("Error extracting coordinates:", error);
    return null;
  }
}

// Initialize Firebase Admin (server-side)
if (!getApps().length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.error("Missing Firebase Admin SDK environment variables");
    throw new Error("Firebase Admin SDK not configured");
  }

  if (privateKey.includes("PLEASE_REPLACE")) {
    console.error("Firebase private key not configured. Please set FIREBASE_PRIVATE_KEY in .env.local");
    throw new Error("Firebase private key not configured");
  }

  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();
const auth = getAuth();

// Helper function to verify admin token
async function verifyAdminToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await auth.verifyIdToken(token);
    const userDoc = await db.collection("users").doc(decodedToken.uid).get();
    const userData = userDoc.data();

    if (userData?.isAdmin) {
      return decodedToken.uid;
    }
    return null;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

// GET all stores
export async function GET() {
  try {
    const storesSnapshot = await db.collection("stores").orderBy("name").get();
    const stores = storesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(stores);
  } catch (error) {
    console.error("Error fetching stores:", error);
    return NextResponse.json({ error: "Failed to fetch stores" }, { status: 500 });
  }
}

// POST - Create new store
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const userId = await verifyAdminToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const storeData = await request.json();

    // Validate required fields
    if (!storeData.name || !storeData.address || !storeData.googleMapsUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Extract coordinates from Google Maps URL
    const coordinates = await extractCoordinatesFromGoogleMapsLink(storeData.googleMapsUrl);
    if (!coordinates) {
      return NextResponse.json({ error: "Could not extract coordinates from Google Maps URL" }, { status: 400 });
    }

    // Create store document with extracted coordinates
    const docRef = await db.collection("stores").add({
      ...storeData,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const newStore = {
      id: docRef.id,
      ...storeData,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    };

    return NextResponse.json(newStore, { status: 201 });
  } catch (error) {
    console.error("Error creating store:", error);
    return NextResponse.json({ error: "Failed to create store" }, { status: 500 });
  }
}
