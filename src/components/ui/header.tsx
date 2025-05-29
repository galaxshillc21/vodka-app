// src/components/Header.tsx
"use client";

import { Menubar, MenubarMenu, MenubarSeparator } from "@/src/components/ui/menubar";
import { Home, Newspaper, Search } from "lucide-react";
import { Link, usePathname } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/src/components/LocaleSwitcher";

export default function Header() {
	const t = useTranslations("Navigation");
	const pathname = usePathname();
	const isActive = (href: string) => {
		if (href === "/") {
			return pathname === "/";
		}
		return pathname.startsWith(href);
	};

	return (
		<nav className="hidden lg:block fixed top-0 left-0 py-3 right-0 m-auto z-[999] bg-gradient-to-b from-white from-20% to-transparent to-90%">
			<div className="max-w-[400px] flex justify-center mx-auto">
				<Menubar className="h-[50px] w-auto rounded-full border bg-background/20 p-1 shadow-md justify-between">
					{" "}
					<MenubarMenu>
						<Link
							href="/"
							className={`
                flex items-center gap-1 
                px-3 py-2 rounded-full transition-colors duration-200 hover:cursor-pointer
                ${
									isActive("/")
										? "bg-gray-600/20 text-foreground"
										: "hover:bg-gray-600/10 hover:text-foreground"
								}
              `}
						>
							<Home size={20} />
							<span>{t("home")}</span>
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
                ${
									isActive("/news")
										? "bg-gray-600/20 text-foreground"
										: "hover:bg-gray-600/10 hover:text-foreground"
								}
              `}
						>
							<Newspaper size={20} />
							<span>{t("news")}</span>
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
                ${
									isActive("/search")
										? "bg-gray-600/20 text-foreground"
										: "hover:bg-gray-600/10 hover:text-foreground"
								}
              `}
						>
							<Search size={20} />
							<span>{t("search")}</span>
						</Link>
					</MenubarMenu>
					<MenubarSeparator className="h-[60%] border-[1px]" /> {/* Separator after Home */}
					<MenubarMenu>
						<LocaleSwitcher />
					</MenubarMenu>
				</Menubar>
			</div>
		</nav>
	);
}
