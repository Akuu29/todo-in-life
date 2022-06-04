import {
  FC,
  Dispatch,
  SetStateAction
} from "react";
import { useDrag } from "react-dnd";
import { css } from "@emotion/react";

import {
  Todos,
  Todo,
  SHORT,
  MEDIUM,
  LONG,
  COMPLETE
} from "../AppTodos";

const todoWrapper = css({
  width: 290,
  backgroundColor: "#ffffff",
  border: "solid",
  borderRadius: 8,
  margin: 20,
  "& p": {
    marginTop: 3,
  }
});

const todoContent = css({
  margin: 5,
});

interface CurrentTodo {
  id: string;
  category: string;
};

interface DropResultMember {
  dropEffect: string;
  name: string;
};

type DropResult = DropResultMember | null;

const AppTodo: FC<{
    id: string; 
    title: string;
    content: string;
    category: string;
    date_limit: string;
    done: boolean;
    date_created: string;
    setTodos: Dispatch<SetStateAction<Todos>>;
    setIsShowTodoDesc: Dispatch<SetStateAction<boolean>>;
    setTodo: Dispatch<SetStateAction<Todo>>;
  }> = ({
    id,
    title,
    content,
    category,
    date_limit,
    done,
    date_created,
    setTodos,
    setIsShowTodoDesc,
    setTodo
  }) => {

  // 他カテゴリーへのdrag&dropがあった際のstate更新
  const changeTodoColumn = (currentTodo: CurrentTodo, columnName: string) => {
  // TODO! もっとスッキリした書き方はないのか
    setTodos((prevTodos) => {
      // 移動するtodoインデックスの取得
      const targetTodoIndex = prevTodos[currentTodo.category]
        .findIndex((prevTodo) => prevTodo.id == currentTodo.id);
      // 移動するtodoの取得
      const targetTodo = prevTodos[currentTodo.category].splice(targetTodoIndex, 1);
      // categoryの書き換え
      targetTodo.forEach((todo) => {
        todo.category = columnName;
      });
  
      // DB更新

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
      if(dropResult && dropResult.name === SHORT) {
        changeTodoColumn(item, SHORT);
      }else if(dropResult && dropResult.name == MEDIUM) {
        changeTodoColumn(item, MEDIUM);
      }else if(dropResult && dropResult.name == LONG) {
        changeTodoColumn(item, LONG);
      }else {
        changeTodoColumn(item, COMPLETE);
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
      done,
      date_created,
    });
  };

  const opacity = isDragging ? 0.4 : 1;

  return (
    <div css={todoWrapper}
      ref={drag}
      style={{opacity}}
      onClick={handleDispTodoDesc}>
      <div css={todoContent}>
        <label>Title</label>
        <p>{title}</p>
      </div>
      <div css={todoContent}>
        <label>Content</label>
        <p>{content}</p>
      </div>
      <div css={todoContent}>
        <label>Deadline</label>
        <p>{date_limit}</p>
      </div>
      <div css={todoContent}>
        <label>Date Created</label>
        <p>{date_created}</p>
      </div>
    </div>
  );
};

export default AppTodo;