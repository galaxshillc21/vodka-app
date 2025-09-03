import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest } from "next/server";

// === Locale config toggle ===
export const useGeo = false; // Change to true to enable country-based locale detection
export const defaultLocale = "es"; // Default locale if useGeo is false

// Country to locale mapping
const countryToLocale: Record<string, string> = {
  // Spanish-speaking countries
  ES: "es", // Spain
  MX: "es", // Mexico
  AR: "es", // Argentina
  CO: "es", // Colombia
  PE: "es", // Peru
  VE: "es", // Venezuela
  CL: "es", // Chile
  EC: "es", // Ecuador
  GT: "es", // Guatemala
  CU: "es", // Cuba
  BO: "es", // Bolivia
  DO: "es", // Dominican Republic
  HN: "es", // Honduras
  PY: "es", // Paraguay
  SV: "es", // El Salvador
  NI: "es", // Nicaragua
  CR: "es", // Costa Rica
  PA: "es", // Panama
  UY: "es", // Uruguay
  GQ: "es", // Equatorial Guinea

  // English-speaking countries
  US: "en", // United States
  GB: "en", // United Kingdom
  CA: "en", // Canada
  AU: "en", // Australia
  NZ: "en", // New Zealand
  IE: "en", // Ireland
  ZA: "en", // South Africa
  SG: "en", // Singapore
  IN: "en", // India
  PK: "en", // Pakistan
  NG: "en", // Nigeria
  KE: "en", // Kenya
  GH: "en", // Ghana
  UG: "en", // Uganda
  TZ: "en", // Tanzania
  ZW: "en", // Zimbabwe
  BW: "en", // Botswana
  MW: "en", // Malawi
  ZM: "en", // Zambia
  LR: "en", // Liberia
  SL: "en", // Sierra Leone
  JM: "en", // Jamaica
  BB: "en", // Barbados
  BZ: "en", // Belize
  GY: "en", // Guyana
  TT: "en", // Trinidad and Tobago
  BS: "en", // Bahamas
  AG: "en", // Antigua and Barbuda
  DM: "en", // Dominica
  GD: "en", // Grenada
  KN: "en", // Saint Kitts and Nevis
  LC: "en", // Saint Lucia
  VC: "en", // Saint Vincent and the Grenadines
  MT: "en", // Malta
  CY: "en", // Cyprus
  FJ: "en", // Fiji
  PG: "en", // Papua New Guinea
  VU: "en", // Vanuatu
  WS: "en", // Samoa
  TO: "en", // Tonga
  KI: "en", // Kiribati
  TV: "en", // Tuvalu
  NR: "en", // Nauru
  PW: "en", // Palau
  MH: "en", // Marshall Islands
  FM: "en", // Micronesia
  // Add more countries as needed
};

function getLocaleFromCountry(request: NextRequest): string {
  // Try Vercel's country header (free)
  const country =
    request.headers.get("x-vercel-ip-country") ||
    // Fallback to Cloudflare's header (if using Cloudflare)
    request.headers.get("cf-ipcountry") ||
    // Fallback to custom header
    request.headers.get("x-country-code");

  if (country) {
    const locale = countryToLocale[country.toUpperCase()];
    if (locale) {
      return locale;
    }
  }

  // Default to English if no country match
  return "en";
}

// Custom middleware that adds country-based locale detection
const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hasLocale = routing.locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);

  // If no locale in URL, detect from config
  if (!hasLocale && pathname !== "/") {
    let detectedLocale = defaultLocale;
    if (useGeo) {
      detectedLocale = getLocaleFromCountry(request);
    }
    const url = request.nextUrl.clone();
    url.pathname = `/${detectedLocale}${pathname}`;
    return Response.redirect(url);
  }

  // If root path, redirect to locale root
  if (pathname === "/") {
    let detectedLocale = defaultLocale;
    if (useGeo) {
      detectedLocale = getLocaleFromCountry(request);
    }
    const url = request.nextUrl.clone();
    url.pathname = `/${detectedLocale}`;
    return Response.redirect(url);
  }

  // Continue with next-intl middleware
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
