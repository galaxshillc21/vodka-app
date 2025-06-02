import { getTranslations } from "next-intl/server";
import { Hero, Hero2, Hero3 } from "@/src/components/Hero";
import BottleShow from "@/src/components/BottleShow";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("Index");

  return (
    <>
      <Hero3 />
      <section className="max-w-7xl mx-auto px-4 py-12 Qualities">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-2xl">
            <h2 className="text-4xl font-bold text-amber-500 mb-2">{t("qualities.quality1")}</h2>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">{t("qualities.sub1")}</h3>
            <p className="text-gray-600 text-sm">{t("qualities.desc1")}</p>
          </div>

          <div className="p-6 rounded-2xl ">
            <h2 className="text-4xl font-bold text-amber-500 mb-2">{t("qualities.quality2")}</h2>
            <h3 className="text-lg font-semibold text-gray-600 mb-3">{t("qualities.sub2")}</h3>
            <p className="text-gray-600 text-sm">{t("qualities.desc2")}</p>
          </div>

          <div className="p-6 rounded-2xl">
            <h2 className="text-4xl font-bold text-amber-500 mb-2">{t("qualities.quality3")}</h2>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">{t("qualities.sub3")}</h3>
            <p className="text-gray-600 text-sm">{t("qualities.desc3")}</p>
          </div>
        </div>
      </section>

      <section className="BottleShow relative">
        <BottleShow />
      </section>

      <section className="py-20 bg-gray-100 text-center">
        <h2 className="text-4xl font-bold mb-4">Our Products</h2>
        <p className="max-w-2xl mx-auto text-lg">Discover our range of premium vodka products.</p>
      </section>
      <section className="py-20 bg-white text-center">
        <h2 className="text-4xl font-bold mb-4">About Us</h2>
        <p className="max-w-2xl mx-auto text-lg">We’re passionate about vodka. Blat Vodka is distilled with the purest intentions and zero sugar.</p>
      </section>

      <section className="py-20 bg-gray-100 text-center">
        <h2 className="text-4xl font-bold mb-4">Contact</h2>
        <p className="max-w-2xl mx-auto text-lg">Want to reach out? .</p>
      </section>
    </>
  );
}
