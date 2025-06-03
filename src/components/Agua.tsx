"use client";

import React from "react";
import { useTranslations } from "next-intl"; // Import useTranslations
import Image from "next/image";

export default function Agua() {
	const t = useTranslations("Agua"); // Use the translations for the About section

	return (
		<section className="flex items-center justify-center min-h-screen">
			<div className="container">
				<div className="relative h-[80vh] mx-auto bg-cover bg-center bg-no-repeat flex align-center text-center rounded-xl overflow-hidden bg-[url('/images/beach-bg.jpg')]">
					<div className="absolute inset-0 bg-black/60 z-0" />
					<div className="relative z-10 flex flex-col items-center justify-center max-w-3xl mx-auto space-y-8">
						<h1 className="text-[40px] font-bold text-amber-400">{t("title")}</h1>
						<p className="text-white text-2xl leading-relaxed">{t("description")}</p>
					</div>
				</div>
			</div>
		</section>
	);
}
