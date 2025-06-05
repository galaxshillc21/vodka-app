// import { getTranslations } from "next-intl/server";
import { Hero3 } from "@/src/components/Hero";
import { BottleDesignParallax, BottleDesign } from "@/src/components/BottleDesignSection";
import PuritySection from "@/src/components/PuritySection";
import { About2 } from "@/src/components/About";
import Agua from "@/src/components/Agua";
import { Ciencia } from "@/src/components/Ciencia";
import { Qualities } from "@/src/components/Qualities";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	// const t = await getTranslations("Index");

	return (
		<>
			<Hero3 />
			<Qualities />
			<BottleDesignParallax />
			<PuritySection />
			<About2 />
			<Ciencia />
			<Agua />
			<BottleDesign />
		</>
	);
}
