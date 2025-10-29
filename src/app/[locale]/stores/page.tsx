import { Link } from "@/i18n/navigation";
import stores from "../../../data/stores.json";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const messages = (await import(`@/../messages/${locale}.json`)).default;
  const title = messages.StoresPage?.pageTitle || "Blat Vodka Stores";
  const description = messages.StoresPage?.pageDescription || "Find Blat Vodka stores and retailers near you.";

  const baseUrl = "https://blatvodka.com";

  return {
    title,
    description,
    alternates: {
      languages: {
        en: `${baseUrl}/en/stores`,
        es: `${baseUrl}/es/stores`,
        "x-default": `${baseUrl}/en/stores`,
      },
      canonical: `${baseUrl}/${locale}/stores`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/stores`,
      siteName: "Blat Vodka",
      locale: locale,
      type: "website",
    },
  };
}

export default function Stores() {
  return (
    <div>
      <h1>Stores</h1>
      <Link href="/">Back to Home</Link>
      <ul>
        {stores.map((store) => (
          <li key={store.id} className="frosted-card mb-2">
            <strong>{store.name}</strong>
            <br />
            {store.address}
            <br />
            Phone: {store.phone}
            <br />
            Hours: {store.hours}
          </li>
        ))}
      </ul>
    </div>
  );
}
