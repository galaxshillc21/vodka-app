// src/components/Header.tsx
"use client";

import { Menubar, MenubarMenu, MenubarSeparator } from "@/components/ui/menubar";
import { Home, Newspaper, Store, Martini, Loader2 } from "lucide-react"; // Import Loader2
import { Link, usePathname } from "@/i18n/navigation"; // Import useRouter
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { Logo } from "../Logo";
import { useState, useEffect } from "react"; // Import useState and useEffect

export default function Header() {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const [loadingPath, setLoadingPath] = useState<string | null>(null); // State to track which link is loading

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

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
    // The actual navigation is handled by Next.js's Link component
    // No need to manually call router.push() here if using the <Link> component
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
    <nav className="fixed top-0 left-0 py-3 right-0 m-auto z-[999] bg-gradient-to-b from-orange-50 from-40% to-transparent to-90%">
      <div className="flex flex-row sm:flex lg:hidden justify-center items-center backdrop-blur-sm border-b border-white/20 pb-2">
        <Link href="/">
          <div className="w-[100px]">
            <Logo hexColor="#d87500" hideSecondPart={false} />
          </div>
        </Link>
      </div>
      <div className="hidden lg:flex flex-row">
        <div className="flex-[0_1_25%] flex items-center justify-end">
          <Link href="/">
            <div className="w-[100px]">
              <Logo hexColor="#d87500" hideSecondPart={false} />
            </div>
          </Link>
        </div>
        <div className="flex-1">
          <div className="max-w-[400px] flex justify-center mx-auto">
            <Menubar className="h-[50px] w-auto rounded-full border border-white bg-orange-50/20 p-1 shadow-md justify-between">
              {" "}
              {/* Home link */}
              <MenubarMenu>
                <Link
                  href="/"
                  className={`
                    flex items-center gap-1
                    px-3 py-2 rounded-full transition-colors duration-200 hover:cursor-pointer
                    ${isActive("/") ? "bg-gray-600/20 text-foreground" : "hover:bg-gray-600/10 hover:text-foreground"}
                  `}
                  onClick={() => handleLinkClick("/")} // Call handleLinkClick on click
                >
                  {renderIcon("/", Home)} {/* Render Home icon or loader */}
                  <span className="">{t("home")}</span>
                </Link>
              </MenubarMenu>
              {/* News link */}
              <MenubarMenu>
                <Link
                  href="/news"
                  className={`
                    flex items-center gap-1
                    px-3 py-2  hover:cursor-pointer
                    rounded-full
                    transition-colors duration-200
                    ${isActive("/news") ? "bg-gray-600/20 text-foreground" : "hover:bg-gray-600/10 hover:text-foreground"}
                  `}
                  onClick={() => handleLinkClick("/news")}
                >
                  {renderIcon("/news", Newspaper)}
                  <span className="">{t("news")}</span>
                </Link>
              </MenubarMenu>
              {/* Search link */}
              <MenubarMenu>
                <Link
                  href="/search"
                  className={`
                    flex items-center gap-1
                    px-3 py-2 hover:cursor-pointer
                    rounded-full
                    transition-colors duration-200
                    ${isActive("/search") ? "bg-gray-600/20 text-foreground" : "hover:bg-gray-600/10 hover:text-foreground"}
                  `}
                  onClick={() => handleLinkClick("/search")}
                >
                  {renderIcon("/search", Store)}
                  <span className="">{t("tiendas")}</span>
                </Link>
              </MenubarMenu>
              <MenubarMenu>
                <Link
                  href="/cocktails"
                  className={`
                    flex items-center gap-1
                    px-3 py-2 hover:cursor-pointer
                    rounded-full
                    transition-colors duration-200
                    ${isActive("/cocktails") ? "bg-gray-600/20 text-foreground" : "hover:bg-gray-600/10 hover:text-foreground"}
                  `}
                  onClick={() => handleLinkClick("/cocktails")}
                >
                  {renderIcon("/cocktails", Martini)}
                  <span className="">{t("cocktails")}</span>
                </Link>
              </MenubarMenu>
              <MenubarSeparator className="h-[60%] border-[1px]" /> {/* Separator after Home */}
              <MenubarMenu>
                <LocaleSwitcher />
              </MenubarMenu>
            </Menubar>
          </div>
        </div>
        <div className="flex-[0_1_25%]"></div>
      </div>
    </nav>
  );
}
