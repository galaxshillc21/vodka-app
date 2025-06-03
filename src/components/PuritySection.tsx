"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

export default function PuritySection() {
	const t = useTranslations("Index");
	return (
		<section className="min-h-screen py-20 bg-gray-100 text-center Purity flex items-center justify-center relative">
			<div className="absolute w-full h-[400px]  bottom-[10%] z-10">
				<Image
					src="/images/curvy-line.svg"
					alt="Curvy Line"
					fill
					className="object-cover"
					priority
				/>
			</div>
			<div className="container">
				<div className="flex flex-row">
					<div className="left flex-1">
						<div className="PurityBg w-[480px] h-[700px] mx-auto flex flex-col items-center justify-center relative overflow-hidden bg-[url('/images/bartender.webp')] bg-cover bg-no-repeat rounded-full bg-center z-20">
							<div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />
						</div>
					</div>
					<div className="right flex-1 flex justify-start align-center items-center">
						<div className="text-left">
							<h2 className="text-4xl text-amber-600 font-bold mb-12">{t("purityHeading")}</h2>
							<div className="flex flex-row">
								<h3 className="text-amber-600 ">{t("puritySabor")}</h3>
								<p className="mx-3 text-lg mb-6">{t("purity1")}</p>
							</div>
							<div className="flex flex-row">
								<h3 className="text-amber-600">{t("purityCalidad")}</h3>
								<p className="mx-3 text-lg mb-6">{t("purity2")}</p>
							</div>
							<div className="flex flex-row">
								<h3 className="text-amber-600">{t("purityCombinar")}</h3>
								<p className="mx-3 text-lg mb-6">{t("purity3")}</p>
							</div>
							<div className="flex flex-row">
								<h3 className="text-amber-600">{t("puritySuavidad")}</h3>
								<p className="mx-3 text-lg mb-6">{t("purity4")}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
