import type { Config } from "tailwindcss";

export default {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        fraunces: ["var(--font-fraunces)"], // Define a custom font family for Fraunces
        poppins: ["var(--font-poppins)"], // Define a custom font family for Poppins
      },
    },
  },
  plugins: [],
} satisfies Config;
