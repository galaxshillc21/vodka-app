// app/[locale]/layout.tsx
import type { Metadata } from "next";
import { Fraunces, Poppins } from "next/font/google";
import "../globals.css"; // Adjust path as needed
import NavBottom from "@/components/ui/navBottom";
import Header from "@/components/ui/Header";
import { notFound } from "next/navigation";
import { getMessages, setRequestLocale } from "next-intl/server"; // Changed unstable_setRequestLocale to setRequestLocale [1]
import { NextIntlClientProvider } from "next-intl";
import { locales } from "@/i18n/routing"; // Import locales from the new routing file
import dynamic from "next/dynamic";
import { GoogleTagManager } from "@next/third-parties/google";
import GTMTracker from "@/lib/gtm-spa-tracking";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import Script from "next/script";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"], // Added more weights for flexibility
});
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Define metadata for your root layout (can be locale-specific)
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params; // 👈 Esto es lo que Next.js espera internamente aquí
  const messages = (await import(`@/../messages/${locale}.json`)).default;

  return {
    title: messages.Index.title,
    description: messages.Index.description,
    manifest: "/manifest.webmanifest",
  };
}

// Add generateStaticParams to prerender all locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

// Lazy load the age verification modal
const AgeVerificationModal = dynamic(() => import("@/components/AgeVerificationModal"), {
  loading: () => null, // No loading state needed
});

// Footer is always below the fold
const Footer = dynamic(() => import("@/components/ui/Footer"), {
  loading: () => null,
});

export default async function RootLayout({ children, params: { locale } }: Readonly<Props>) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as (typeof locales)[number])) notFound();

  setRequestLocale(locale); // Corrected API call [1]

  const messages = await getMessages();
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID; // Ensure this is set in your .env file
  const appEnv = process.env.NEXT_PUBLIC_APP_ENV;

  return (
    <html className="custom-scroll" lang={locale}>
      <body className={`${fraunces.variable} ${poppins.variable} antialiased lang-${locale}`} suppressHydrationWarning>
        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({app_env: "${appEnv}"});
            `,
          }}
        />
        <GoogleTagManager gtmId={gtmId} />
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main>{children}</main>
          <NavBottom />
          <Footer />

          {/* Age Verification Modal - no props needed */}
          <AgeVerificationModal />
          <GTMTracker />
          <CookieConsentBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
