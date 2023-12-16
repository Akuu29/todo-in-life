import express from 'express'
import { viteInstance, setupVite } from "./vite-setup.js";
import { PORT } from "./constants.js";
import mainRouter from "./router/main.js";
import todosRouter from './router/todos.js';

const app = express()

async function run_server() {
  await setupVite();

  app.use(viteInstance.middlewares);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api", todosRouter);
  app.use("/", mainRouter);

  app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
  })
}

run_server();