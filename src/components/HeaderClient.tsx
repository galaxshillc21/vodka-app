"use client";
import { useState, useEffect } from "react";
import { Home, Newspaper, Store, Martini, Loader2 } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { Logo } from "@/components/Logo";
import { Menubar, MenubarMenu, MenubarSeparator } from "@/components/ui/menubar";

export default function HeaderClient() {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const [loadingPath, setLoadingPath] = useState<string | null>(null);

  const LocaleSwitcher = dynamic(() => import("@/components/LocaleSwitcher"), {
    loading: () => <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />,
    ssr: false,
  });

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  useEffect(() => {
    if (loadingPath && pathname === loadingPath) {
      setLoadingPath(null);
    }
  }, [pathname, loadingPath]);

  const handleLinkClick = (href: string) => {
    setLoadingPath(href);
  };

  const renderIcon = (linkHref: string, IconComponent: React.ElementType) => {
    if (loadingPath === linkHref) {
      return <Loader2 size={20} className="animate-spin" />;
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
              <MenubarMenu>
                <Link href="/" className={`flex items-center gap-1 px-3 py-2 rounded-full transition-colors duration-200 hover:cursor-pointer ${isActive("/") ? "bg-gray-600/20 text-foreground" : "hover:bg-gray-600/10 hover:text-foreground"}`} onClick={() => handleLinkClick("/")}>
                  {renderIcon("/", Home)}
                  <span className="">{t("home")}</span>
                </Link>
              </MenubarMenu>
              <MenubarMenu>
                <Link href="/events" className={`flex items-center gap-1 px-3 py-2 hover:cursor-pointer rounded-full transition-colors duration-200 ${isActive("/events") ? "bg-gray-600/20 text-foreground" : "hover:bg-gray-600/10 hover:text-foreground"}`} onClick={() => handleLinkClick("/events")}>
                  {renderIcon("/events", Newspaper)}
                  <span className="">{t("events")}</span>
                </Link>
              </MenubarMenu>
              <MenubarMenu>
                <Link href="/search" className={`flex items-center gap-1 px-3 py-2 hover:cursor-pointer rounded-full transition-colors duration-200 ${isActive("/search") ? "bg-gray-600/20 text-foreground" : "hover:bg-gray-600/10 hover:text-foreground"}`} onClick={() => handleLinkClick("/search")}>
                  {renderIcon("/search", Store)}
                  <span className="">{t("tiendas")}</span>
                </Link>
              </MenubarMenu>
              <MenubarMenu>
                <Link
                  href="/cocktails"
                  className={`flex items-center gap-1 px-3 py-2 hover:cursor-pointer rounded-full transition-colors duration-200 ${isActive("/cocktails") ? "bg-gray-600/20 text-foreground" : "hover:bg-gray-600/10 hover:text-foreground"}`}
                  onClick={() => handleLinkClick("/cocktails")}
                >
                  {renderIcon("/cocktails", Martini)}
                  <span className="">{t("cocktails")}</span>
                </Link>
              </MenubarMenu>
              <MenubarSeparator className="h-[60%] border-[1px]" />
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
