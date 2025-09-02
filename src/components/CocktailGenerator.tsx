"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";

export default function CocktailGenerator() {
  const t = useTranslations("CocktailsPage");
  const locale = useLocale();
  const [cocktailInput, setCocktailInput] = useState<string>("");
  const [cocktailOutput, setCocktailOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const showCustomAlert = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const generateCocktail = async () => {
    if (!cocktailInput.trim()) {
      showCustomAlert(t("describe"));
      return;
    }

    setIsLoading(true);
    setCocktailOutput(null);
    setError(null);

    try {
      const languageMap = {
        en: "English",
        es: "Spanish (español)",
        fr: "French",
      };
      const language = languageMap[locale] || "English";
      const prompt = `Cocktail with Blat Vodka: ${cocktailInput}. Format in Markdown: # Name, ## Ingredients, ## Instructions. No intro, no acknowledgments. Be concise. Respond in ${language}.`;

      const response = await fetch(`/api/gemini-ai-model`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: prompt }),
      });
      const data = await response.json();

      if (data.summary) {
        setCocktailOutput(data.summary);
      } else {
        showCustomAlert(t("tryAgain"));
      }
    } catch (err) {
      showCustomAlert(t("error1"));
      showCustomAlert(err);
    } finally {
      setIsLoading(false);
    }
  };

  const parseMarkdown = (markdown: string): string => {
    let html = markdown
      .replace(/^#\s(.+)$/gm, '<h3 class="text-2xl font-bold mb-3 text-amber-600">$1</h3>')
      .replace(/^##\s(.+)$/gm, '<h4 class="text-xl font-semibold mb-2 text-gray-800">$1</h4>')
      .replace(/^\*\s(.+)$/gm, '<li class="mb-1">$1</li>')
      .replace(/^\d\.\s(.+)$/gm, '<li class="mb-1">$1</li>')
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>");

    const listRegex = /(?:<li[^>]*>.+<\/li>\s*)+/g;
    html = html.replace(listRegex, (match) => {
      if (match.trim().startsWith('<li class="mb-1">')) {
        return match.includes("1.") ? `<ol class="list-decimal list-inside pl-4 mb-4">${match}</ol>` : `<ul class="list-disc list-inside pl-4 mb-4">${match}</ul>`;
      }
      return match;
    });

    html = html
      .split("\n")
      .map((line) => {
        if (line.trim() !== "" && !line.startsWith("<h") && !line.startsWith("<ul") && !line.startsWith("<ol")) {
          return `<p class="mb-2">${line}</p>`;
        }
        return line;
      })
      .join("");

    return html;
  };

  return (
    <div className="Card text-center max-w-3xl mb-8 py-4 lg:py-12 px-4 sm:px-6 lg:px-8 backdrop-blur-sm bg-white/60 rounded-lg shadow-lg lg:shadow-none lg:bg-transparent shadow-amber-200">
      <h1 className="text-2xl lg:text-4xl font-extrabold text-center text-amber-700 mb-8">{t("title")}</h1>
      <p className="text-md text-gray-700 text-center mb-10">{t("description")}</p>

      <div className="mb-8">
        <label htmlFor="cocktailInput" className="block lg:none text-md lg:text-lg font-semibold text-gray-800 mb-3">
          {t("question1")}
        </label>
        <textarea
          id="cocktailInput"
          className="w-full text-sm p-4 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-gray-700 placeholder-gray-500 transition-all duration-200 resize-y"
          rows={4}
          placeholder={t("placeholder")}
          value={cocktailInput}
          onChange={(e) => setCocktailInput(e.target.value)}
          disabled={isLoading}
        ></textarea>
      </div>

      <button
        onClick={generateCocktail}
        className="w-full flex items-center justify-center bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-full text-md transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {t("loadingBtn")}
          </>
        ) : (
          t("textBtn")
        )}
      </button>

      {error && (
        <div className="mt-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
          <strong className="font-bold">¡Error!</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}

      {cocktailOutput && (
        <div className="mt-12 p-8 bg-white border border-amber-200 rounded-xl shadow-lg text-left">
          <div className="text-gray-900 leading-relaxed" dangerouslySetInnerHTML={{ __html: parseMarkdown(cocktailOutput) }}></div>
        </div>
      )}
      <div className="mt-8 text-sm text-gray-500">
        <small>{t("disclaimer")}</small>
      </div>
    </div>
  );
}
