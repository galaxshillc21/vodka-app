"use client";

import Image from "next/image";
import { useTranslations } from "next-intl"; // Import useTranslations
import BlurText from "@/src/components/BlurText";

export function BottleDesignParallax() {
	const t = useTranslations("BottleShow");
	const handleAnimationComplete = () => {
		console.log("Animation completed!");
	};
	return (
		<section className="BottleShow relative bg-gradient-to-b from-white from-40% to-gray-100 to-90%">
			<div className="relative h-[200vh]">
				{/* Sticky text container */}
				<div className="sticky mx-auto top-0 z-20 flex flex-col items-center justify-center h-screen max-w-4xl w-full text-center">
					<BlurText
						text={t("title")}
						delay={80}
						animateBy="words"
						direction="top"
						onAnimationComplete={handleAnimationComplete}
						className="text-4xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mt-6 text-amber-600 mb-6 leading-tight text-center justify-center"
					/>
				</div>
				{/* Bottle image coming from bottom */}
				<div className="absolute bottom-0 left-0 right-0 flex justify-center items-end h-full z-30">
					<Image
						src="/images/blatvodka-bottle-full.webp"
						alt="Blat Vodka Bottle"
						className="drop-shadow-lg"
						width={400}
						height={800}
						priority
					/>
				</div>
			</div>
		</section>
	);
}

export function BottleDesign() {
	return (
		<section className="BottleDesign min-h-screen relative bg-gradient-to-b from-white from-40% to-gray-100 to-90%">
			<div className="relative container mx-auto">
				<h2 className="text-4xl text-center font-bold text-amber-600">
					Diseño que Refleja la Pureza
				</h2>

				<div className="flex flex-row justify-center items-center text-center">
					<div className="relative flex-1 bottle-wrapper align-center flex  justify-center items-center">
						<Image
							src="/images/blatvodka-bottle-full.webp"
							alt="Blat Vodka Bottle"
							className="drop-shadow-lg rotate-[-10deg]"
							width={250}
							height={800}
							priority
						/>
					</div>
					<div className="content flex-1 text-left">
						<p className="text-lg mb-4 text-gray-700">
							La botella de Blat Vodka es un reflejo de su contenido:{" "}
							<span className="font-bold">limpia, cristalina y de una elegancia singular.</span>
						</p>
						<p className="text-lg mb-4 text-gray-700">
							Diseñada por el prestigioso <span className="font-semibold">Peter Schmidt Group</span>
							, cuyas obras son exhibidas incluso en el Museo Metropolitano de Arte Moderno de Nueva
							York, nuestra botella ha sido galardonada con{" "}
							<span className="font-bold">tres premios internacionales.</span>
						</p>
						<p className="text-lg text-gray-700">
							Su diseño está ingeniosamente inspirado en el tradicional vaso de vodka, incorporando
							los relieves del propio nombre para una estética distintiva y táctil.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
