import SearchClient from "@/components/SearchClient";
import stores from "@/data/stores.json";
import distributors from "@/data/distributors.json";

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

export default function SearchPage() {
  // Load data server-side for faster initial rendering
  return <SearchClient initialStores={stores} initialDistributors={distributors} />;
}
