import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Autenticación - Blat Vodka Admin",
    description: "Página de autenticación para administradores",
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

export default function AuthLayout({ children }: Readonly<Props>) {
  return <>{children}</>;
}
