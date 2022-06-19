import {
  FC,
  Dispatch,
  SetStateAction
} from "react";
import { useDrag } from "react-dnd";
import { css } from "@emotion/react";
import { Todos, Todo } from "../AppTodos";
import { DateFunctions, CATEGORY } from "../../../common/common";
import { TodoApi } from "../../../api/todoApi";

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
  }
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

const AppTodo: FC<{
    id: string;
    title: string;
    content: string;
    category: string;
    date_limit: string | null;
    date_created: string | null;
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
    setTodos,
    setIsShowTodoDesc,
    setTodo,
    setPrevTodoCategory
  }) => {

  // 他カテゴリーへのdrag&dropがあった際のstate更新
  const changeTodoColumn = (currentTodo: CurrentTodo, columnName: string) => {
  // TODO! もっとスッキリした書き方はないのか
    setTodos((prevTodos) => {
      // 移動するtodoインデックスの取得
      const targetTodoIndex = prevTodos[currentTodo.category]
        .findIndex((prevTodo) => prevTodo.id == currentTodo.id);
      // 移動するtodoの取得
      let targetTodo = prevTodos[currentTodo.category].splice(targetTodoIndex, 1);
      // categoryの書き換え
      targetTodo.forEach((todo) => {
        todo.category = columnName;
      });
  
      // DB更新
      TodoApi.patchTodo(targetTodo[0]);

      // 移動元のtodosと移動先のtodoの更新
      return {
        ...prevTodos,
        [currentTodo.category]: prevTodos[currentTodo.category],
        [columnName]: prevTodos[columnName].concat(targetTodo),
      };
    });
  };

  const [{isDragging}, drag] = useDrag({
    type: "todo",
    item: {
      id,
      category,
    },
    end: (item, monitor) => {
      const dropResult: DropResult = monitor.getDropResult();
      if(dropResult && dropResult.name === CATEGORY.SHORT) {
        changeTodoColumn(item, CATEGORY.SHORT);
      }else if(dropResult && dropResult.name == CATEGORY.MEDIUM) {
        changeTodoColumn(item, CATEGORY.MEDIUM);
      }else if(dropResult && dropResult.name == CATEGORY.LONG) {
        changeTodoColumn(item, CATEGORY.LONG);
      }else {
        changeTodoColumn(item, CATEGORY.COMPLETE);
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
    <div css={todoContainer}
      ref={drag}
      style={{opacity}}
      onClick={handleDispTodoDesc}>
      <div css={todoContent}>
        <label>Title</label>
        <p css={sentence}>{title}</p>
      </div>
      <div css={todoContent}>
        <label>Content</label>
        <p css={sentence}>{content}</p>
      </div>
      <div css={todoContent}>
        <label>Deadline</label>
        <p>{DateFunctions.convertStrDateToDispDate(date_limit)}</p>
      </div>
      <div css={todoContent}>
        <label>Date Created</label>
        <p>{DateFunctions.convertStrDateToDispDate(date_created)}</p>
      </div>
    </div>
  );
};

export default AppTodo;