import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Panel de Administración - Blat Vodka",
    description: "Panel de administración para la gestión del sitio web de Blat Vodka",
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default function AdminLayout({ children }: Props) {
  return <AuthProvider>{children}</AuthProvider>;
}
