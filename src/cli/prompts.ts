/* eslint-disable @typescript-eslint/no-unsafe-call */
import * as inquirer from "@inquirer/prompts";

export const promptProjectName = async (): Promise<string> => {
  const name = await inquirer.input({
    message: "What is the name of the project?",
    transformer: (input: string) => {
      return input.toLowerCase().replace(/\s+/g, "-");
    },
  });

  return name.toLowerCase().replace(/\s+/g, "-");
};
