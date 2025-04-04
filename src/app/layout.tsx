import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import LoadingScreen from "@/components/LoadingScreen";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Add more weights as needed
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Add more weights as needed
});

export const metadata: Metadata = {
  title: "Blat - Encuentra tu tienda más cercana",
  description: "Descubre las tiendas más cercanas donde puedes comprar Blat Vodka con nuestro localizador exclusivo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${poppins.variable} antialiased lang-es`}>
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}
