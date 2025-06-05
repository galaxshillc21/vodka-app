// src/components/Header.tsx
"use client";

import { Menubar, MenubarMenu, MenubarSeparator } from "@/src/components/ui/menubar";
import { Home, Newspaper, Store, Martini } from "lucide-react";
import { Link, usePathname } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/src/components/LocaleSwitcher";
// import Image from "next/image";
import { Logo } from "../Logo";

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
                ${
									isActive("/news")
										? "bg-gray-600/20 text-foreground"
										: "hover:bg-gray-600/10 hover:text-foreground"
								}
              `}
								>
									<Newspaper size={20} />
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
                ${
									isActive("/search")
										? "bg-gray-600/20 text-foreground"
										: "hover:bg-gray-600/10 hover:text-foreground"
								}
              `}
								>
									<Store size={20} />
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
                ${
									isActive("/cocktails")
										? "bg-gray-600/20 text-foreground"
										: "hover:bg-gray-600/10 hover:text-foreground"
								}
              `}
								>
									<Martini size={20} />
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
