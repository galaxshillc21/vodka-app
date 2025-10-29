import CocktailGenerator from "@/components/CocktailGenerator";

export default function CocktailsPage() {
  return (
    <div className="min-h-screen w-full from-amber-50 to-white flex flex-row items-stretch bg-[url('/images/blat_citrus.webp')] lg:bg-gradient-to-br bg-cover bg-center">
      <div className="basis-2/5 min-h-screen bg-[url('/images/blat_citrus.webp')] bg-cover bg-center hidden lg:block"></div>
      <div className="basis-1/1 lg:basis-3/5 pt-[80px] w-full flex flex-col items-center justify-center p-4 lg:p-8">
        <CocktailGenerator />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const messages = (await import(`@/../messages/${locale}.json`)).default;
  const title = messages.CocktailsPage?.pageTitle || "Blat Vodka Cocktail Generator";
  const description = messages.CocktailsPage?.pageDescription || "Discover and create cocktails with Blat Vodka using AI-powered recipes.";

  const baseUrl = "https://blatvodka.com";

  return {
    title,
    description,
    alternates: {
      languages: {
        en: `${baseUrl}/en/cocktails`,
        es: `${baseUrl}/es/cocktails`,
        "x-default": `${baseUrl}/en/cocktails`,
      },
      canonical: `${baseUrl}/${locale}/cocktails`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/cocktails`,
      siteName: "Blat Vodka",
      locale: locale,
      type: "website",
    },
  };
}
