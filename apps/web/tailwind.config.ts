import type { Config } from "tailwindcss";
import baseConfig from "tw-config";

const config: Config = {
  content: ["./src/**/*.tsx"],
  presets: [baseConfig],
};

export default config;
