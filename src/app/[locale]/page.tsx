import { getTranslations } from "next-intl/server";
import { Hero3 } from "@/src/components/Hero";
import BottleShow from "@/src/components/BottleShow";
import PuritySection from "@/src/components/PuritySection";
import About from "@/src/components/About";
import Agua from "@/src/components/Agua";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	const t = await getTranslations("Index");

	return (
		<>
			<Hero3 />
			<section className="container mx-auto px-4 py-12 Qualities">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
					<div className="p-6 rounded-2xl">
						<h2
							className="text-3xl font-bold text-amber-500 mb-2"
							dangerouslySetInnerHTML={{ __html: t("qualities.quality1") }}
						></h2>
						<h3 className="text-lg font-semibold text-gray-700 mb-3">{t("qualities.sub1")}</h3>
						<p className="text-gray-600 text-sm">{t("qualities.desc1")}</p>
					</div>

					<div className="p-6 rounded-2xl ">
						<h2
							className="text-3xl font-bold text-amber-500 mb-2"
							dangerouslySetInnerHTML={{ __html: t("qualities.quality2") }}
						></h2>
						<h3 className="text-lg font-semibold text-gray-600 mb-3">{t("qualities.sub2")}</h3>
						<p className="text-gray-600 text-sm">{t("qualities.desc2")}</p>
					</div>

					<div className="p-6 rounded-2xl">
						<h2
							className="text-3xl font-bold text-amber-500 mb-2"
							dangerouslySetInnerHTML={{ __html: t("qualities.quality3") }}
						></h2>
						<h3 className="text-lg font-semibold text-gray-700 mb-3">{t("qualities.sub3")}</h3>
						<p className="text-gray-600 text-sm">{t("qualities.desc3")}</p>
					</div>
				</div>
			</section>

			<BottleShow />

			<PuritySection />

			<About />
			<Agua />
			<section className="py-20 bg-gray-100 text-center">
				<h2 className="text-4xl font-bold mb-4">Contact</h2>
				<p className="max-w-2xl mx-auto text-lg">Want to reach out? .</p>
			</section>
		</>
	);
}
