"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function AISection() {
  const t = useTranslations("Index.AISection");

  return (
    <section className="h-auto w-full bg-gradient-to-br from-sky-100 to-white py-[80px]">
      <div className="container mx-auto  px-4 h-full">
        <div className=" flex flex-col lg:flex-row items-center justify-center">
          {/* Image Section - Left side on desktop, top on mobile */}
          <motion.div initial={{ x: 0, opacity: 0, filter: "blur(10px)" }} animate={{ x: 0, opacity: 1, filter: "blur(0px)" }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <Image src="/images/blat_citrus.webp" alt="Blat Bottle at the Beach" width={600} height={600} loading="lazy" className="rounded-3xl w-auto max-h-[300px] lg:max-h-[500px] lg:max-w-none" />
          </motion.div>

          {/* Content Section - Right side on desktop, bottom on mobile */}
          <div className="w-full lg:w-auto flex flex-col items-center justify-center p-4 lg:p-8">
            <div className="max-w-4xl text-center py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Sparkles className="w-8 h-8 text-amber-600" />
                <h2 className="text-3xl lg:text-4xl font-extrabold text-amber-700">{t("title")}</h2>
                <Sparkles className="w-8 h-8 text-amber-600" />
              </div>

              <p className="text-md lg:text-lg text-gray-700 mb-10 leading-relaxed">{t("description")}</p>

              <Link href="/cocktails">
                <Button size="lg" className="rounded-full h-14 px-12 bg-amber-600 text-white text-md lg:text-lg hover:bg-amber-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <Sparkles className="w-5 h-5 mr-2" />
                  {t("button")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
