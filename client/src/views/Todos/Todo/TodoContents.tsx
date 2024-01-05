import { Dispatch, SetStateAction } from "react";
import { useDrag } from "react-dnd";
import { css } from "@emotion/react";
import { Todo, TodosByCategory } from "../../../utils/types/todo.types";
import { TODO_CATEGORIES } from "../../../utils/constants/todoCategory.constants";
import { TodoApi } from "../../../services/api/todoApi";
import { useTodo } from "../../../components/context/TodoContext";

const todoContainer = css({
  backgroundColor: "#ffffff",
  border: "solid",
  borderRadius: 8,
  borderWidth: 2,
  margin: 20,
  cursor: "pointer",
  "& p": {
    marginTop: 3,
    fontFamily: "none",
  },
});

const todoContent = css({
  margin: 5,
  marginTop: 10,
  marginBottom: 10,
  "& label": {
    fontSize: 18,
  },
  "& p": {
    width: "100%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }
});

interface CurrentTodo {
  id: string;
  category: string;
}

interface DropResultMember {
  dropEffect: string;
  name: string;
}

type DropResult = DropResultMember | null;

function TodoContents(
  {
    todo,
    setIsShowTodoDesc,
    setPrevTodoCategory,
  }: {
    todo: Todo;
    setIsShowTodoDesc: Dispatch<SetStateAction<boolean>>;
    setPrevTodoCategory: Dispatch<SetStateAction<string>>;
  }) {
  const { setTodo, todosByCategory, setTodosByCategory } = useTodo();

  // 他カテゴリーへのdrag&dropがあった際のstate更新
  const changeTodoColumn = async (
    currentTodo: CurrentTodo,
    columnName: string,
    todosByCategory: TodosByCategory
  ) => {
    const todosCopy = { ...todosByCategory };
    // 移動するtodoインデックスの取得
    const targetTodoIndex = todosCopy[currentTodo.category].findIndex(
      (todo) => todo.id == currentTodo.id
    );
    // 移動するtodoの取得
    const targetTodo = todosCopy[currentTodo.category].splice(
      targetTodoIndex,
      1
    )[0];
    // categoryの書き換え
    targetTodo.category = columnName;

    // DB更新
    const patchTodoResult = await TodoApi.putTodo(targetTodo);

    if (patchTodoResult) {
      const data = patchTodoResult.data;
      if (data.status == "success") {
        setTodosByCategory(() => {
          return {
            ...todosCopy,
            [currentTodo.category]: todosCopy[currentTodo.category],
            [columnName]: todosCopy[columnName].concat(targetTodo),
          };
        });
      } else {
        // AxiosError
        alert(`ERROR: ${patchTodoResult.status}`);
      }
    } else {
      // Error
      alert("ERROR");
    }
  };

  const [{ isDragging }, drag] = useDrag({
    type: "todo",
    item: {
      id: todo.id,
      category: todo.category,
    },
    end: (item, monitor) => {
      const dropResult: DropResult = monitor.getDropResult();
      if (dropResult && dropResult.name === TODO_CATEGORIES.SHORT) {
        changeTodoColumn(item, TODO_CATEGORIES.SHORT, todosByCategory);
      } else if (dropResult && dropResult.name == TODO_CATEGORIES.MEDIUM) {
        changeTodoColumn(item, TODO_CATEGORIES.MEDIUM, todosByCategory);
      } else if (dropResult && dropResult.name == TODO_CATEGORIES.LONG) {
        changeTodoColumn(item, TODO_CATEGORIES.LONG, todosByCategory);
      } else {
        changeTodoColumn(item, TODO_CATEGORIES.COMPLETE, todosByCategory);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleDispTodoDesc = () => {
    setIsShowTodoDesc(true);
    setTodo(todo);
    setPrevTodoCategory(todo.category);
  };

  const opacity = isDragging ? 0.4 : 1;

  return (
    <div
      css={todoContainer}
      ref={drag}
      style={{ opacity }}
      onClick={handleDispTodoDesc}
    >
      <div css={todoContent}>
        <label>{todo.title}</label>
        <p>{!todo.content.length ? "None" : todo.content}</p>
      </div>
    </div>
  );
}

export default TodoContents;
