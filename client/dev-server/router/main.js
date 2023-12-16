import express from "express";
import { BASE } from "../constants.js";
import { viteInstance } from "../vite-setup.js";
import createHtmlFromTemplate from "../helper.js";

const mainRouter = express.Router();

mainRouter.get("/", async (req, res) => {
  try {
    const url = req.originalUrl.replace(BASE, '');
    const templatePath = "dev-server/template/index.html";
    const ssrLoadModulePath = "dev-server/ssr-load-modules/top-server.tsx";
    const html = await createHtmlFromTemplate(url, templatePath, ssrLoadModulePath);

    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  } catch (e) {
    viteInstance?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

mainRouter.get("/app", async (req, res) => {
  try {
    const url = req.originalUrl.replace(BASE, "app");
    const templatePath = "dev-server/template/todos.html";
    const ssrLoadModulePath = "dev-server/ssr-load-modules/todos-server.tsx";
    const html = await createHtmlFromTemplate(url, templatePath, ssrLoadModulePath);

    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  } catch (e) {
    viteInstance?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

mainRouter.get("/login", async (req, res) => {
  try {
    const url = req.originalUrl.replace(BASE, "login");
    const templatePath = "dev-server/template/login.html";
    const ssrLoadModulePath = "dev-server/ssr-load-modules/login-server.tsx";
    const html = await createHtmlFromTemplate(url, templatePath, ssrLoadModulePath);

    res.status(200).set({ "Content-Type": "text/html" }).end(html);

  } catch (e) {
    viteInstance?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

mainRouter.post("/login", async (req, res) => {
  console.log(req.body);

  res.redirect(302, "/app")
})

mainRouter.get("/signup", async (req, res) => {
  try {
    const url = req.originalUrl.replace(BASE, "signup");
    const templatePath = "dev-server/template/signup.html";
    const ssrLoadModulePath = "dev-server/ssr-load-modules/signup-server.tsx";
    const html = await createHtmlFromTemplate(url, templatePath, ssrLoadModulePath);

    res.status(200).set({ "Content-Type": "text/html" }).end(html);

  } catch (e) {
    viteInstance?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

mainRouter.post("/signup", async (req, res) => {
  console.log(req.body);

  res.redirect(302, "/app")
})

mainRouter.get("/logout", async (req, res) => {
  res.redirect(302, "/")
})


export default mainRouter;