import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";

// Server-side coordinate extraction
async function extractCoordinatesFromGoogleMapsLink(link: string): Promise<{ latitude: number; longitude: number } | null> {
  try {
    let urlToProcess = link;

    if (link.includes("goo.gl") || link.includes("maps.app.goo.gl")) {
      try {
        const response = await fetch(link, { redirect: "follow" });
        urlToProcess = response.url;
      } catch (error) {
        console.log("Could not resolve shortened URL:", error);
      }
    }

    const coordRegex = /@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const match = urlToProcess.match(coordRegex);

    if (match) {
      return { latitude: parseFloat(match[1]), longitude: parseFloat(match[2]) };
    }

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

// Verify admin authentication
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

// GET single store
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const storeDoc = await db.collection("stores").doc(id).get();

    if (!storeDoc.exists) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    return NextResponse.json({ id: storeDoc.id, ...storeDoc.data() });
  } catch (error) {
    console.error("Error fetching store:", error);
    return NextResponse.json({ error: "Failed to fetch store" }, { status: 500 });
  }
}

// PUT - Update store
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await verifyAdminToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const storeData = await request.json();

    // If googleMapsUrl is provided, extract coordinates
    const updateData = { ...storeData, updatedAt: new Date().toISOString() };

    if (storeData.googleMapsUrl) {
      const coordinates = await extractCoordinatesFromGoogleMapsLink(storeData.googleMapsUrl);
      if (coordinates) {
        updateData.latitude = coordinates.latitude;
        updateData.longitude = coordinates.longitude;
      }
    }

    await db.collection("stores").doc(id).update(updateData);

    return NextResponse.json({ id, ...updateData });
  } catch (error) {
    console.error("Error updating store:", error);
    return NextResponse.json({ error: "Failed to update store" }, { status: 500 });
  }
}

// DELETE - Delete store
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await verifyAdminToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await db.collection("stores").doc(id).delete();

    return NextResponse.json({ message: "Store deleted successfully" });
  } catch (error) {
    console.error("Error deleting store:", error);
    return NextResponse.json({ error: "Failed to delete store" }, { status: 500 });
  }
}
