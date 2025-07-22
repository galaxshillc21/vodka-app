"use client";

import SpotlightCard from "@/src/components/SpotlightCard";
import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";
import { Home, Newspaper, Store, Martini, Instagram } from "lucide-react";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="relative w-full ">
      <SpotlightCard className="w-full px-6 rounded-t-xl rounded-b-none flex flex-col items-center gap-3 lg:gap-6 h-full pb-[90px] lg:pb-0" spotlightColor="rgba(0, 229, 255, 0.2)">
        <nav className="flex flex-wrap justify-center gap-3 lg:gap-6 mb-4">
          <Link href="/" className="flex items-center gap-1 hover:underline">
            <Home size={18} />
            {t("home")}
          </Link>
          <Link href="/events" className="flex items-center gap-1 hover:underline">
            <Newspaper size={18} />
            {t("events")}
          </Link>
          <Link href="/search" className="flex items-center gap-1 hover:underline">
            <Store size={18} />
            {t("stores")}
          </Link>
          <Link href="/cocktails" className="flex items-center gap-1 hover:underline">
            <Martini size={18} />
            {t("cocktails")}
          </Link>
        </nav>

        {/* Social Media Section */}
        <div className="flex items-center gap-2 mb-4">
          <a href="https://instagram.com/blat_vodka" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-orange-600 transition-colors">
            <Instagram size={20} />
            <span>@blat_vodka</span>
          </a>
          {/* <span className="text-gray-400">•</span> */}
        </div>

        <div className="text-center text-sm text-gray-600 dark:text-gray-300">
          <div>
            Blat Vodka &copy; {new Date().getFullYear()} | {t("copyright")}.
          </div>
          <div className="mt-2">
            <a href="mailto:info@galaxshi.com" className="underline hover:text-orange-600">
              {t("contact")}
            </a>{" "}
            |{" "}
            <Link href="/privacy" className="underline hover:text-orange-600">
              {t("privacy")}
            </Link>
          </div>
        </div>
      </SpotlightCard>
      <div className="absolute left-0 right-0 bottom-2 text-center text-xs text-gray-400">
        {t("createdBy")}{" "}
        <a href="https://galaxshi.com" target="_blank" className="underline hover:text-orange-600">
          Galaxshi LLC.
        </a>
      </div>
    </footer>
  );
}
