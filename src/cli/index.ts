import chalk from "chalk";

import {
  checkIfFolderIsEmpty,
  getFullPath,
  isProjectNameValid,
} from "../helpers/index.js";
import {
  promptPackageManager,
  promptProjectName,
  promptWithTest,
  promptWithType,
} from "./prompts.js";

export const runCli = async () => {
  const projectName = await promptProjectName();
  const fullPath = getFullPath(projectName);
  const isEmpty = await checkIfFolderIsEmpty(fullPath);

  if (!isProjectNameValid(projectName)) {
    console.error(
      `❌ ${chalk.red("Invalid project name! It should contains only letters, numbers, dashes and underscores.")}`
    );
    process.exit(0);
  }

  if (!isEmpty) {
    console.error(`❌ ${chalk.red("Folder is not empty!")}`);
    process.exit(0);
  }

  const projectType = await promptWithType();
  const withTests = await promptWithTest();
  const packageManager = await promptPackageManager();

  return { projectName, projectType, withTests, packageManager };
};
