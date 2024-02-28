import { readFile, writeFile } from "fs/promises";
import { type PlatformPath } from "path";
import chalk from "chalk";

import { asyncExec } from "./index.js";

const loadJSON = async (path: string): Promise<Record<string, unknown>> =>
  JSON.parse(await readFile(path, { encoding: "utf-8" })) as Record<
    string,
    unknown
  >;

export const initPackageJson = async (
  pkgManagerCommand: string,
  pkgManagerName: string
) => {
  try {
    await asyncExec(pkgManagerCommand);
  } catch (err) {
    if (err instanceof Error && "code" in err) {
      if (err.code === 127) {
        console.error(
          chalk.red(
            `Package manager ${pkgManagerName} not found. Please install it and try again.`
          )
        );
        process.exit(1);
      }
    }
  }
};

export const overridePackageJson = async (
  path: PlatformPath,
  fullPath: string
) => {
  const packageJson = await loadJSON(path.join(fullPath, "package.json"));

  (packageJson.type = "module"),
    (packageJson.scripts = {
      dev: "tsx --watch src/index.ts",
      build: "tsup",
      start: "node dist/index.js",
      test: "vitest",
      "test:coverage": "vitest run --coverage",
    });

  (packageJson.tsup = {
    clean: true,
    entry: ["src/index.ts"],
    format: ["esm"],
    minify: false,
    target: "esnext",
    outDir: "dist",
  }),
    await writeFile(
      path.join(fullPath, "package.json"),
      JSON.stringify(packageJson, null, 2)
    );
};
