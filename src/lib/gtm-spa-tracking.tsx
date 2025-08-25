"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function GTMTracker() {
  const pathname = usePathname();
  const prevPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;

    const pageReferrer = prevPathRef.current;
    prevPathRef.current = pathname; // update for next navigation

    // Avoid firing on first load (let GTM/GA4 handle that if you prefer)
    if (pageReferrer === null) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "page_view",
      page_location: window.location.href,
      page_path: pathname,
      page_referrer: pageReferrer, // ✅ custom param
    });
  }, [pathname]);

  return null;
}
