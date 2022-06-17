import { Todo, CustomObject } from "../components/App/AppTodos";

export interface ValidationError {
  code: string;
  message: string;
  params: Object;
}

export type ValidationErrors = CustomObject<Array<ValidationError>>;

type Status = "success" | "error";

interface ReturnValueOfGetTodos {
  status: Status;
  todos: Array<Todo>;
}

interface ReturnValueOfPostTodo {
  status: Status;
  todo?: Todo;
  validationErrors?: ValidationErrors;
}

interface ReturnValueOfPutTodo {
  status: Status;
  todoEdited?: {
    id: string;
    title: string;
    content: string;
    category: string;
    date_limit: string;
  };
  validationErrors?: ValidationErrors;
}

interface ReturnValueOfPatchTodo {
  status: Status;
}

interface ReturnValueOfDeleteTodo {
  status: Status;
  todoDeleted: {
    id: string;
  };
}

export class TodoApi {
  static async getTodos(): Promise<ReturnValueOfGetTodos> {
    const params = {
      method: "GET",
    };

    const response = await fetch("/api/todos", params);

    return await response.json();
  }
  static async postTodo(todo: Todo): Promise<ReturnValueOfPostTodo> {
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
  static async putTodo(todo: Todo): Promise<ReturnValueOfPutTodo> {
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
  static async patchTodo(todo: Todo): Promise<ReturnValueOfPatchTodo> {
    const body = {
      id: todo.id,
      category: todo.category,
    };

    const params = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    };

    const response = await fetch("api/todos", params);

    return await response.json();
  }
  static async deleteTodo(todo: Todo): Promise<ReturnValueOfDeleteTodo> {
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