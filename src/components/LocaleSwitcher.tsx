// src/components/LocaleSwitcher.tsx
import { useLocale, useTranslations } from "next-intl";
// The 'routing' import is no longer needed here as LocaleSwitcherSelect will import it directly
import LocaleSwitcherSelect from "./LocaleSwitcherSelect";

export default function LocaleSwitcher() {
	const t = useTranslations("LocaleSwitcher");
	const locale = useLocale();

	return <LocaleSwitcherSelect value={locale} label={t("label")} />;
}
