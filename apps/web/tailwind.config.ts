import baseConfig from "@joogie/tailwind-config";

import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [baseConfig],
  important: true,
} satisfies Config;

