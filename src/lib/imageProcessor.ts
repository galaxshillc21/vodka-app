/**
 * Client-side image processing utility
 * Resizes images to max 800px width and converts to WebP
 */

export interface ProcessedImage {
  file: File;
  url: string;
}

export class ImageProcessor {
  /**
   * Process a single image file
   */
  static async processImage(file: File): Promise<ProcessedImage> {
    return new Promise((resolve, reject) => {
      // Create a canvas element
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      img.onload = () => {
        try {
          // Calculate new dimensions (max width 800px, maintain aspect ratio)
          const maxWidth = 800;
          let { width, height } = img;

          if (width > maxWidth) {
            const aspectRatio = height / width;
            width = maxWidth;
            height = width * aspectRatio;
          }

          // Set canvas dimensions
          canvas.width = width;
          canvas.height = height;

          // Draw the image on canvas with new dimensions
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to WebP blob
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Failed to convert image to WebP"));
                return;
              }

              // Create a new File object with WebP format
              const webpFileName = file.name.replace(/\.[^/.]+$/, ".webp");
              const webpFile = new File([blob], webpFileName, {
                type: "image/webp",
                lastModified: Date.now(),
              });

              const url = URL.createObjectURL(webpFile);

              resolve({
                file: webpFile,
                url: url,
              });
            },
            "image/webp",
            0.8 // 80% quality
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      // Load the image
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Process multiple image files
   */
  static async processImages(files: File[]): Promise<ProcessedImage[]> {
    const processPromises = files.map((file) => this.processImage(file));
    return Promise.all(processPromises);
  }

  /**
   * Check if the browser supports WebP
   */
  static supportsWebP(): Promise<boolean> {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    });
  }

  /**
   * Clean up object URLs to prevent memory leaks
   */
  static cleanupUrl(url: string): void {
    if (url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  }
}
