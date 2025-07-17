// app/[locale]/layout.tsx
import type { Metadata } from "next";
import { Fraunces, Poppins } from "next/font/google";
import "../globals.css"; // Adjust path as needed
import NavBottom from "@/src/components/ui/navBottom";
import Header from "@/src/components/ui/Header";
import Footer from "@/src/components/ui/Footer";
import { notFound } from "next/navigation";
import { getMessages, setRequestLocale } from "next-intl/server"; // Changed unstable_setRequestLocale to setRequestLocale [1]
import { NextIntlClientProvider } from "next-intl";
import { locales } from "@/src/i18n/routing"; // Import locales from the new routing file

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
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
