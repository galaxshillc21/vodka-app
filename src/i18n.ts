// src/i18n.ts
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "./i18n/routing"; // Import locales from the new routing file

export default getRequestConfig(async ({ locale }) => {
	// Validate that the incoming `locale` parameter is valid
	if (!locales.includes(locale as (typeof locales)[number])) notFound();

	return {
		// FIX: Add the locale property here
		locale, // <--- Add this line
		messages: (await import(`@/messages/${locale}.json`)).default,
	};
});
