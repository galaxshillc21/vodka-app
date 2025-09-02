import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Blat Vodka",
    short_name: "Blat",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#d97706",
    description: "The purest vodka in the world.",
    icons: [
      {
        src: "./icon1.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        src: "./apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/screenshot1.png",
        sizes: "422x855",
        type: "image/png",
        form_factor: "narrow",
      },
      {
        src: "/screenshots/screenshot2.png",
        sizes: "1475x938",
        type: "image/png",
        form_factor: "wide",
      },
    ],
  };
}
