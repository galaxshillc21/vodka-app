"use client";

import React from "react";
// import { useTranslations } from "next-intl"; // Import useTranslations
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import BlurText from "@/src/components/BlurText";

export function Ciencia() {
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
          <BlurText text="La Ciencia Detrás de la Pureza Inigualable" delay={80} animateBy="words" direction="top" onAnimationComplete={handleAnimationComplete} className="text-4xl sm:text-4xl md:text-5xl lg:text-5xl font-bold mt-6 text-center text-amber-600 mb-6 leading-tight" />
        </div>
        <div className="flex-[0-1-10%] flex flex-row mt-12 align-items-center justify-center gap-12 h-auto">
          <div className="flex-1 flex flex-col justify-center items-center pr-12">
            <p className="text-lg mb-4 text-gray-700">
              Los hermanos Banús dedicaron años a investigar y desarrollar un proceso único que elimina las impurezas de la fermentación sin comprometer el sabor. Este método patentado nos permite elaborar Blat Vodka con{" "}
              <span className="font-bold text-amber-600">0.0mg/L de impurezas detectadas</span>, estableciéndolo como el vodka más puro del mundo.
            </p>
            <p className="text-lg mb-4 text-gray-700">
              Nuestra pureza está certificada: Un laboratorio independiente de EE.UU., acreditado por la TTB, ha confirmado que Blat Vodka no contiene impurezas detectables, incluyendo 1-butanol, alcohol amílico activo, alcohol isoamílico, isobutanol, metanol, n-propanol, DB acetaldehído y DB
              acetato de etilo.
            </p>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center rounded-lg border border-gray-200 p-4 bg-gray-50 shadow-md">
            <Table>
              <TableCaption>A list of your recent invoices.</TableCaption>
              <TableHeader className="bg-amber-100">
                <TableRow>
                  <TableHead className="w-[80px] text-amber-800 font-bold">Marca</TableHead>
                  <TableHead className="w-[100px] text-amber-800 font-bold">Impurezas (mg/L)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marcas.map((marca) => (
                  <TableRow key={marca.marca}>
                    {/* if marca.marca is Blat Vodka make it bold */}
                    <TableCell className={`font-medium ${marca.marca === "Blat Vodka" ? "text-gray-900 font-bold" : ""}`}>{marca.marca}</TableCell>
                    <TableCell className={`relative font-medium ${marca.impurezas === "0.0" ? "text-gray-900 font-bold" : ""}`}>
                      <div
                        className={`h-[20px] z-0 absolute`}
                        style={{
                          background: `rgba(255,0,0,${marca.color})`,
                          width: `${marca.porciento}%`,
                        }}
                      ></div>
                      <span className="left-1 relative z-10">{marca.impurezas}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  );
}
