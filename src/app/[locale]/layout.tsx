// app/[locale]/layout.tsx
import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "../globals.css"; // Adjust path as needed
import NavBottom from "@/src/components/ui/navBottom";
import Header from "@/src/components/ui/header"; // Import Header component
import { notFound } from "next/navigation";
import { getMessages, setRequestLocale } from "next-intl/server"; // Changed unstable_setRequestLocale to setRequestLocale [1]
import { NextIntlClientProvider } from "next-intl";
import { locales } from "@/src/i18n/routing"; // Import locales from the new routing file

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Define metadata for your root layout (can be locale-specific)
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params; // Await params before destructuring locale [2]
  const messages = (await import(`@/messages/${locale}.json`)).default;
  return {
    title: messages.Index.title, // Access translated title
    description: messages.Index.description, // Access translated description
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
  if (!locales.includes(locale as any)) notFound();

  setRequestLocale(locale); // Corrected API call [1]

  const messages = await getMessages();

  return (
    <html className="h-full scroll-smooth" lang={locale}>
      <body className={`${montserrat.variable} ${poppins.variable} antialiased lang-${locale}`}>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="mt-[40px]">{children}</main>
          <NavBottom />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
