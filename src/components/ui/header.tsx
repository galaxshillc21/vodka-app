// src/components/Header.tsx
"use client";

import {
	Menubar,
	MenubarMenu,
	MenubarSeparator,
	MenubarTrigger,
} from "@/src/components/ui/menubar";
import { Home, Newspaper, Search } from "lucide-react";
import { Link, usePathname } from "@/src/i18n/navigation";

export default function Header() {
	const pathname = usePathname();
	const isActive = (href: string) => {
		if (href === "/") {
			return pathname === "/";
		}
		return pathname.startsWith(href);
	};

	return (
		<nav className="hidden lg:block fixed top-5 left-0 right-0 m-auto z-[999] max-w-[300px]">
			<Menubar className="justify-center">
				{" "}
				<MenubarMenu>
					<MenubarTrigger asChild>
						<Link
							href="/"
							className={`
                flex items-center gap-1 hover:cursor-pointer         /* 1. Icon and text inline with a small gap */
                px-3 py-2                        /* Padding for the pill shape */
                rounded-full                     /* 2. Pill form */
                transition-colors duration-200   /* Smooth transition for hover/active */
                ${
									isActive("/")
										? "bg-gray-600/20 text-foreground"
										: "hover:bg-gray-600/20 hover:text-foreground"
								}
                /* 3. Active state (bg-gray-600/20) or hover state (bg-gray-600/20) */
              `}
						>
							<Home size={20} />
							<span>Home</span>
						</Link>
					</MenubarTrigger>
				</MenubarMenu>
				<MenubarSeparator /> {/* Separator after Home */}
				{/* News link */}
				<MenubarMenu>
					<MenubarTrigger asChild>
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
										: "hover:bg-gray-600/20 hover:text-foreground"
								}
              `}
						>
							<Newspaper size={20} />
							<span>News</span>
						</Link>
					</MenubarTrigger>
				</MenubarMenu>
				{/* Search link */}
				<MenubarMenu>
					<MenubarTrigger asChild>
						<Link
							href="/search"
							className={`
                flex items-center gap-1
                px-3 py-2 hover:cursor-pointer
                rounded-full
                transition-colors duration-200 hover:bg-gray-600/20
                ${
									isActive("/search")
										? "bg-gray-600/20 text-foreground"
										: "hover:bg-gray-600/20 hover:text-foreground"
								}
              `}
						>
							<Search size={20} />
							<span>Search</span>
						</Link>
					</MenubarTrigger>
				</MenubarMenu>
			</Menubar>
		</nav>
	);
}
