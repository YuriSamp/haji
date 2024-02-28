#!/usr/bin/env node
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { chdir } from "process";
import chalk from "chalk";

import { runCli } from "./cli/index.js";
import { runStep } from "./cli/step.js";
import { addConfigFiles } from "./config/index.js";
import { handleDepencies } from "./deps/handle-dependecies.js";
import { getFullPath, packageManagerCommands } from "./helpers/index.js";
import { overridePackageJson } from './helpers/handle-package-json.js';

const main = async () => {
  const initialCwd = process.cwd();
  const userChoices = await runCli();
  const fullPath = getFullPath(userChoices.projectName);
  const relativePath = path.relative(process.cwd(), fullPath);
  const { devDeps, prodDeps } = handleDepencies(userChoices);
  const pkgManagerCommands = packageManagerCommands[userChoices.packageManager];

  console.log(
    `Creating project ${chalk.blue(userChoices.projectName)} at ./${relativePath}`
  );

  await mkdir(fullPath, { recursive: true });
  chdir(fullPath);

  await runStep({
    command: "git init",
    description: "Initializing git repository...",
  });

  try {
    await runStep({
      command: pkgManagerCommands.init,
      description: `Initializing ${userChoices.packageManager}...`,
    });
  } catch (err) {
    if (err instanceof Error && "code" in err) {
      if (err.code === 127) {
        console.error(
          chalk.red(
            `Package manager ${userChoices.packageManager} not found. Please install it and try again.`
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
    exec: async () => overridePackageJson(path, fullPath)
  });

  await runStep({
    description: "Setting up linting...",
    exec: async () => addConfigFiles(userChoices.withTests),
  });

  await runStep({
    command: `${pkgManagerCommands.install} ${devDeps.join(" ")} -D && ${pkgManagerCommands.install} ${prodDeps.join(" ")} `,
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
