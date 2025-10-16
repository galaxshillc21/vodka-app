import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Panel de Administración - Blat Vodka",
    description: "Panel de administración para la gestión del sitio web de Blat Vodka",
  };
}

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export default function AdminLayout({ children }: Readonly<Props>) {
  return <AuthProvider>{children}</AuthProvider>;
}
