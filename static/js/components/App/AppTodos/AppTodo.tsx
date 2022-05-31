import { FC, Dispatch, SetStateAction } from "react";
import { useDrag } from "react-dnd";
import { css } from "@emotion/react";
import { CreatedTodo } from "../../App";

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
    date_limit: string;
    date_created: string;
    setTodos: Dispatch<SetStateAction<Array<CreatedTodo>>>;
  }> = ({
    id,
    title,
    content,
    date_limit,
    date_created,
    setTodos
  }) => {

  // 他カテゴリーへのdrag&dropがあった際に変更をstateに反映する
  const changeTodoColumn = (currentTodo: CurrentTodo, columnName: string) => {
    setTodos((prevTodos: Array<CreatedTodo>) => {
      return prevTodos.map((prevTodo: CreatedTodo) => {
        return {
          ...prevTodo,
          category: prevTodo.id == currentTodo.id ? columnName : prevTodo.category,
        };
      });
    });
  };

  const [{isDragging}, drag] = useDrag({
    type: "todo",
    item: {id},
    end: (item, monitor) => {
      const dropResult: DropResult = monitor.getDropResult();
      if(dropResult && dropResult.name === "short") {
        changeTodoColumn(item, "short");
      }else if(dropResult && dropResult.name == "medium") {
        changeTodoColumn(item, "medium");
      }else if(dropResult && dropResult.name == "long") {
        changeTodoColumn(item, "long");
      }else {
        changeTodoColumn(item, "completed");
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;

  return (
    <div css={todoWrapper} ref={drag} style={{opacity}}>
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