// Helper function to extract coordinates from Google Maps link
export async function extractCoordinatesFromGoogleMapsLink(link: string): Promise<{ latitude: number; longitude: number } | null> {
  try {
    let urlToProcess = link;

    // Check if it's a shortened Google Maps URL
    if (link.includes("goo.gl") || link.includes("maps.app.goo.gl")) {
      try {
        // Use our API route to resolve the shortened URL
        const response = await fetch(`/api/resolve-url?url=${encodeURIComponent(link)}`);
        const data = await response.json();
        if (data.resolvedUrl) {
          urlToProcess = data.resolvedUrl;
        }
      } catch (error) {
        console.log("Could not resolve shortened URL:", error);
      }
    }

    // Handle different Google Maps URL formats
    // Format 1: Direct coordinates in URL with @ symbol
    const coordRegex = /@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const match = urlToProcess.match(coordRegex);

    if (match) {
      const latitude = parseFloat(match[1]);
      const longitude = parseFloat(match[2]);
      return { latitude, longitude };
    }

    // Format 2: Coordinates in query parameter
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

    console.error("Could not extract coordinates from URL:", link);
    return null;
  } catch (error) {
    console.error("Error extracting coordinates:", error);
    return null;
  }
}
