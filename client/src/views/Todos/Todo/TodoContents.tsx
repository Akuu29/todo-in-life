import { FC, Dispatch, SetStateAction } from "react";
import { useDrag } from "react-dnd";
import { css } from "@emotion/react";
import { Todos, Todo } from "../TodosContents";
import { TODO_CATEGORIES } from "../../../utils/constants/todoCategory.constants";
import { DateFormatters } from "../../../utils/helpers/date.helpers";
import { TodoApi } from "../../../services/api/todoApi";

const todoContainer = css({
  width: 290,
  backgroundColor: "#ffffff",
  border: "solid",
  borderRadius: 8,
  margin: 20,
  cursor: "pointer",
  "& p": {
    marginTop: 3,
    fontFamily: "none",
  },
});

const todoContent = css({
  margin: 5,
});

const sentence = css({
  width: "100%",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
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

const TodoContents: FC<{
  id: string;
  title: string;
  content: string;
  category: string;
  date_limit: string | null;
  date_created: string;
  todos: Todos;
  setTodos: Dispatch<SetStateAction<Todos>>;
  setIsShowTodoDesc: Dispatch<SetStateAction<boolean>>;
  setTodo: Dispatch<SetStateAction<Todo>>;
  setPrevTodoCategory: Dispatch<SetStateAction<string>>;
}> = ({
  id,
  title,
  content,
  category,
  date_limit,
  date_created,
  todos,
  setTodos,
  setIsShowTodoDesc,
  setTodo,
  setPrevTodoCategory,
}) => {
  // 他カテゴリーへのdrag&dropがあった際のstate更新
  const changeTodoColumn = async (
    currentTodo: CurrentTodo,
    columnName: string,
    todos: Todos
  ) => {
    let todosCopy = { ...todos };
    // 移動するtodoインデックスの取得
    const targetTodoIndex = todosCopy[currentTodo.category].findIndex(
      (todo) => todo.id == currentTodo.id
    );
    // 移動するtodoの取得
    let targetTodo = todosCopy[currentTodo.category].splice(
      targetTodoIndex,
      1
    )[0];
    // categoryの書き換え
    targetTodo.category = columnName;

    // DB更新
    const patchTodoResult = await TodoApi.patchTodo(targetTodo);

    if (patchTodoResult) {
      const data = patchTodoResult.data;
      if (data.status == "success") {
        setTodos(() => {
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
      id,
      category,
    },
    end: (item, monitor) => {
      const dropResult: DropResult = monitor.getDropResult();
      if (dropResult && dropResult.name === TODO_CATEGORIES.SHORT) {
        changeTodoColumn(item, TODO_CATEGORIES.SHORT, todos);
      } else if (dropResult && dropResult.name == TODO_CATEGORIES.MEDIUM) {
        changeTodoColumn(item, TODO_CATEGORIES.MEDIUM, todos);
      } else if (dropResult && dropResult.name == TODO_CATEGORIES.LONG) {
        changeTodoColumn(item, TODO_CATEGORIES.LONG, todos);
      } else {
        changeTodoColumn(item, TODO_CATEGORIES.COMPLETE, todos);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleDispTodoDesc = () => {
    setIsShowTodoDesc(true);
    setTodo({
      id,
      title,
      content,
      category,
      date_limit,
      date_created,
    });
    setPrevTodoCategory(category);
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
        <label>Title</label>
        <p css={sentence}>{title}</p>
      </div>
      <div css={todoContent}>
        <label>Content</label>
        <p css={sentence}>{!content.length ? "None" : content}</p>
      </div>
      <div css={todoContent}>
        <label>Deadline</label>
        <p>{DateFormatters.convertStrDateToDispDate(date_limit)}</p>
      </div>
      <div css={todoContent}>
        <label>Date Created</label>
        <p>{DateFormatters.convertUtcStrDateToDispDate(date_created)}</p>
      </div>
    </div>
  );
};

export default TodoContents;
