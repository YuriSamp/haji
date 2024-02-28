import { execSync } from "child_process";


export const gitInit = async () => {
  execSync("git init", { stdio: "ignore" });
  execSync("git add -A", { stdio: "ignore" });
  execSync('git commit -m "Initial commit from Haji"', {
    stdio: "ignore",
  });
};
