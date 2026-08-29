import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
  globalIgnores(["dist", "studio"]),
  {
    files: ["{src,scripts}/**/*.{ts,tsx}", "vite.config.ts"],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    rules: {
      // Match the project's TypeScript settings while legacy code is migrated.
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-empty": ["error", { allowEmptyCatch: true }],
      "no-useless-assignment": "off",
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      // Existing hook dependencies need a separate, behavior-sensitive cleanup.
      "react-hooks/exhaustive-deps": "off",
    },
  },
  {
    files: ["scripts/**/*.ts", "vite.config.ts"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
    },
  },
);
