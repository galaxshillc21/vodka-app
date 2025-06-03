"use client";

import React from "react";
import { useTranslations } from "next-intl"; // Import useTranslations

{
  /* <section className="py-20 bg-white text-center relative">
  <div className="SectionSeparator rounded-t-[50px] mt-[-2em] h-8 bg-white absolute top-0 w-full"></div>
  <h2 className="text-4xl font-bold mb-4 text-amber-600">About Us</h2>
  <p className="max-w-2xl mx-auto text-lg">We’re passionate about vodka. Blat Vodka is distilled with the purest intentions and zero sugar.</p>
</section>; */
}
export default function About() {
  const t = useTranslations("About"); // Use the translations for the About section

  return (
    <section className="py-20 bg-white text-center relative">
      <div className="SectionSeparator rounded-t-[50px] mt-[-2em] h-8 bg-white absolute top-0 w-full"></div>
      <h2 className="text-4xl font-bold mb-4 text-amber-600">{t("title")}</h2>
      <p className="max-w-2xl mx-auto text-lg">{t("description")}</p>
    </section>
  );
}
