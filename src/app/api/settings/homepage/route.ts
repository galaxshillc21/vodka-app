import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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
    console.error("Firebase private key not configured");
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

  const userDoc = await db.collection("users").doc(decodedToken.uid).get();
  const userData = userDoc.data();

  if (!userData?.isAdmin) {
    throw new Error("Insufficient permissions");
  }

  return decodedToken;
}

// GET homepage settings
export async function GET() {
  try {
    const settingsDoc = await db.collection("settings").doc("homepage").get();

    if (!settingsDoc.exists) {
      return NextResponse.json({
        showFeaturedEvent: true,
      });
    }

    return NextResponse.json(settingsDoc.data());
  } catch (error) {
    console.error("Error fetching homepage settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// PUT update homepage settings (admin only)
export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    const decodedToken = await verifyAdminToken(request.headers.get("authorization"));

    const body = await request.json();
    const { showFeaturedEvent } = body;

    if (typeof showFeaturedEvent !== "boolean") {
      return NextResponse.json({ error: "showFeaturedEvent must be a boolean" }, { status: 400 });
    }

    const updateData = {
      showFeaturedEvent,
      updatedAt: new Date().toISOString(),
      updatedBy: decodedToken.uid,
      updatedByEmail: decodedToken.email,
    };

    await db.collection("settings").doc("homepage").set(updateData, { merge: true });

    // Revalidate homepage
    revalidatePath("/[locale]", "page");
    revalidatePath("/en");
    revalidatePath("/es");

    return NextResponse.json({
      message: "Settings updated successfully",
      ...updateData,
    });
  } catch (error) {
    console.error("Error updating homepage settings:", error);

    if (error instanceof Error && error.message.includes("permissions")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
