/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["standard-with-typescript", "prettier"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/strict-boolean-expressions": "off",
  },
};
