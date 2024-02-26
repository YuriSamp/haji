import { runCli } from "./cli/index.js";

const main = async () => {
  await runCli();
};

main().catch((err) => {
  console.log(err);
  process.exit(1);
});
