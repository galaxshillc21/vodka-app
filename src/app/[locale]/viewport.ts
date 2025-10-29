import type { Viewport } from "next";

export function generateViewport(): Viewport {
  return {
    themeColor: "#d97706",
    width: "device-width",
    initialScale: 1,
  };
}
