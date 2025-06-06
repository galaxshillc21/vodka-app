"use client";

import React from "react";
import { useTranslations } from "next-intl"; // Import useTranslations
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/src/components/ui/table";
import BlurText from "@/src/components/BlurText";
import SpotlightCard from "@/src/components/SpotlightCard";

export function Ciencia() {
	const t = useTranslations("Ciencia");
	// const t = useTranslations("Index"); // Use the translations for the About section
	const handleAnimationComplete = () => {
		console.log("Animation completed!");
	};
	const marcas = [
		{
			marca: "Blat Vodka",
			impurezas: "0.0",
			porciento: "0.3",
			color: "0.03",
		},
		{
			marca: "Skyy",
			impurezas: "0.8",
			porciento: "8",
			color: "0.08",
		},
		{
			marca: "Grey Goose",
			impurezas: "1.1",
			porciento: "11",
			color: "0.11",
		},
		{
			marca: "Absolut",
			impurezas: "1.1",
			porciento: "11",
			color: "0.11",
		},
		{
			marca: "Smirnoff",
			impurezas: "1.5",
			porciento: "15",
			color: "0.15",
		},
		{
			marca: "Belvedere",
			impurezas: "2.5",
			porciento: "25",
			color: "0.25",
		},
		{
			marca: "Ketel One",
			impurezas: "5.3",
			porciento: "53",
			color: "0.53",
		},
		{
			marca: "Stolichnaya",
			impurezas: "5.7",
			porciento: "57",
			color: "0.57",
		},
	];
	return (
		<section className="relative bg-white py-20 h-auto" id="Ciencia">
			<div className="container mx-auto  px-4 h-full">
				<div className="w-full text-center mx-auto flex flex-col items-center justify-center">
					<BlurText
						text={t("title")}
						delay={80}
						animateBy="words"
						direction="top"
						onAnimationComplete={handleAnimationComplete}
						className="font-heading text-4xl sm:text-4xl md:text-5xl lg:text-5xl font-bold mt-6 text-center text-amber-600 mb-6 leading-tight justify-center"
					/>
				</div>
				<div className="flex-[0-1-10%] flex flex-col lg:flex-row mt-12 align-items-center justify-center gap-12 h-auto">
					<div className="flex-1 flex flex-col justify-center items-center pr-12">
						<p className="text-lg mb-4 text-gray-700">
							{t("p1")}
							<span className="font-bold text-amber-600">{t("span1")}</span>
							{t("p1a")}
						</p>
						<p className="text-lg mb-4 text-gray-700">{t("p2")}</p>
					</div>
					<SpotlightCard
						className="shadow-md p-2! lg:p-4! flex-1 flex flex-col justify-center items-center rounded-lg custom-spotlight-card overflow-visible!"
						spotlightColor="rgba(0, 229, 255, 0.2)"
					>
						<Table>
							<TableHeader className="bg-amber-100">
								<TableRow>
									<TableHead className="w-[80px] text-amber-800 font-bold">{t("marcaH")}</TableHead>
									<TableHead className="w-[100px] text-amber-800 font-bold">{t("impH")}</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{marcas.map((marca) => (
									<TableRow key={marca.marca}>
										{/* if marca.marca is Blat Vodka make it bold */}
										<TableCell
											className={`font-medium ${
												marca.marca === "Blat Vodka" ? "text-gray-900 font-bold text-lg" : ""
											}`}
										>
											{marca.marca}
										</TableCell>
										<TableCell
											className={`relative font-medium ${
												marca.impurezas === "0.0" ? "text-gray-900 font-bold text-lg" : ""
											}`}
										>
											<div
												className={`h-[20px] z-0 absolute`}
												style={{
													background: `rgba(255,0,0,${marca.color})`,
													width: `${marca.porciento}%`,
												}}
											></div>
											<span className="left-1 relative z-10 text-gray-700">{marca.impurezas}</span>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</SpotlightCard>
				</div>
			</div>
		</section>
	);
}
