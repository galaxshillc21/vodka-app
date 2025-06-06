"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl"; // Import useTranslations
import { Button } from "@/src/components/ui/button";
import BlurText from "@/src/components/BlurText";

export function Hero() {
	// const t = useTranslations("Index");
	const ref = useRef(null);
	const { scrollY } = useScroll();
	const y = useTransform(scrollY, [0, 600], [0, -100]);

	return (
		<section
			id="Hero"
			className="bg-gray-100 w-full min-h-screen flex flex-col items-center justify-center"
		>
			<div className="container mx-auto px-4">
				<div className="fixed z-20 left-20 top-10">
					<Image
						src="/images/blat_bottle.png"
						alt="Blat Bottle"
						width={350}
						height={900}
						priority
						className="drop-shadow-sm nav-logo logo"
					/>
				</div>
				<div ref={ref} className="h-[600px] rounded-3xl relative overflow-hidden">
					<motion.div
						style={{ y }}
						className="absolute inset-0 bg-cover bg-center bg-[url('/images/blatvodka-barrels.webp')]"
					/>
					<div className="absolute inset-0 bg-black/60 z-10" />
					<div className="relative z-20 justify-center flex items-end h-full w-full flex-col px-12">
						<Image
							src="/images/blat_vodka_logo_bronze.png"
							alt="Blat Logo Bronze"
							width={300}
							height={300}
							priority
							className="drop-shadow-sm nav-logo logo"
						/>
						<h1 className="text-6xl font-bold mt-6 text-white"></h1>
					</div>
				</div>
			</div>
		</section>
	);
}

export function Hero2() {
	const t = useTranslations("Index");
	return (
		<section className="bg-gray-100 w-full min-h-screen flex flex-col items-center justify-center">
			<div className="container mx-auto px-4">
				<div className="flex flex-row justify-start items-center gap-4">
					<Image
						src="/images/blat_bottle.png"
						alt="Blat Bottle"
						width={350}
						height={900}
						priority
						className="drop-shadow-sm"
					/>
					<Image
						src="/images/blat-cropped.webp"
						alt="Blat Cap"
						width={200}
						height={794}
						className=""
					/>
					<h1>{t("description")}</h1>
				</div>
			</div>
		</section>
	);
}

export function Hero3() {
	const t = useTranslations("Index");
	const handleAnimationComplete = () => {
		console.log("Animation completed!");
	};
	return (
		<section
			id="Hero"
			className="min-h-screen bg-contain bg-no-repeat bg-left flex flex-col items-center justify-center relative"
		>
			<div className="container mx-auto px-4">
				<div className="flex flex-col-reverse lg:flex-row justify-between items-center gap-8 lg:gap-12">
					{/* Image goes last on mobile, side-by-side on desktop */}
					<div className="imageWrapper overflow-hidden w-full flex justify-center lg:justify-end">
						<Image
							src="/images/blat-hero-foam.webp"
							alt="Blat Logo Bronze"
							width={600}
							height={600}
							priority
							className="rounded-3xl w-full max-w-[350px] sm:max-w-[500px] lg:max-w-none"
						/>
					</div>

					{/* Text content */}
					<div className="flex flex-col items-center lg:items-start sm:justify-start justify-center text-center lg:text-left w-full">
						<BlurText
							text={t("description")}
							delay={80}
							animateBy="words"
							direction="top"
							onAnimationComplete={handleAnimationComplete}
							className="font-heading justify-center lg:justify-start text-4xl  md:text-5xl lg:text-7xl font-bold mt-6 text-amber-600 mb-6 leading-tight"
						/>
						{/* <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mt-6 text-amber-600 mb-6 leading-tight">{t("description")}</h1> */}
						<Button
							size="lg"
							className="rounded-full h-12 px-12 bg-amber-600 text-white text-lg sm:text-xl hover:bg-amber-700 transition-colors "
						>
							{t("heroButton")}
							<div></div>
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
