import { type UserChoices } from "@/cli/index.js";

import { baseDeps } from "./base-deps.js";
import { cliDeps } from "./cli-deps.js";
import { testDeps } from "./test-deps.js";
import { webServerDeps } from "./web-server-deps.js";

export const handleDepencies = (userChoices: UserChoices) => {
  const devDeps = baseDeps;
  const prodDeps: string[] = [];

  if (userChoices.withTests) {
    const { developDeps } = testDeps();

    developDeps.forEach((deps) => {
      devDeps.push(deps);
    });
  }

  if (userChoices.projectType === "web server") {
    const { developDeps, prodDeps: webServeProdDeps } = webServerDeps();

    developDeps.forEach((deps) => {
      devDeps.push(deps);
    });

    webServeProdDeps.forEach((deps) => {
      prodDeps.push(deps);
    });
  }

  if (userChoices.projectType === "cli") {
    const { prodDeps: cliProdDeps } = cliDeps();

    cliProdDeps.forEach((deps) => {
      prodDeps.push(deps);
    });
  }

  return { prodDeps, devDeps };
};
