import { NextRequest, NextResponse } from "next/server";
import * as admin from "firebase-admin";
import storesData from "@/data/stores.json";
import distributorsData from "@/data/distributors.json";

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();

// Verify admin token
async function verifyAdminToken(token: string) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userDoc = await db.collection("users").doc(decodedToken.uid).get();
    const userData = userDoc.data();
    return userData?.isAdmin === true;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const isAdmin = await verifyAdminToken(token);

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const batch = db.batch();
    let storesCount = 0;
    let distributorsCount = 0;

    // Migrate stores
    for (const store of storesData) {
      const storeRef = db.collection("stores").doc(String(store.id));
      batch.set(storeRef, {
        name: store.name,
        address: store.address,
        latitude: store.latitude,
        longitude: store.longitude,
        phone: store.phone,
        hours: store.hours,
        storeType: store.storeType,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      storesCount++;
    }

    // Migrate distributors
    for (const distributor of distributorsData) {
      const distributorRef = db.collection("distributors").doc(String(distributor.id));
      batch.set(distributorRef, {
        name: distributor.name,
        address: distributor.address,
        latitude: distributor.latitude,
        longitude: distributor.longitude,
        phone: distributor.phone,
        hours: distributor.hours,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      distributorsCount++;
    }

    await batch.commit();

    return NextResponse.json({
      success: true,
      message: "Migration completed successfully",
      storesCount,
      distributorsCount,
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json({ error: "Migration failed", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
