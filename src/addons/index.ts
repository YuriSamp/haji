import { writeFile } from "fs/promises";

export const addConfigFiles = async (withTest: boolean) => {
  const prettierConfigContent = `
  const config = {
    arrowParens: "always",
    printWidth: 80,
    singleQuote: false,
    jsxSingleQuote: false,
    semi: true,
    tabWidth: 2,
    plugins: ["@ianvs/prettier-plugin-sort-imports"],
    tailwindConfig: "./template/extras/config/tailwind.config.ts",
    trailingComma: "es5",
    importOrder: ["<THIRD_PARTY_MODULES>", "", "^~/", "^[.][.]/", "^[.]/"],
    importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
    importOrderTypeScriptVersion: "4.4.0",
  };
  
  export default config;
  `;

  const eslintConfigContent = `/** @type {import("eslint").Linter.Config} */
  const config = {
      root: true,
      parser: "@typescript-eslint/parser",
      plugins: ["isaacscript", "import"],
      extends: [
        "plugin:@typescript-eslint/recommended-type-checked",
        "plugin:@typescript-eslint/stylistic-type-checked",
        "plugin:prettier/recommended",
      ],
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        tsconfigRootDir: __dirname,
        project: [
          "./tsconfig.json",
        ],
      },
      rules: {
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-unused-vars": [
          "error",
          { argsIgnorePattern: "^_", destructuredArrayIgnorePattern: "^_" },
        ],
        "@typescript-eslint/consistent-type-imports": [
          "error",
          { prefer: "type-imports", fixStyle: "inline-type-imports" },
        ],
        "import/consistent-type-specifier-style": ["error", "prefer-inline"],
    
        "isaacscript/complete-sentences-jsdoc": "warn",
        "isaacscript/format-jsdoc-comments": "warn",
    
        "@typescript-eslint/no-confusing-void-expression": "off",
        "@typescript-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/prefer-nullish-coalescing": "off",
        "@typescript-eslint/consistent-type-definitions" : "off",
        '@typescript-eslint/no-unsafe-assignment' : "off",
        "@typescript-eslint/no-unsafe-return" : 'off',
        "@typescript-eslint/no-unsafe-call" : "off",
      },
    };
    
    module.exports = config;`;

  const gitignoreConfigContent = `
  node_modules
  
  # Logs
  logs
  *.log
   
  # local env files
  .env
  .env.*
  !.env.example

  # testing
  /coverage

  # production
  dist

  # misc
  *.pem`;

  const tsconfigContent = `
  {
    "compilerOptions": {
      "esModuleInterop": true,
      "skipLibCheck": true,
      "target": "es2022",
      "allowJs": true,
      "resolveJsonModule": true,
      "moduleDetection": "force",
      "isolatedModules": true,
      "strict": true,
      "noUncheckedIndexedAccess": true,
      "moduleResolution": "NodeNext",
      "module": "NodeNext",
      "outDir": "dist",
      "sourceMap": true,
      "lib": ["es2022"],
      "baseUrl": ".",
      "paths": {
        "@/*": ["./src/*"],
      },
    },
  }  
  `;

  if (withTest) {
    const testConfig = `
    import tsconfigPaths from 'vite-tsconfig-paths';
    import { defineConfig } from 'vitest/config';
  
    export default defineConfig({
      test: {},
      plugins: [tsconfigPaths()] 
    });
    `;

    await writeFile("vitest.config.ts", testConfig);
  }

  await writeFile(".gitignore", gitignoreConfigContent);
  await writeFile("prettier.config.mjs", prettierConfigContent);
  await writeFile(".eslintrc.cjs", eslintConfigContent);
  await writeFile("tsconfig.json", tsconfigContent);
};
