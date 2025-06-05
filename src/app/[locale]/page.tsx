import { getTranslations } from "next-intl/server";
import { Hero3 } from "@/src/components/Hero";
import BottleShow from "@/src/components/BottleShow";
import PuritySection from "@/src/components/PuritySection";
import { About2 } from "@/src/components/About";
import Agua from "@/src/components/Agua";
import { Ciencia } from "@/src/components/Ciencia";
import { Qualities } from "@/src/components/Qualities";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("Index");

  return (
    <>
      <Hero3 />
      <Qualities />
      <BottleShow />
      <PuritySection />
      <About2 />
      <Ciencia />
      <Agua />
      <section className="py-20 bg-gray-100 text-center">
        <h2 className="text-4xl font-bold mb-4">Contact</h2>
        <p className="max-w-2xl mx-auto text-lg">Want to reach out? .</p>
      </section>
    </>
  );
}
