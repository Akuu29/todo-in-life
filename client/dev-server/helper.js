import fs from "node:fs/promises";
import { viteInstance } from "./vite-setup.js";

async function createHtmlFromTemplate(url, templatePath, ssrLoadModulePath) {
  let template = await fs.readFile(templatePath, "utf-8");
  template = await viteInstance.transformIndexHtml(url, template);

  const render = (await viteInstance.ssrLoadModule(ssrLoadModulePath)).render;
  const rendered = await render(url);

  const html = template
    .replace(`<!--app-head-->`, rendered.head ?? "")
    .replace(`<!--app-html-->`, rendered.html ?? "");

  return html;
}

export default createHtmlFromTemplate;