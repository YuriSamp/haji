import { promptProjectName } from "./prompts.js";

export const runCli = async () => {
  await promptProjectName();
};
