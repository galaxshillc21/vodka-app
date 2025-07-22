// src/i18n/routing.ts
import { defineRouting } from "next-intl/routing";

export const locales = ["en", "es"] as const; // Your supported locales
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en"; // Your default locale

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always", // Always show locale in URL for better SEO and clarity
  // Optional: Add pathnames if you have localized URLs (e.g., for SEO)
  // pathnames: {
  //   '/about': {
  //     en: '/about',
  //     es: '/acerca'
  //   }
  // }
});
