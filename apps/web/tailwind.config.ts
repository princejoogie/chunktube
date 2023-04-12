import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import colors from "tailwindcss/colors";

import baseConfig from "tw-config";

const config: Config = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        gray: colors.neutral,
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  presets: [baseConfig],
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")],
};

export default config;
