/**
 * Cloud Functions for Event Image Processing
 * Automatically processes uploaded images by resizing and converting to WebP
 */

import { setGlobalOptions } from "firebase-functions";
import { onObjectFinalized } from "firebase-functions/v2/storage";
import * as logger from "firebase-functions/logger";
import { Storage } from "@google-cloud/storage";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import sharp from "sharp";

// Initialize Firebase Admin
initializeApp();

const storage = new Storage();
const db = getFirestore();

// Set global options for cost control
setGlobalOptions({ maxInstances: 10 });

/**
 * Cloud Function that triggers when an image is uploaded to Storage
 * Processes images uploaded to /events/{eventId}/originals/{filename}
 */
export const processEventImage = onObjectFinalized(
  {
    region: "europe-west1", // Match your Storage bucket region
  },
  async (event) => {
    const fileBucket = event.data.bucket;
    const filePath = event.data.name;
    const contentType = event.data.contentType;

    logger.info(`Processing file: ${filePath}`, {
      bucket: fileBucket,
      contentType: contentType,
    });

    // Exit if this isn't an image
    if (!contentType || !contentType.startsWith("image/")) {
      logger.info("Not an image file, skipping processing");
      return;
    }

    // Exit if this isn't in the originals folder for events
    if (!filePath.includes("/events/") || !filePath.includes("/originals/")) {
      logger.info("Not in events/originals folder, skipping processing");
      return;
    }

    // Exit if this is already a processed image (avoid infinite loops)
    if (filePath.includes("/optimized/")) {
      logger.info("Already processed image, skipping");
      return;
    }

    const fileName = path.basename(filePath);
    const bucket = storage.bucket(fileBucket);
    const tempFilePath = path.join(os.tmpdir(), fileName);
    const metadata = {
      contentType: "image/webp",
      cacheControl: "public, max-age=31536000", // 1 year cache
    };

    try {
      // Parse the file path to extract eventId
      const pathParts = filePath.split("/");
      const eventIndex = pathParts.indexOf("events");
      if (eventIndex === -1 || eventIndex + 1 >= pathParts.length) {
        logger.error("Invalid file path structure");
        return;
      }
      const eventId = pathParts[eventIndex + 1];

      // Download the original image
      logger.info(`Downloading image to ${tempFilePath}`);
      await bucket.file(filePath).download({ destination: tempFilePath });

      // Process the image with Sharp
      const processedFileName = `${path.parse(fileName).name}.webp`;
      const processedFilePath = path.join(os.tmpdir(), processedFileName);

      logger.info("Processing image with Sharp");
      await sharp(tempFilePath)
        .resize(800, null, {
          withoutEnlargement: true, // Don't enlarge smaller images
          fit: "inside", // Keep aspect ratio
        })
        .webp({
          quality: 80,
          effort: 4, // Balance between compression and speed
        })
        .toFile(processedFilePath);

      // Upload the processed image
      const optimizedPath = filePath.replace("/originals/", "/optimized/").replace(path.extname(fileName), ".webp");

      logger.info(`Uploading processed image to ${optimizedPath}`);
      await bucket.upload(processedFilePath, {
        destination: optimizedPath,
        metadata: metadata,
      });

      // Get the download URL for the optimized image
      const optimizedFile = bucket.file(optimizedPath);
      await optimizedFile.makePublic();
      const optimizedUrl = `https://storage.googleapis.com/${fileBucket}/${optimizedPath}`;

      // Update the event document in Firestore
      logger.info(`Updating event ${eventId} with optimized image URL`);
      const eventRef = db.collection("events").doc(eventId);
      const eventDoc = await eventRef.get();

      if (eventDoc.exists) {
        const eventData = eventDoc.data();
        const currentImages = eventData?.images || [];

        // Find and replace the original URL with the optimized URL
        const originalUrl = `https://storage.googleapis.com/${fileBucket}/${filePath}`;
        const updatedImages = currentImages.map((url: string) => (url === originalUrl ? optimizedUrl : url));

        // If the original URL wasn't found, add the optimized URL
        if (!currentImages.includes(originalUrl)) {
          updatedImages.push(optimizedUrl);
        }

        await eventRef.update({
          images: updatedImages,
          updatedAt: new Date().toISOString(),
        });

        logger.info("Event document updated successfully");
      } else {
        logger.warn(`Event document ${eventId} not found`);
      }

      // Delete the original file to save storage space
      logger.info("Deleting original file");
      await bucket.file(filePath).delete();

      // Clean up temporary files
      fs.unlinkSync(tempFilePath);
      fs.unlinkSync(processedFilePath);

      logger.info("Image processing completed successfully");
    } catch (error) {
      logger.error("Error processing image:", error);

      // Clean up temporary files in case of error
      try {
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
      } catch (cleanupError) {
        logger.error("Error cleaning up temp files:", cleanupError);
      }

      throw error;
    }
  }
);
