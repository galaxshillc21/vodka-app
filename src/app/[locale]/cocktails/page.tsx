"use client"; // Marca este componente como un Client Component en Next.js

import React, { useState } from "react";
import { useTranslations } from "next-intl"; // Import useTranslations

/**
 * Fetches the response from the Gemini AI model API.
 *
 * @returns {Promise<Object | null>} - A promise that resolves with the response
 * data from the API, or null if there is an error.
 */

const CocktailsPage: React.FC = () => {
  const t = useTranslations("CocktailsPage");
  const [cocktailInput, setCocktailInput] = useState<string>("");
  const [cocktailOutput, setCocktailOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Función para mostrar alertas personalizadas en el navegador (no usar alert())
  const showCustomAlert = (message: string) => {
    // Para Next.js, en un entorno de desarrollo real, usarías un componente modal
    // o una librería de toasts. Por ahora, un simple console.error es suficiente.
    // En un entorno de Canvas, podríamos mostrar un div temporal si fuera necesario,
    // pero el enfoque principal es la funcionalidad de la API.
    console.error("Alerta:", message);
    setError(message); // Mostrar el error en la interfaz de usuario
    setTimeout(() => setError(null), 5000); // Ocultar el error después de 5 segundos
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
      const prompt = `Receta breve de cóctel con Blat Vodka: "${cocktailInput}". Solo nombre, ingredientes y pasos. Responde en Markdown usa HTML headings. Sé conciso.`;
      const response = await fetch(`/api/gemini-ai-model`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: prompt }), // el campo que espera tu API
      });
      const data = await response.json();

      if (data.summary) {
        setCocktailOutput(data.summary);
      } else {
        showCustomAlert(t("tryAgain"));
      }
    } catch (err) {
      console.error(t("error1"), err);
      showCustomAlert(t("error1"));
    } finally {
      setIsLoading(false);
    }
  };

  // Pequeña función para parsear Markdown básico a HTML
  const parseMarkdown = (markdown: string): string => {
    let html = markdown
      .replace(/^#\s(.+)$/gm, '<h3 class="text-2xl font-bold mb-3 text-amber-600">$1</h3>') // Títulos H3 para cóctel
      .replace(/^##\s(.+)$/gm, '<h4 class="text-xl font-semibold mb-2 text-gray-800">$1</h4>') // Títulos H4 para secciones (ingredientes, instrucciones)
      .replace(/^\*\s(.+)$/gm, '<li class="mb-1">$1</li>') // Listas sin ordenar
      .replace(/^\d\.\s(.+)$/gm, '<li class="mb-1">$1</li>') // Listas ordenadas
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") // Negrita
      .replace(/\*(.+?)\*/g, "<em>$1</em>"); // Cursiva

    // Envuelve las listas en ul/ol
    const listRegex = /(?:<li[^>]*>.+<\/li>\s*)+/g;
    html = html.replace(listRegex, (match) => {
      if (match.trim().startsWith('<li class="mb-1">')) {
        // Decide si es una lista ordenada o no ordenada
        return match.includes("1.") ? `<ol class="list-decimal list-inside pl-4 mb-4">${match}</ol>` : `<ul class="list-disc list-inside pl-4 mb-4">${match}</ul`;
      }
      return match;
    });

    // Convierte párrafos
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
    <div className="min-h-screen pt-[80px] bg-gradient-to-br from-amber-50 to-white flex flex-col items-center py-4 lg:py-12 px-4 sm:px-6 lg:px-8 justify-start lg:justify-center">
      <div className="max-w-3xl w-full bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-amber-700 mb-8">{t("title")}</h1>
        <p className="text-lg text-gray-700 text-center mb-10">{t("description")}</p>

        <div className="mb-8">
          <label htmlFor="cocktailInput" className="block text-xl font-semibold text-gray-800 mb-3">
            {t("question1")}
          </label>
          <textarea
            id="cocktailInput"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-gray-700 placeholder-gray-500 transition-all duration-200 resize-y"
            rows={5}
            placeholder={t("placeholder")}
            value={cocktailInput}
            onChange={(e) => setCocktailInput(e.target.value)}
            disabled={isLoading}
          ></textarea>
        </div>

        <button
          onClick={generateCocktail}
          className="w-full flex items-center justify-center bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50"
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
          <div className="mt-12 p-8 bg-white border border-amber-200 rounded-xl shadow-lg">
            <div className="text-gray-900 leading-relaxed" dangerouslySetInnerHTML={{ __html: parseMarkdown(cocktailOutput) }}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CocktailsPage;
