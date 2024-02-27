import { writeFile } from "fs/promises";

export const addTestConfig = async () => {
  const deps = ["vitest", "vite-tsconfig-paths"];

  const testConfig = `
  import tsconfigPaths from 'vite-tsconfig-paths';
  import { defineConfig } from 'vitest/config';

  export default defineConfig({
    test: {},
    plugins: [tsconfigPaths()] 
  });
  `;

  await writeFile("vitest.config.ts", testConfig);

  return deps;
};

//ADICIONAR O "test:watch": "vitest" E O  "test:coverage": "vitest run --coverage"
