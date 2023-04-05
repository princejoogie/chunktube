const path = require("path");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["custom"],
  parserOptions: {
    project: path.join(__dirname, "tsconfig.json"),
  },
  rules: {},
};
