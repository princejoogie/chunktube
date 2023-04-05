import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  minify: true,
  sourcemap: true,
  entry: ["./index.ts"],
  format: ["esm", "cjs"],
});
