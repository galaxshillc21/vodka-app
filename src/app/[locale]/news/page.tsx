import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl"; // Import useTranslations

export default function News() {
  const t = useTranslations("NewsPage"); // Initialize translation function for "SearchPage" namespace
  const n = useTranslations("Navigation"); // Initialize translation function for "SearchPage" namespace

  return (
    <section className="p-4 pt-[200px] h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>
        <p className="mb-4">{t("description")}</p>
        <p className="mb-4">...</p>
        <Link href="/" className="text-primary underline">
          {n("backToHome")}
        </Link>
      </div>
    </section>
  );
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const messages = (await import(`@/../messages/${locale}.json`)).default;
  const title = messages.News?.pageTitle || "Blat Vodka News";
  const description = messages.News?.pageDescription || "Discover and Blat News.";

  const baseUrl = "https://blatvodka.com";

  return {
    title,
    description,
    alternates: {
      languages: {
        en: `${baseUrl}/en/news`,
        es: `${baseUrl}/es/news`,
        "x-default": `${baseUrl}/en/news`,
      },
      canonical: `${baseUrl}/${locale}/news`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/news`,
      siteName: "Blat Vodka",
      locale: locale,
      type: "website",
    },
  };
}
