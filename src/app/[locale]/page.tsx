// app/[locale]/page.tsx
// import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation"; // This import path is now correct, pointing to the new src/navigation.ts
import LocaleSwitcher from "@/src/components/LocaleSwitcher";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
	// Changed params type to Promise and removed direct destructuring
	const { locale } = await params; // Await params before destructuring locale
	const t = await getTranslations("Index");

	return (
		<div>
			<h1>{t("title")}</h1>
			<p>{t("description")}</p>

			<nav>
				<ul>
					<li>
						{/* The Link component now automatically handles the locale prefix */}
						<Link href="/">Home</Link>
					</li>
					<li>
						<Link href="/about">About</Link>
					</li>
				</ul>
			</nav>

			<LocaleSwitcher />
		</div>
	);
}
