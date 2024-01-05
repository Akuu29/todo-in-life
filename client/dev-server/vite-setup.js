import { createServer } from "vite";

let viteInstance;

async function setupVite() {
  viteInstance = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base: "/"
  });

  return viteInstance;
}

export { viteInstance, setupVite };