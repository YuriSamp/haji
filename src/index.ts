#!/usr/bin/env node
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { chdir } from "process";
import chalk from "chalk";

import { runCli } from "./cli/index.js";
import { runStep } from "./cli/step.js";
import { addConfigFiles } from "./config/index.js";
import { handleDepencies } from "./deps/handle-dependecies.js";
import { gitInit } from "./helpers/git.js";
import {
  initPackageJson,
  overridePackageJson,
} from "./helpers/handle-package-json.js";
import { getFullPath, packageManagerCommands } from "./helpers/index.js";

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
    description: `Initializing ${userChoices.packageManager}...`,
    exec: async () =>
      await initPackageJson(
        pkgManagerCommands.init,
        userChoices.packageManager
      ),
  });

  await runStep({
    description: "Creating src/index.ts...",
    exec: async () => {
      await mkdir(path.join(fullPath, "src"));
      await writeFile(path.join(fullPath, "src", "index.ts"), "");
    },
  });

  await runStep({
    description: "Creating package.json",
    exec: async () => overridePackageJson(path, fullPath),
  });

  await runStep({
    description: "Setting up linting...",
    exec: async () => addConfigFiles(userChoices.withTests),
  });

  await runStep({
    command: `${pkgManagerCommands.install} -D ${devDeps.join(" ")}  && ${pkgManagerCommands.install} ${prodDeps.join(" ")} `,
    description: "Installing dependencies...",
  });

  await runStep({
    description: "Initializing git repository...",
    exec: () => gitInit(),
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
