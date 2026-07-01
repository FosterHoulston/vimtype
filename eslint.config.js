import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import importX from "eslint-plugin-import-x";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  // Don't lint build output or vendored code.
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "client/.react-router/**",
    ],
  },

  // Shared rules for every source file, JS and TS alike.
  {
    files: ["**/*.{js,ts,tsx}"],
    plugins: {
      "import-x": importX,
    },
    rules: {
      "prefer-const": "warn",
      "no-var": "error",
      "import-x/order": [
        "warn",
        {
          // external → internal → relative, per CODING_STANDARDS §3.
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },

  // Plain JS (config files, this file). TS handles undefined refs itself,
  // so no-undef only makes sense here.
  {
    files: ["**/*.js"],
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
    },
  },

  // TypeScript / React source.
  {
    files: ["**/*.{ts,tsx}"],
    extends: [tseslint.configs.recommended],
    rules: {
      "no-undef": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/naming-convention": [
        "warn",
        { selector: "default", format: ["camelCase"], leadingUnderscore: "allow" },
        {
          // camelCase for locals, PascalCase for components, UPPER_CASE for constants.
          selector: "variable",
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
          leadingUnderscore: "allow",
        },
        { selector: "function", format: ["camelCase", "PascalCase"] },
        { selector: "typeLike", format: ["PascalCase"] },
        { selector: "enumMember", format: ["PascalCase", "UPPER_CASE"] },
        // Don't police import names or externally-shaped object keys (JSON/API).
        { selector: "import", format: null },
        { selector: "objectLiteralProperty", format: null },
      ],
    },
  },

  // React hooks rules (rules-of-hooks + exhaustive-deps) for components.
  {
    files: ["**/*.tsx"],
    ...reactHooks.configs.flat["recommended-latest"],
  },

  // Environment globals so no-undef / TS know what's ambient.
  {
    files: ["client/**/*.{js,ts,tsx}"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["server/**/*.{js,ts}"],
    languageOptions: { globals: globals.node },
  },

  // Must stay last: turns off rules that fight Prettier.
  eslintConfigPrettier,
]);
