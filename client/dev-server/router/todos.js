import express from "express";

const todosRouter = express.Router();

todosRouter.get("/todos", async (req, res) => {
  console.log("get todos");

  let todos = [];

  for (let category of ["short", "medium", "long"]) {
    for (let i = 1; i <= 11; i++) {
      todos.push({
        "id": i,
        "title": `todo${i}`,
        "content": `todo${i} content content content content`,
        "category": category,
        "date_limit": new Date("2021-10-01"),
        "created_at": new Date("2021-09-01"),
        "updated_at": new Date("2021-09-02"),
        "user_id": 1,
      })
    }
  }

  res.status(200).json({ status: "success", todos: todos });
})

todosRouter.post("/todos", async (req, res) => {
  console.log("post todo");
  console.log(req.body);

  res.status(201).json({ status: "success", todo: req.body });
})

todosRouter.put("/todos", async (req, res) => {
  console.log("put todo");
  console.log(req.body);

  res.status(200).json({ status: "success", todoEdited: req.body });
})

todosRouter.patch("/todos", async (req, res) => {
  console.log("patch todo");
  console.log(req.body);

  res.status(200).json({ status: "success" });
})

todosRouter.delete("/todos", async (req, res) => {
  console.log("delete todo");
  console.log(req.body);

  res.status(200).json({ status: "success", todoDeleted: req.body });
})

export default todosRouter;