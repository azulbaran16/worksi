/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Trustworthy, professional recruitment palette
        brand: {
          50: "#eef6ff",
          100: "#d9eaff",
          200: "#bcd9ff",
          300: "#8ec0ff",
          400: "#599dff",
          500: "#3377f6",
          600: "#1f57db",
          700: "#1a44b0",
          800: "#1b3b8c",
          900: "#0f1f4b", // deep navy
        },
        accent: {
          400: "#22d3a8",
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
