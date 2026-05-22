import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Brand color palette - BarmenTech Seguros
        primary: {
          DEFAULT: "#00234B",      // Primary color (azul marino oscuro)
          50: "#E6EBF2",
          100: "#CCDAE5",
          200: "#99B5CB",
          300: "#6690B1",
          400: "#336B97",
          500: "#00234B",           // Main primary
          600: "#001C3C",
          700: "#00152D",
          800: "#000E1E",
          900: "#00070F",
          hover: "#001C3C",         // Para estados hover
          active: "#00152D",        // Para estados active/pressed
        },
        secondary: {
          DEFAULT: "#00C853",       // Secondary color (verde brillante)
          50: "#E6F9EE",
          100: "#CCF3DD",
          200: "#99E7BB",
          300: "#66DB99",
          400: "#33CF77",
          500: "#00C853",           // Main secondary
          600: "#00A043",
          700: "#007832",
          800: "#005022",
          900: "#002811",
          hover: "#00A043",         // Para estados hover
          active: "#007832",        // Para estados active/pressed
        },
        tertiary: {
          DEFAULT: "#F8FAFC",       // Tertiary color (gris muy claro)
          50: "#FFFFFF",
          100: "#F8FAFC",           // Main tertiary
          200: "#F1F5F9",
          300: "#E2E8F0",
          400: "#CBD5E1",
          500: "#94A3B8",
        },
        neutral: {
          DEFAULT: "#64748B",       // Neutral color (gris medio)
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",           // Main neutral
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
        // Colores de utilidad
        background: "#F8FAFC",      // Fondo general (tertiary)
        surface: "#FFFFFF",         // Superficies de tarjetas/modales
        error: "#DC2626",           // Errores
        warning: "#F59E0B",         // Advertencias
        success: "#00C853",         // Éxito (usa secondary)
        info: "#00234B",            // Información (usa primary)
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      spacing: {
        "margin-desktop": "48px",
        "unit": "8px",
        "gutter": "24px",
        "container-max": "1280px",
        "margin-mobile": "16px"
      },
      fontFamily: {
        "label-md": ["Inter", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"],
        "headline-xl": ["Manrope", "sans-serif"],
        "headline-md": ["Manrope", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "headline-lg": ["Manrope", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        display: ["Manrope", "sans-serif"]
      },
      fontSize: {
        "label-md": ["14px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "600" }],
        "label-sm": ["12px", { lineHeight: "14px", fontWeight: "500" }],
        "headline-xl": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "600" }]
      }
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

export default config;
