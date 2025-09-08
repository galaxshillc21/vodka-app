"use client";

import React from "react";
import { useTranslations } from "next-intl"; // Import useTranslations
import SpotlightCard from "@/components/SpotlightCard";

export function Qualities() {
  const t = useTranslations("Index.QualitySection"); // Use the translations for the About section

  return (
    <section className="container mx-auto px-4 py-12 Qualities">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
          <h2 className="text-3xl font-bold text-amber-500 mb-2" dangerouslySetInnerHTML={{ __html: t("quality1") }}></h2>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">{t("sub1")}</h3>
          <p className="text-gray-600 text-sm">{t("desc1")}</p>
        </SpotlightCard>
        <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
          <h2 className="text-3xl font-bold text-amber-500 mb-2" dangerouslySetInnerHTML={{ __html: t("quality2") }}></h2>
          <h3 className="text-lg font-semibold text-gray-600 mb-3">{t("sub2")}</h3>
          <p className="text-gray-600 text-sm">{t("desc2")}</p>
        </SpotlightCard>
        <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
          <h2 className="text-3xl font-bold text-amber-500 mb-2" dangerouslySetInnerHTML={{ __html: t("quality3") }}></h2>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">{t("sub3")}</h3>
          <p className="text-gray-600 text-sm">{t("desc3")}</p>
        </SpotlightCard>
      </div>
    </section>
  );
}
