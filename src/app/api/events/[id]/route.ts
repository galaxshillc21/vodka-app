import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";

// Initialize Firebase Admin SDK
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

// Verify admin token
async function verifyAdminToken(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No valid authorization header");
  }

  const token = authHeader.substring(7);
  const decodedToken = await auth.verifyIdToken(token);

  // Check if user has admin role (implement your admin check logic)
  const userDoc = await db.collection("users").doc(decodedToken.uid).get();
  const userData = userDoc.data();

  if (!userData?.isAdmin) {
    throw new Error("Insufficient permissions");
  }

  return decodedToken;
}

// GET single event
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const eventDoc = await db.collection("events").doc(id).get();

    if (!eventDoc.exists) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: eventDoc.id,
      ...eventDoc.data(),
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}

// PUT update event (admin only)
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Verify admin authentication
    await verifyAdminToken(request.headers.get("authorization"));

    const { id } = await context.params;
    const body = await request.json();

    console.log("PUT /api/events/[id] - Received data:", JSON.stringify(body, null, 2));

    // For updates, we allow partial data - only validate if fields are provided
    const updateData: Record<string, unknown> = {};

    // Copy provided fields to updateData
    Object.keys(body).forEach((key) => {
      if (body[key] !== undefined) {
        updateData[key] = body[key];
      }
    });

    // Add timestamp
    updateData.updatedAt = new Date().toISOString();

    // Update event
    const eventRef = db.collection("events").doc(id);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    await eventRef.update(updateData);

    return NextResponse.json({
      id,
      message: "Event updated successfully",
    });
  } catch (error) {
    console.error("Error updating event:", error);

    if (error instanceof Error && error.message.includes("permissions")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

// DELETE event (admin only)
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Verify admin authentication
    await verifyAdminToken(request.headers.get("authorization"));

    const { id } = await context.params;
    const eventRef = db.collection("events").doc(id);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    await eventRef.delete();

    return NextResponse.json({
      message: "Event deleted successfully",
      id,
    });
  } catch (error) {
    console.error("Error deleting event:", error);

    if (error instanceof Error && error.message.includes("permissions")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
