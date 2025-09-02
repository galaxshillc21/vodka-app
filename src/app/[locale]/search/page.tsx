import SearchClient from "@/components/SearchClient";

export async function generateMetadata({ params }) {
  const messages = (await import(`@/../messages/${params.locale}.json`)).default;
  const title = messages.SearchPage?.pageTitle || "Find Blat Vodka Stores";
  const description = messages.SearchPage?.pageDescription || "Search for Blat Vodka retailers near you by location or zip code.";

  return {
    title,
    description,
  };
}

export default function SearchPage() {
  return <SearchClient />;
}
