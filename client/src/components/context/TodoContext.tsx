import React, { createContext, ReactNode, useState, useContext } from "react";
import { Todo, TodosByCategory } from "../../utils/types/todo.types";

type TodoContextType = {
  todo: Todo;
  setTodo: React.Dispatch<React.SetStateAction<Todo>>;
  todosByCategory: TodosByCategory;
  setTodosByCategory: React.Dispatch<React.SetStateAction<TodosByCategory>>;
}

export const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [todo, setTodo] = useState<Todo>(
    {
      id: "",
      title: "",
      content: "",
      category: "",
      date_limit: null,
      created_at: null,
      updated_at: null,
      user_id: null,
    }
  );
  const [todosByCategory, setTodosByCategory] = useState<TodosByCategory>({
    "short": [],
    "medium": [],
    "long": [],
    "complete": [],
  });

  return (
    <TodoContext.Provider value={{ todo, setTodo, todosByCategory, setTodosByCategory }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodo must be used within a TodoProvider");
  }

  return context;
};