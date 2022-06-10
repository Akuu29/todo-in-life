import { Todo } from "../components/App/AppTodos";

class TodoApi {
  static async getTodos() {
    const params = {
      method: "GET",
    };

    const response = await fetch("/api/todos", params);

    return response;
  }
  static async postTodo(todo: Todo) {
    const body = {
      title: todo.title,
      content: todo.content,
      category: todo.category,
      date_limit: todo.date_limit,
    };

    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
    };

    const response = await fetch("/api/todos", params);

    return response;
  }
}

export default TodoApi;