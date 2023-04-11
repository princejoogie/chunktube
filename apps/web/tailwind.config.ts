import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
import baseConfig from "tw-config";

const config: Config = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        gray: colors.neutral,
      },
    },
  },
  presets: [baseConfig],
  plugins: [require("@tailwindcss/typography")],
};

export default config;
