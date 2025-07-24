// src/components/ui/navBottom.tsx
"use client";

// Import Link from next-intl/navigation for i18n compatible links
import { Link, usePathname } from "@/i18n/navigation"; // Changed from "next/link"
import { Home, Newspaper, Store, Martini, Loader2 } from "lucide-react"; // Import Loader2
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react"; // Import useState and useEffect

export default function NavBottom() {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const [loadingPath, setLoadingPath] = useState<string | null>(null); // State to track which link is loading

  const currentPageClass = "current-page text-bronze"; // Class for the current page

  // Language switcher dropdown
  const LocaleSwitcherFooter = dynamic(() => import("@/components/LocaleFooter"), {
    loading: () => <div className="w-8 h-8 bg-gray-100 rounded animate-pulse" />,
    ssr: false,
  });

  // Effect to listen for route changes and clear loading state
  useEffect(() => {
    // This effect runs after a navigation is complete (new page is rendered)
    // We compare the current pathname with the path that initiated loading.
    if (loadingPath && pathname === loadingPath) {
      setLoadingPath(null); // Clear loading state if navigation is complete
    }
  }, [pathname, loadingPath]); // Re-run when pathname or loadingPath changes

  // Function to handle link clicks
  const handleLinkClick = (href: string) => {
    setLoadingPath(href); // Set the path that is currently loading
  };

  // Helper function to render icon or loader
  const renderIcon = (linkHref: string, IconComponent: React.ElementType) => {
    // If the current link is loading, show the Loader2 icon, otherwise show the original icon
    if (loadingPath === linkHref) {
      return <Loader2 size={20} className="animate-spin" />; // Add animate-spin for visual effect
    }
    return <IconComponent size={20} />;
  };

  return (
    <nav className="block lg:hidden fixed bottom-0 left-0 right-0 z-50 rounded-t-[20px] bg-background/20 backdrop-blur-lg shadow-md border-t border-gray-200 frosted-md" id="footer-nav">
      <div className="flex justify-around items-center h-14">
        {/* Home Button */}
        <Link
          href="/"
          className={`flex flex-col items-center ${pathname === "/" ? currentPageClass : "text-gray-600 hover:text-black"}`}
          onClick={() => handleLinkClick("/")} // Attach the click handler
        >
          {renderIcon("/", Home)} {/* Use the helper to render the icon */}
          <span className="text-xs">{t("home")}</span>
        </Link>
        {/* News Button */}
        <Link href="/events" className={`flex flex-col items-center ${pathname === "/events" ? currentPageClass : "text-gray-600 hover:text-black"}`} onClick={() => handleLinkClick("/events")}>
          {renderIcon("/events", Newspaper)}
          <span className="text-xs">{t("events")}</span>
        </Link>

        {/* Search Button */}
        <Link href="/search" className={`flex flex-col items-center ${pathname === "/search" ? currentPageClass : "text-gray-600 hover:text-black"}`} onClick={() => handleLinkClick("/search")}>
          {renderIcon("/search", Store)}
          <span className="text-xs">{t("tiendas")}</span>
        </Link>
        {/* Cocktails Button */}
        <Link href="/cocktails" className={`flex flex-col items-center ${pathname === "/cocktails" ? currentPageClass : "text-gray-600 hover:text-black"}`} onClick={() => handleLinkClick("/cocktails")}>
          {renderIcon("/cocktails", Martini)}
          <span className="text-xs">{t("cocktails")}</span>
        </Link>
        <LocaleSwitcherFooter />
      </div>
    </nav>
  );
}
