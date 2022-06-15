import { Todo } from "../components/App/AppTodos";

class TodoApi {
  static async getTodos() {
    const params = {
      method: "GET",
    };

    const response = await fetch("/api/todos", params);

    return await response.json();
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

    return await response.json();
  }
  static async putTodo(todo: Todo) {
    const body = {
      id: todo.id,
      title: todo.title,
      content: todo.content,
      category: todo.category,
      date_limit: todo.date_limit
    };

    const params = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    };

    const response = await fetch("api/todos", params);

    return await response.json();
  }
  static async deleteTodo(todo: Todo) {
    const body = {
      id: todo.id,
    };

    const params = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    };

    const response = await fetch("api/todos", params);

    return await response.json();
  }
}

export default TodoApi;