import {
  promptPackageManager,
  promptProjectName,
  promptWithTest,
  promptWithType,
} from "./prompts.js";

export const runCli = async () => {
  await promptProjectName();
  await promptWithType();
  await promptWithTest();
  await promptPackageManager();
};
