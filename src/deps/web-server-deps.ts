export const webServerDeps = () => {
  const developDeps = [
    "@types/koa",
    "@types/koa-bodyparser",
    "@types/koa-router",
    "@types/koa__cors",
  ];
  const prodDeps = ["@koa/cors", "koa", "koa-bodyparser", "koa-router"];
  return { developDeps, prodDeps };
};
