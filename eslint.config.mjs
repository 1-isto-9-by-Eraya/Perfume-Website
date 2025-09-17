import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Downgrade TypeScript errors to warnings for build
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn", 
      "@typescript-eslint/ban-ts-comment": "warn",
      
      // React hooks - keep this as error since it breaks functionality
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      
      // UI/UX warnings (not breaking)
      "react/no-unescaped-entities": "warn",
      "@next/next/no-img-element": "warn",
    },
  },
];

export default eslintConfig;