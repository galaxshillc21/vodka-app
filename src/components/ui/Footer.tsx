// @components/ui/Footer.tsx

import SpotlightCard from "@/components/SpotlightCard";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Home, Store, Martini, Instagram, MonitorSmartphone } from "lucide-react";
import InstallPrompt from "@/components/InstallPrompt";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="relative w-full ">
      <SpotlightCard className="w-full px-6 rounded-t-xl rounded-b-none flex flex-col items-center gap-3 lg:gap-6 h-full pb-[90px] lg:pb-0" spotlightColor="rgba(0, 229, 255, 0.2)">
        <nav className="flex flex-wrap justify-center gap-3 lg:gap-6 mb-4">
          <Link href="/" className="flex items-center gap-1 hover:underline">
            <Home size={18} />
            {t("home")}
          </Link>
          {/* <Link href="/events" className="flex items-center gap-1 hover:underline">
            <Newspaper size={18} />
            {t("events")}
          </Link> */}
          <Link href="/search" className="flex items-center gap-1 hover:underline">
            <Store size={18} />
            {t("stores")}
          </Link>
          <Link href="/cocktails" className="flex items-center gap-1 hover:underline">
            <Martini size={18} />
            {t("cocktails")}
          </Link>
        </nav>

        {/* Social Media Section */}
        <div className="flex items-center gap-2 mb-4">
          <a href="https://instagram.com/blat_vodka" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-orange-600 transition-colors">
            <Instagram size={20} />
            <span>@blat_vodka</span>
          </a>
        </div>

        <div className="text-center text-sm text-gray-600 dark:text-gray-300">
          <div className="mt-2">
            <a href="mailto:fbanus@blatvodka.com" className="underline hover:text-orange-600">
              {t("contact")}
            </a>{" "}
            |{" "}
            <Link href="/privacy" className="underline hover:text-orange-600">
              {t("privacy")}
            </Link>{" "}
            {/*|{" "}
             <Link
              href="#"
              className="underline hover:text-orange-600"
              onClick={(e) => {
                e.preventDefault(); // Prevent navigation
                setShowCookieSettings(true); // Show the banner
              }}
            >
              Cookie Settings
            </Link> */}
          </div>
        </div>
        <div className="mt-8 InstallPrompt text-center">
          <InstallPrompt>
            <Button size="lg" className="rounded-full h-12 px-12 bg-amber-600 text-white text-md sm:text-md hover:bg-amber-700 transition-colors">
              <MonitorSmartphone size={20} className="inline-block mr-2" />
              {t("installApp")}
            </Button>
          </InstallPrompt>
        </div>
        <div>
          Blat Vodka &copy; {new Date().getFullYear()} | {t("copyright")}.
        </div>
      </SpotlightCard>
      <div className="absolute left-0 right-0 bottom-2 text-center text-xs text-gray-400">{t("createdBy")} Galaxshi LLC.</div>
    </footer>
  );
}
