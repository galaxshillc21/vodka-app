import SearchClient from "@/components/SearchClient";
import stores from "@/data/stores.json";
import distributors from "@/data/distributors.json";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = (await import(`@/../messages/${locale}.json`)).default;
  const title = messages.SearchPage?.pageTitle || "Find Blat Vodka Distributors";
  const description = messages.SearchPage?.pageDescription || "Search for Blat Vodka distributors near you by location or zip code.";

  return {
    title,
    description,
  };
}

export default function SearchPage() {
  // Load data server-side for faster initial rendering
  return <SearchClient initialStores={stores} initialDistributors={distributors} />;
}
