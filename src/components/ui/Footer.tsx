import SpotlightCard from "@/src/components/SpotlightCard";
import Link from "next/link";
import { Home, Newspaper, Search, Store, Martini } from "lucide-react";

export default function Footer() {
	return (
		<footer className="relative w-full mt-10">
			<SpotlightCard
				className="w-full px-6  rounded-t-xl rounded-b-none flex flex-col items-center gap-6 h-full"
				spotlightColor="rgba(0, 229, 255, 0.2)"
			>
				<nav className="flex flex-wrap justify-center gap-6 mb-4">
					<Link href="/" className="flex items-center gap-1 hover:underline">
						<Home size={18} />
						Home
					</Link>
					<Link href="/news" className="flex items-center gap-1 hover:underline">
						<Newspaper size={18} />
						News
					</Link>
					<Link href="/search" className="flex items-center gap-1 hover:underline">
						<Search size={18} />
						Search
					</Link>
					<Link href="/store" className="flex items-center gap-1 hover:underline">
						<Store size={18} />
						Store
					</Link>
					<Link href="/cocktails" className="flex items-center gap-1 hover:underline">
						<Martini size={18} />
						Cocktails
					</Link>
				</nav>
				<div className="text-center text-sm text-gray-600 dark:text-gray-300">
					<div>Blat Vodka &copy; {new Date().getFullYear()} | All rights reserved.</div>
					<div className="mt-2">
						<a href="mailto:info@galaxshi.com" className="underline hover:text-orange-600">
							Contact
						</a>{" "}
						|{" "}
						<Link href="/privacy" className="underline hover:text-orange-600">
							Privacy Policy
						</Link>
					</div>
				</div>
			</SpotlightCard>
			<div className="absolute left-0 right-0 bottom-2 text-center text-xs text-gray-400">
				created by{" "}
				<a href="https://galaxshi.com" target="_blank" className="underline hover:text-orange-600">
					Galaxshi LLC.
				</a>
			</div>
		</footer>
	);
}
