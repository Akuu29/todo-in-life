import axios, { AxiosError, AxiosResponse } from "axios";
import { Todo } from "../../utils/types/todo.types";
import { handleErrorResponse } from "../../utils/helpers/errorResponse.helpers";

type Response<T> = AxiosResponse<T | ValueOfError> | undefined;

interface ValueOfBasic {
  status: "success" | "error";
}

export interface ValueOfError extends ValueOfBasic {
  status: "error";
  validationErrors?: ValidationErrors;
}

interface ValueOfSuccessfulGetTodos extends ValueOfBasic {
  status: "success";
  todos: Array<Todo>;
}

interface ValueOfSuccessfulPostTodo extends ValueOfBasic {
  status: "success";
  todo: Todo;
}

interface ValueOfSuccessfulPutTodo extends ValueOfBasic {
  status: "success";
  todoEdited: {
    id: string;
    title: string;
    content: string;
    category: string;
    date_limit: string;
  };
}

interface ValueOfSuccessfulDeleteTodo extends ValueOfBasic {
  status: "success";
  todoDeleted: {
    id: string;
  };
}

export class TodoApi {
  static async getTodos(): Promise<Response<ValueOfSuccessfulGetTodos>> {
    const response: Response<ValueOfSuccessfulGetTodos> = await axios
      .get("/api/todos")
      .catch((error: AxiosError | Error) => {
        return handleErrorResponse(error);
      });

    return response;
  }
  static async postTodo(
    todo: Todo
  ): Promise<Response<ValueOfSuccessfulPostTodo>> {
    const response: Response<ValueOfSuccessfulPostTodo> = await axios
      .post("/api/todos", todo)
      .catch((error: AxiosError | Error) => {
        return handleErrorResponse(error);
      });

    return response;
  }

  static async putTodo(
    todo: Todo
  ): Promise<Response<ValueOfSuccessfulPutTodo>> {
    const response: Response<ValueOfSuccessfulPutTodo> = await axios
      .put(`api/todos/${todo.id}`, todo)
      .catch((error: AxiosError | Error) => {
        return handleErrorResponse(error);
      });

    return response;
  }

  static async deleteTodo(
    todo: Todo
  ): Promise<Response<ValueOfSuccessfulDeleteTodo>> {
    const response: Response<ValueOfSuccessfulDeleteTodo> = await axios
      .delete(`api/todos/${todo.id}`)
      .catch((error: AxiosError | Error) => {
        return handleErrorResponse(error);
      });

    return response;
  }
}
