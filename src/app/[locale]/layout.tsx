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

// const montserrat = Montserrat({
//   variable: "--font-montserrat",
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
// });
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
  const messages = (await import(`@/messages/${locale}.json`)).default;

  return {
    title: messages.Index.title,
    description: messages.Index.description,
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

// Footer is always below the fold
const Footer = dynamic(() => import("@/components/ui/Footer"), {
  loading: () => (
    <footer className="bg-gray-900 py-12">
      <div className="container mx-auto px-4 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="h-6 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  ),
});

export default async function RootLayout({ children, params: { locale } }: Readonly<Props>) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as (typeof locales)[number])) notFound();

  setRequestLocale(locale); // Corrected API call [1]

  const messages = await getMessages();

  return (
    <html className="custom-scroll" lang={locale}>
      <body className={`${fraunces.variable} ${poppins.variable} antialiased lang-${locale}`}>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="">{children}</main>
          <NavBottom />
          {/* Footer is always below the fold */}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
