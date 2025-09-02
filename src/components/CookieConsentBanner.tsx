"use client";

import CookieConsent from "react-cookie-consent";
import { useTranslations } from "next-intl";

// import { useEffect } from "react";

export default function CookieConsentBanner() {
  // On first load, push default "denied" consent so GA4 doesn’t drop cookies
  // useEffect(() => {
  //   window.dataLayer = window.dataLayer || [];
  //   window.dataLayer.push({
  //     event: "default_consent",
  //     ad_storage: "denied",
  //     analytics_storage: "denied",
  //   });
  // }, []);
  const t = useTranslations("Footer");

  return (
    <CookieConsent
      location="bottom"
      buttonText={t("accept")}
      declineButtonText={t("decline")}
      enableDeclineButton
      style={{
        background: "#93939354",
        backdropFilter: "blur(10px)",
        color: "black",
        fontSize: "14px",
        padding: "8px",
      }}
      buttonStyle={{
        background: "rgb(217, 119, 6)",
        color: "#fff",
        fontSize: "14px",
        padding: "8px 16px",
        borderRadius: "100px",
        width: "200px",
        height: "40px",
      }}
      declineButtonStyle={{
        background: "transparent",
        color: "black",
        fontSize: "14px",
        padding: "8px 16px",
        borderRadius: "100px",
        border: "1px solid rgb(217, 119, 6)",
        width: "200px",
        height: "40px",
      }}
      onAccept={() => {
        window.dataLayer.push({
          event: "update_consent",
          ad_storage: "granted",
          analytics_storage: "granted",
        });
      }}
      onDecline={() => {
        window.dataLayer.push({
          event: "update_consent",
          ad_storage: "denied",
          analytics_storage: "denied",
        });
      }}
    >
      {t("cookieConsentMessage")}
    </CookieConsent>
  );
}
