import * as inquirer from "@inquirer/prompts";

export const promptProjectName = async () => {
  const name = await inquirer.input({
    message: "What is the name of the project?",
    transformer: (input: string) => {
      return input.toLowerCase().replace(/\s+/g, "-");
    },
  });

  return name.toLowerCase().replace(/\s+/g, "-");
};

export const promptWithTest = async () => {
  const withTest = await inquirer.confirm({
    message: "Do you wish to include test boilerplate?",
    default: true,
  });

  return withTest;
};

export const promptWithType = async () => {
  const projectType = await inquirer.select({
    message: "Wich type of project you want?",
    default: "web server",
    choices: [
      {
        name: "cli",
        value: "cli",
      },
      {
        name: "web server",
        value: "web server",
      },
      {
        name: "standalone",
        value: "standalone",
      },
    ],
  });
  return projectType;
};

export const promptPackageManager = async () => {
  const packageManager = await inquirer.select({
    message: "Which package manager do you want to use?",
    default: "pnpm",
    choices: [
      {
        name: "pnpm",
        value: "pnpm",
      },
      {
        name: "yarn",
        value: "yarn",
      },
      {
        name: "npm",
        value: "npm",
      },
    ],
  });

  return packageManager;
};
