"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname hook
import { Home, Newspaper, Search } from "lucide-react";
import LocaleSwitcher from "@/src/components/LocaleSwitcher";

export default function NavBottom() {
  const pathname = usePathname(); // Get the current route
  const currentPageClass = "current-page text-bronze"; // Class for the current page
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/40 shadow-md border-t border-gray-200 frosted-md">
      <div className="flex justify-around items-center h-14">
        {/* News Button */}
        <Link href="/news" className={`flex flex-col items-center ${pathname === "/news" ? currentPageClass : "text-gray-600 hover:text-black"}`}>
          <Newspaper size={20} />
          <span className="text-xs">Noticias</span>
        </Link>

        {/* Home Button */}
        <Link href="/" className={`flex flex-col items-center ${pathname === "/" ? currentPageClass : "text-gray-600 hover:text-black"}`}>
          <Home size={20} />
          <span className="text-xs">Home</span>
        </Link>

        {/* Search Button */}
        <Link href="/search" className={`flex flex-col items-center ${pathname === "/search" ? currentPageClass : "text-gray-600 hover:text-black"}`}>
          <Search size={20} />
          <span className="text-xs">Buscar</span>
        </Link>
        {/* Locale Switcher */}
        <LocaleSwitcher />
      </div>
    </nav>
  );
}
