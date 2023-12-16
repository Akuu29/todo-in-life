import express from "express";

const todosRouter = express.Router();

todosRouter.get("/todos", async (req, res) => {
  console.log("get todos");

  const todos = [
    {
      "id": 1,
      "title": "todo1",
      "content": "todo1 content",
      "category": "short",
      "date_limit": "2021-10-01",
      "created_at": "2021-09-01",
      "updated_at": "2021-09-02",
      "user_id": 1,
    },
    {
      "id": 2,
      "title": "todo2",
      "content": "todo2 content",
      "category": "medium",
      "date_limit": "2021-11-01",
      "created_at": "2021-09-01",
      "updated_at": "2021-09-03",
      "user_id": 1,
    }
  ];

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