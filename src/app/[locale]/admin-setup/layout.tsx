import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Setup Admin - Blat Vodka",
    description: "Configuración de administrador para Blat Vodka",
    robots: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
      googleBot: {
        index: false,
        follow: false,
        noarchive: true,
        nosnippet: true,
      },
    },
  };
}

type Props = {
  children: React.ReactNode;
};

export default function AdminSetupLayout({ children }: Readonly<Props>) {
  return <>{children}</>;
}
