import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme - Navy blues
        navy: {
          darkest: "#0a1628",
          dark: "#0f172a",
          medium: "#1e293b",
        },
        // Slate greys
        slate: {
          dark: "#334155",
          medium: "#475569",
          light: "#64748b",
          lighter: "#94a3b8",
        },
        // Electric blues
        electric: {
          blue: "#3b82f6",
          light: "#60a5fa",
          dark: "#2563eb",
        },
        // Text colors
        text: {
          primary: "#f8fafc",
          secondary: "#cbd5e1",
          muted: "#94a3b8",
        },
        // Semantic mappings for compatibility
        background: { DEFAULT: "#0a1628", secondary: "#0f172a" },
        foreground: { DEFAULT: "#f8fafc", muted: "#94a3b8" },
        accent: { DEFAULT: "#3b82f6", light: "#60a5fa", dark: "#2563eb" },
        border: "#334155",
        card: "#0f172a",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grid-pattern": `radial-gradient(circle, rgba(59, 130, 246, 0.2) 2px, transparent 2px)`,
        "mesh-gradient": `radial-gradient(at 50% 50%, rgba(59, 130, 246, 0.15) 0px, transparent 60%),
                          radial-gradient(at 100% 0%, rgba(37, 99, 235, 0.12) 0px, transparent 50%),
                          radial-gradient(at 0% 100%, rgba(59, 130, 246, 0.10) 0px, transparent 50%)`,
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".mask-gradient-b": {
          maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
        },
      });
    }),
  ],
};

export default config;
