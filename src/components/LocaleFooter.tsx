// src/components/LocaleSwitcher.tsx
import { useLocale, useTranslations } from "next-intl";
// The 'routing' import is no longer needed here as LocaleSwitcherSelect will import it directly
import LocaleSwitcherSelectFooter from "./LocaleSwitcherSelectFooter";

export default function LocaleSwitcherFooter() {
	const t = useTranslations("LocaleSwitcher");
	const locale = useLocale();

	return <LocaleSwitcherSelectFooter value={locale} label={t("label")} />;
}
