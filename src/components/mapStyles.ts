// Map style configurations
const MAPTILER_KEY = "1vVunb6izrFWlkamr2Is";

export const mapStyles = {
  // Current style (streets with detailed styling)
  streets: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`,

  // Google Maps-like styles (RECOMMENDED)
  basic: `https://api.maptiler.com/maps/basic-v2/style.json?key=${MAPTILER_KEY}`, // Clean, minimal like Google Maps
  bright: `https://api.maptiler.com/maps/bright-v2/style.json?key=${MAPTILER_KEY}`, // Colorful like Google Maps
  outdoor: `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${MAPTILER_KEY}`, // With terrain like Google Maps
  streetsv4: `https://api.maptiler.com/maps/streets-v4/style.json?key=${MAPTILER_KEY}`, // With terrain like Google Maps

  // Other popular styles
  satellite: `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_KEY}`,
  hybrid: `https://api.maptiler.com/maps/hybrid/style.json?key=${MAPTILER_KEY}`, // Satellite with labels
  topo: `https://api.maptiler.com/maps/topo-v2/style.json?key=${MAPTILER_KEY}`,
  winter: `https://api.maptiler.com/maps/winter-v2/style.json?key=${MAPTILER_KEY}`,

  // Minimal styles
  positron: `https://api.maptiler.com/maps/positron/style.json?key=${MAPTILER_KEY}`, // Light/white theme
  "dark-matter": `https://api.maptiler.com/maps/darkmatter/style.json?key=${MAPTILER_KEY}`, // Dark theme
};

// Default style - change this to switch the default map appearance
export const DEFAULT_MAP_STYLE = mapStyles.basic; // Most Google Maps-like
