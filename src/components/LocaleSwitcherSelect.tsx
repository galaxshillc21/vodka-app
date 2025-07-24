// src/components/LocaleSwitcherSelect.tsx
"use client";

import clsx from "clsx"; // Used for conditional classes
import Image from "next/image"; // Used for flag images
import { useParams } from "next/navigation";
import { Locale } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation"; // Your custom navigation setup
import { routing } from "../i18n/routing"; // Your routing configuration
import { useTranslations } from "next-intl"; // For translating locale names

// Import shadcn/ui Select components
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Adjust import path if your shadcn components are elsewhere

type Props = {
  value: string; // The current active locale
  label: string; // Accessibility label for the select
};

// Helper function to get the flag image path
const getFlagPath = (localeCode: string) => `/flags/4x3/${localeCode}.svg`; // Assumes flags are in public/flags/

export default function LocaleSwitcherSelect({ value }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();
  const t = useTranslations("LocaleSwitcher");

  function onValueChange(nextLocale: string) {
    // shadcn Select passes the new value as a string
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale as Locale } // Cast back to Locale type
      );
    });
  }

  return (
    <div
      className={clsx(
        "relative text-gray-400 h-full", // Basic styling for the wrapper
        isPending && "transition-opacity opacity-30" // Apply pending state opacity
      )}
    >
      <Select onValueChange={onValueChange} defaultValue={value} disabled={isPending}>
        <SelectTrigger className="w-[50px] h-full border-none focus:ring-0 flex items-center gap-1 px-3 py-2 rounded-full transition-colors duration-200 align-middle hover:cursor-pointer hover:bg-gray-600/20 hover:text-foreground shadow-none">
          <SelectValue placeholder={t("label")}>
            <span className="flex items-center">
              <Image src={getFlagPath(value)} alt={`${value} flag`} width={20} height={15} className="h-4 w-5 rounded-sm mr-2 inline" />
              {/* {t(value)} */}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {routing.locales.map((cur) => (
            <SelectItem key={cur} value={cur} className="flex items-center">
              <Image src={getFlagPath(cur)} alt={`${cur} flag`} width={20} height={15} className="h-4 w-5 rounded-sm mr-2 inline" />
              {t(cur)} {/* Display translated locale name */}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
