/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["standard-with-typescript", "prettier"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
    "promise/param-names": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/strict-boolean-expressions": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/promise-function-async": "off",
    "@typescript-eslint/prefer-nullish-coalescing": "off",
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/no-misused-promises": "off",
    "no-async-promise-executor": "off",
  },
};
