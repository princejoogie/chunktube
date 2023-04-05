const path = require("path");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["plugin:react/recommended", "next/core-web-vitals", "custom"],
  plugins: ["react"],
  parserOptions: {
    project: path.join(__dirname, "tsconfig.json"),
  },
  rules: {
    "react/react-in-jsx-scope": "off",
  },
};
