import { execSync } from "child_process";
import { rm } from "fs/promises";
import path from "path";

export const gitInit = async (root: string) => {
  let didInit = false;
  try {
    execSync("git init", { stdio: "ignore" });
    didInit = true;

    execSync("git add -A", { stdio: "ignore" });
    execSync('git commit -m "Initial commit from Haji"', {
      stdio: "ignore",
    });
  } catch (e) {
    if (didInit) {
      try {
        await rm(path.join(root, ".git"), { recursive: true, force: true });
      } catch (_) {}
    }
  }
};
