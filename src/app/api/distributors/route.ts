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

// GET all distributors
export async function GET() {
  try {
    const distributorsSnapshot = await db.collection("distributors").orderBy("name").get();
    const distributors = distributorsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(distributors);
  } catch (error) {
    console.error("Error fetching distributors:", error);
    return NextResponse.json({ error: "Failed to fetch distributors" }, { status: 500 });
  }
}

// POST - Create new distributor
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const userId = await verifyAdminToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const distributorData = await request.json();

    // Validate required fields
    if (!distributorData.name || !distributorData.address || !distributorData.googleMapsUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Extract coordinates from Google Maps URL
    const coordinates = await extractCoordinatesFromGoogleMapsLink(distributorData.googleMapsUrl);
    if (!coordinates) {
      return NextResponse.json({ error: "Could not extract coordinates from Google Maps URL" }, { status: 400 });
    }

    // Create distributor document with extracted coordinates
    const docRef = await db.collection("distributors").add({
      ...distributorData,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const newDistributor = {
      id: docRef.id,
      ...distributorData,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    };

    return NextResponse.json(newDistributor, { status: 201 });
  } catch (error) {
    console.error("Error creating distributor:", error);
    return NextResponse.json({ error: "Failed to create distributor" }, { status: 500 });
  }
}
