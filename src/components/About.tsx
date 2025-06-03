"use client";

import React from "react";
import { useTranslations } from "next-intl"; // Import useTranslations
import Image from "next/image";

export default function About() {
	const t = useTranslations("About"); // Use the translations for the About section

	return (
		<section className="container mx-auto relative bg-white py-20">
			<div className="grid grid-cols-1 md:grid-cols-3 items-center w-full mx-auto gap-8">
				{/* Botella izquierda */}
				<div className="hidden md:flex justify-center">
					<Image
						src="/images/blatvodka-bottle-full.webp"
						alt="Botella izquierda"
						className="drop-shadow-lg"
						width={400}
						height={800}
						priority
					/>
				</div>

				{/* Contenido central */}
				<div className="text-center space-y-14 px-4">
					<h2 className="text-4xl font-bold text-amber-600">{t("title")}</h2>

					<div>
						<h3 className="text-2xl font-semibold text-gray-900 mb-3">{t("heading1")}</h3>
						<p className="text-gray-700 text-base">{t("description1")}</p>
					</div>

					<div>
						<h3 className="text-2xl font-semibold text-gray-900 mb-3">{t("heading2")}</h3>
						<p className="text-gray-700 text-base">{t("description2")}</p>
					</div>

					<div>
						<h3 className="text-2xl font-semibold text-gray-900 mb-3">{t("heading3")}</h3>
						<p className="text-gray-700 text-base">{t("description3")}</p>
					</div>
				</div>

				{/* Botella derecha */}
				<div className="hidden md:flex justify-center">
					<Image
						src="/images/blatvodka-bottle-full.webp"
						alt="Botella derecha"
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
