"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wine } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AgeVerificationModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("AgeVerification");

  useEffect(() => {
    // Check if user has already verified
    const isVerified = localStorage.getItem("blat-age-verified");
    if (!isVerified) {
      setIsVisible(true);
    }
  }, []);

  // Prevent scrolling when modal is visible
  useEffect(() => {
    if (isVisible) {
      // Store original overflow value
      const originalOverflow = document.body.style.overflow;

      // Prevent scrolling
      document.body.style.overflow = "hidden";

      // Cleanup function to restore scrolling
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isVisible]);

  const handleYes = async () => {
    setIsLoading(true);

    // Brief loading animation for better UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Store verification in localStorage
    localStorage.setItem("blat-age-verified", "true");
    localStorage.setItem("blat-verification-date", new Date().toISOString());

    setIsVisible(false);
  };

  const handleNo = () => {
    // Redirect to external site for underage users
    window.location.href = "https://www.responsibility.org/";
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-md" />

          {/* Modal */}
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={{ type: "spring", duration: 0.5 }} className="relative w-full max-w-xl">
            {/* Glassmorphism Container */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-600/20 to-amber-700/20 p-6 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }} className="w-20 h-20 bg-amber-600/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-amber-300/30">
                  <Wine className="w-10 h-10 text-amber-300" />
                </motion.div>

                <h2 className="text-3xl font-bold text-white mb-0">{t("title")}</h2>
              </div>

              {/* Buttons */}
              <div className="p-8">
                <p className="text-white/90 text-lg leading-relaxed text-center mb-12">{t("question")}</p>

                <div className="grid grid-cols-2 gap-4">
                  {/* No Button */}
                  <button onClick={handleNo} disabled={isLoading} className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 hover:bg-red-500/20 hover:border-red-400/40 hover:scale-105 active:scale-95 disabled:opacity-50">
                    {t("no")}
                  </button>

                  {/* Yes Button */}
                  <button
                    onClick={handleYes}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 backdrop-blur-sm border border-amber-500/30 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t("entering")}
                      </div>
                    ) : (
                      t("yes")
                    )}
                  </button>
                </div>

                {/* Disclaimer */}
                <p className="text-white/60 text-xs text-center mt-6 leading-relaxed">{t("disclaimer")}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
