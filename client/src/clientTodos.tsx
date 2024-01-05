import React from "react";
import ReactDOM from "react-dom/client";
import TodosPage from "./views/Todos/TodosPage";

ReactDOM.createRoot(document.getElementById("todos")!).render(
  <React.StrictMode>
    <TodosPage />
  </React.StrictMode>
);