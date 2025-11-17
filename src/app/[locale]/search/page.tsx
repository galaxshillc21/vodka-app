import SearchClient from "@/components/SearchClient";

async function getStores() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/stores`, {
      cache: "no-store", // Always get fresh data
    });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Error fetching stores:", error);
    return [];
  }
}

async function getDistributors() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/distributors`, {
      cache: "no-store", // Always get fresh data
    });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Error fetching distributors:", error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = (await import(`@/../messages/${locale}.json`)).default;
  const title = messages.SearchPage?.pageTitle || "Find Blat Vodka Distributors";
  const description = messages.SearchPage?.pageDescription || "Search for Blat Vodka distributors near you by location or zip code.";

  const baseUrl = "https://blatvodka.com";

  return {
    title,
    description,
    alternates: {
      languages: {
        en: `${baseUrl}/en/search`,
        es: `${baseUrl}/es/search`,
        "x-default": `${baseUrl}/en/search`,
      },
      canonical: `${baseUrl}/${locale}/search`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/search`,
      siteName: "Blat Vodka",
      locale: locale,
      type: "website",
    },
  };
}

export default async function SearchPage() {
  // Load data server-side for faster initial rendering
  const [stores, distributors] = await Promise.all([getStores(), getDistributors()]);

  return <SearchClient initialStores={stores} initialDistributors={distributors} />;
}
