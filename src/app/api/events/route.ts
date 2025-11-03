import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";

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
async function verifyAdmin(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new Error("No token provided");
    }

    const decodedToken = await auth.verifyIdToken(token);

    // Check if user has admin role
    const userDoc = await db.collection("users").doc(decodedToken.uid).get();
    const userData = userDoc.data();

    if (!userData?.isAdmin) {
      throw new Error("User is not an admin");
    }

    return { success: true, user: decodedToken };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Authentication failed" };
  }
}

// Validate event data
function validateEventData(data: Record<string, unknown>) {
  const errors: string[] = [];

  if (!data.name || typeof data.name !== "string" || data.name.trim().length === 0) {
    errors.push("Name is required and must be a non-empty string");
  }

  if (!data.description || typeof data.description !== "string") {
    errors.push("Description is required and must be a string");
  }

  if (!data.date || !Date.parse(data.date as string)) {
    errors.push("Valid date is required");
  }

  if (!data.location || typeof data.location !== "object") {
    errors.push("Location is required and must be an object");
  }

  // Sanitize data
  const sanitizedData = {
    name: data.name?.toString().trim(),
    description: data.description?.toString().trim(),
    date: new Date(data.date as string).toISOString(),
    location: data.location,
    website: data.website?.toString().trim() || "",
    featured: Boolean(data.featured),
    images: data.images || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return { errors, sanitizedData };
}

// GET /api/events - Fetch all events
export async function GET() {
  try {
    const eventsCollection = db.collection("events");
    const querySnapshot = await eventsCollection.orderBy("date", "desc").get();

    const events = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      success: true,
      events,
      count: events.length,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch events" }, { status: 500 });
  }
}

// POST /api/events - Create new event
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return NextResponse.json({ success: false, error: authResult.error }, { status: 401 });
    }

    // Parse and validate request body
    const eventData = await request.json();
    const { errors, sanitizedData } = validateEventData(eventData);

    if (errors.length > 0) {
      return NextResponse.json({ success: false, error: "Validation failed", details: errors }, { status: 400 });
    }

    // Add creator information
    const finalEventData = {
      ...sanitizedData,
      createdBy: authResult.user?.uid,
      createdByEmail: authResult.user?.email,
    };

    // Create event in Firestore
    const docRef = await db.collection("events").add(finalEventData);

    console.log(`Event created: ${docRef.id} by ${authResult.user?.email}`);

    return NextResponse.json({
      success: true,
      id: docRef.id,
      message: "Event created successfully",
    });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ success: false, error: "Failed to create event" }, { status: 500 });
  }
}
