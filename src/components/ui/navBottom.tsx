"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname hook
import { Home, Newspaper, Search } from "lucide-react";
import { useTranslations } from "next-intl"; // Import useTranslations
import LocaleSwitcherFooter from "@/src/components/LocaleFooter"; // Import LocaleSwitcher component

export default function NavBottom() {
  const t = useTranslations("Navigation"); // Fetch translations for Navigation
  const pathname = usePathname(); // Get the current route
  const currentPageClass = "current-page text-bronze"; // Class for the current page
  return (
    <nav className="block lg:hidden fixed bottom-0 left-0 right-0 z-50 rounded-t-[20px] bg-background/20 backdrop-blur-lg shadow-md  border-t border-gray-200 frosted-md" id="footer-nav">
      <div className="flex justify-around items-center h-14">
        {/* Home Button */}
        <Link href="/" className={`flex flex-col items-center ${pathname === "/" ? currentPageClass : "text-gray-600 hover:text-black"}`}>
          <Home size={20} />
          <span className="text-xs">{t("home")}</span>
        </Link>
        {/* News Button */}
        <Link href="/news" className={`flex flex-col items-center ${pathname === "/news" ? currentPageClass : "text-gray-600 hover:text-black"}`}>
          <Newspaper size={20} />
          <span className="text-xs">{t("news")}</span>
        </Link>

        {/* Search Button */}
        <Link href="/search" className={`flex flex-col items-center ${pathname === "/search" ? currentPageClass : "text-gray-600 hover:text-black"}`}>
          <Search size={20} />
          <span className="text-xs">{t("search")}</span>
        </Link>
        <LocaleSwitcherFooter />
      </div>
    </nav>
  );
}
