"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

type InstallState = "checking" | "prompt" | "ios" | "unavailable" | "installed";

type NavigatorWithStandalone = Navigator & {
  standalone?: boolean;
};

type InstallButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  "aria-label"?: string;
};

export default function InstallPrompt({ children }: { children: React.ReactElement<InstallButtonProps> }) {
  const t = useTranslations("PWA.installPrompt");
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installState, setInstallState] = useState<InstallState>("checking");

  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as NavigatorWithStandalone).standalone === true;
    const isIOS = /iPad|iPhone|iPod/i.test(window.navigator.userAgent);

    if (isStandalone) {
      setInstallState("installed");
      return;
    }

    setInstallState(isIOS ? "ios" : "unavailable");

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setInstallState("prompt");
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setInstallState("installed");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (installState === "ios") {
      alert([t("iosTitle"), "", `1. ${t("iosStep1")}`, `2. ${t("iosStep2")}`, `3. ${t("iosStep3")}`].join("\n"));
      return;
    }

    if (!deferredPrompt) {
      alert(t("unavailable"));
      return;
    }

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome !== "accepted") {
      setInstallState("unavailable");
    }

    setDeferredPrompt(null);
  };

  if (installState === "installed") {
    return null;
  }

  const isDisabled = installState === "checking" || installState === "unavailable";
  const title = installState === "ios" ? t("iosHint") : isDisabled ? t("unavailable") : undefined;

  return (
    <>
      {React.cloneElement(children, {
        onClick: handleInstallClick,
        disabled: isDisabled,
        title,
        "aria-label": title,
      })}
    </>
  );
}
