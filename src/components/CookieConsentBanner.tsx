"use client";

import CookieConsent from "react-cookie-consent";
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

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      declineButtonText="Decline"
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
      We use cookies to analyze how our website is used so we can improve your experience. You can accept or decline. Declining will not affect your ability to use the site.
    </CookieConsent>
  );
}
