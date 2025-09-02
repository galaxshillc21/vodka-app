import { useTranslations } from "next-intl";

export default function PrivacyPage() {
  const t = useTranslations("Privacy");
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 font-fraunces">{t("title")}</h1>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            {/* Introduction */}
            <section>
              <p className="text-gray-700 leading-relaxed text-md lg:text-lg">{t("introduction")}</p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 font-fraunces">{t("informationCollected")}</h2>
              <p className="text-gray-700 leading-relaxed">{t("informationCollectedDesc")}</p>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 font-fraunces">{t("howWeUse")}</h2>
              <p className="text-gray-700 leading-relaxed">{t("howWeUseDesc")}</p>
            </section>

            {/* Data Protection */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 font-fraunces">{t("dataProtection")}</h2>
              <p className="text-gray-700 leading-relaxed">{t("dataProtectionDesc")}</p>
            </section>

            {/* Cookie Consent / Analytics Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 font-fraunces">{t("cookiesAnalytics")}</h2>
              <p className="text-gray-700 leading-relaxed">{t("cookiesAnalyticsDesc")}</p>
            </section>

            {/* Controller */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 font-fraunces">{t("controller")}</h2>
              <p className="text-gray-700 leading-relaxed">{t("controllerDesc")}</p>
            </section>
            {/* Legal Basis */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 font-fraunces">{t("legalBasis")}</h2>
              <p className="text-gray-700 leading-relaxed">{t("legalBasisDesc")}</p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 font-fraunces">{t("rights")}</h2>
              <p className="text-gray-700 leading-relaxed">{t("rightsDesc")}</p>
              <ul className="text-gray-700 leading-relaxed list-disc pl-6 space-y-1">
                <li>{t("rightInformed")}</li>
                <li>{t("rightAccess")}</li>
                <li>{t("rightRectification")}</li>
                <li>{t("rightErasure")}</li>
                <li>{t("rightRestrict")}</li>
                <li>{t("rightPortability")}</li>
                <li>{t("rightObject")}</li>
                <li>{t("rightAutomated")}</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-2">{t("rightsHow")}</p>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 font-fraunces">{t("retention")}</h2>
              <p className="text-gray-700 leading-relaxed">{t("retentionDesc")}</p>
            </section>

            {/* Third-Party Disclosure */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 font-fraunces">{t("thirdParty")}</h2>
              <p className="text-gray-700 leading-relaxed">{t("thirdPartyDesc")}</p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 font-fraunces">{t("children")}</h2>
              <p className="text-gray-700 leading-relaxed">{t("childrenDesc")}</p>
            </section>

            {/* Contact */}
            <section className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 font-fraunces">{t("contact")}</h2>
              <p className="text-gray-700 leading-relaxed">
                {t("contactDesc")}{" "}
                <a href="mailto:info@galaxshi.com" className="text-amber-600 hover:text-amber-700 underline">
                  Blat Vodka
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }) {
  const messages = (await import(`@/../messages/${params.locale}.json`)).default;
  const title = messages.Privacy?.pageTitle || "Privacy Policy";
  const description = messages.Privacy?.pageDescription || "Learn how Blat Vodka collects, uses, and protects your personal data in accordance with GDPR regulations.";

  return {
    title,
    description,
  };
}
