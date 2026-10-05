import next from "eslint-config-next";

/**
 * Next.js 16 ships a native flat ESLint config, so the legacy FlatCompat bridge
 * is not used — it crashes on the config graph under ESLint 9.
 */
const eslintConfig = [
  ...next,
  {
    ignores: [".next/**", "node_modules/**", ".work/**", "next-env.d.ts"],
  },
];

export default eslintConfig;