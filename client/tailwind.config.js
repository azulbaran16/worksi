/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // WorkSi brand palette (from Instagram): azure blue + gold.
        brand: {
          50: "#eef5fc",
          100: "#d8e8f7",
          200: "#b6d2ee",
          300: "#88b4e1",
          400: "#5491cf",
          500: "#2f6fb5", // primary azure
          600: "#285d9b",
          700: "#224b7c", // deep blue bars
          800: "#1d3e64",
          900: "#142d49", // deep navy-blue
        },
        // Gold accent — used for CTAs/highlights. Pair with dark text.
        accent: {
          50: "#fef6e0",
          100: "#fde9b8",
          200: "#fbd97f",
          300: "#f7c948",
          400: "#f4bb33",
          500: "#f2b632",
          600: "#d99a1e",
          700: "#b87e15",
        },
        // Green — reserved for success / positive status (checks, "hired", toggles).
        success: {
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
        },
        ink: "#0f172a",
        muted: "#475569",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        display: ["'Plus Jakarta Sans'", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(15,31,75,0.06), 0 10px 30px -12px rgba(15,31,75,0.12)",
        lift: "0 12px 40px -12px rgba(15,31,75,0.28)",
      },
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};
