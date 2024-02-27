#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { chdir } from "process";
import chalk from "chalk";

import { addConfigFiles } from "./addons/index.js";
import { runCli } from "./cli/index.js";
import { runStep } from "./cli/step.js";
import { baseDeps } from "./deps/baseDeps.js";
import { cliAppDeps } from "./deps/cli/index.js";
import { addTestDeps } from "./deps/test/index.js";
import { getFullPath, packageManagerCommands } from "./helpers/index.js";

const loadJSON = async (path: string): Promise<Record<string, unknown>> =>
  JSON.parse(await readFile(path, { encoding: "utf-8" })) as Record<
    string,
    unknown
  >;

const main = async () => {
  const deps = baseDeps;

  const initialCwd = process.cwd();
  const { projectName, packageManager, projectType, withTests } =
    await runCli();

  const fullPath = getFullPath(projectName);
  const relativePath = path.relative(process.cwd(), fullPath);

  console.log(
    `Creating project ${chalk.blue(projectName)} at ./${relativePath}`
  );

  await mkdir(fullPath, { recursive: true });
  chdir(fullPath);

  const pkgManagerCommands = packageManagerCommands[packageManager];

  await runStep({
    command: "git init",
    description: "Initializing git repository...",
  });

  try {
    await runStep({
      command: pkgManagerCommands.init,
      description: `Initializing ${packageManager}...`,
    });
  } catch (err) {
    if (err instanceof Error && "code" in err) {
      if (err.code === 127) {
        console.error(
          chalk.red(
            `Package manager ${packageManager} not found. Please install it and try again.`
          )
        );
        process.exit(1);
      }
    }
  }

  await runStep({
    description: "Creating src/index.ts...",
    exec: async () => {
      await mkdir(path.join(fullPath, "src"));
      await writeFile(path.join(fullPath, "src", "index.ts"), "");
    },
  });

  await runStep({
    description: "Creating package.json",
    exec: async () => {
      const packageJson = await loadJSON(path.join(fullPath, "package.json"));

      packageJson.scripts = {
        dev: "tsx --watch src/index.ts",
        build: "tsup",
        start: "node dist/index.js",
      };

      await writeFile(
        path.join(fullPath, "package.json"),
        JSON.stringify(packageJson, null, 2)
      );
    },
  });

  await runStep({
    description: "Setting up linting...",
    exec: async () => addConfigFiles(),
  });

  if (withTests) {
    const { developDeps } = await addTestDeps();

    developDeps.forEach((testDeps) => {
      deps.push(testDeps);
    });
  }

  await runStep({
    command: `${pkgManagerCommands.install} ${baseDeps.join(" ")} -D`,
    description: "Installing dependencies...",
  });

  const runCdText = `Run ${chalk.blue(`cd ${relativePath}`)} to start!`;
  const wasProjectCreatedInCurrentFolder = fullPath === initialCwd;

  console.log(
    `\n🎉 Everything ready! ${wasProjectCreatedInCurrentFolder ? "" : runCdText}`
  );
};

main().catch((err) => {
  console.log(err);
  process.exit(1);
});
