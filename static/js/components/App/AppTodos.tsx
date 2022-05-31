import { FC, useEffect, useState } from "react";
import { css } from "@emotion/react";
import { DndProvider }  from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import AppTodo from "./AppTodos/AppTodo";
import AppTodosCategoryColumn from "./AppTodos/AppTodosCategoryColumn";
import { CreatedTodo, SetCreateForm } from "../App";

const AppTodosWrapper = css({
  marginTop: 40,
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-around",
});

const AppTodos: FC<{setCreateForm: SetCreateForm}> = ({setCreateForm}) => {
  const [todos, setTodos] = useState<Array<CreatedTodo>>([]);

  useEffect(() => {
    const get_todos = () => {
      const sampleTodos = [
        {
          id: "57894y82935",
          title: "おはようございます。",
          content: "気持ちのいい朝ですね",
          category: "completed",
          date_limit: "2022/09/01",
          done: true,
          date_created: "2022/05/28",
        },
        {
          id: "57894y829aaaa",
          title: "こんにちは。",
          content: "気持ちのいい昼ですね",
          category: "completed",
          date_limit: "2022/09/01",
          done: false,
          date_created: "2022/05/28",
        },
        {
          id: "57894y82922aa",
          title: "こんにちは。",
          content: "気持ちのいい昼ですね",
          category: "short",
          date_limit: "2022/09/01",
          done: false,
          date_created: "2022/05/28",
        },
        {
          id: "57894y82wett9gfs",
          title: "こんばんは。",
          content: "気持ちのいいよるですね",
          category: "short",
          date_limit: "2022/09/01",
          done: false,
          date_created: "2022/05/28",
        },
        {
          id: "57894yewet829gfs",
          title: "こんばんは。",
          content: "気持ちのいいよるですね",
          category: "medium",
          date_limit: "2022/09/01",
          done: false,
          date_created: "2022/05/28",
        },
        {
          id: "57g94y82935",
          title: "おはようございます。",
          content: "気持ちのいい朝ですね",
          category: "long",
          date_limit: "2022/09/01",
          done: true,
          date_created: "2022/05/28",
        },
      ];

      setTodos(sampleTodos);
    };

    get_todos();
  }, []);

  const returnTodosForColumn = (columnName: string) => {
    return todos
      .filter((todo) => todo.category == columnName)
      .map((todo) => (
        <AppTodo
          key={todo.id}
          id={todo.id}
          title={todo.title}
          content={todo.content}
          date_limit={todo.date_limit}
          date_created={todo.date_created}
          setTodos={setTodos} />
      ));
  };
 
  return (
    <div css={AppTodosWrapper}>
      {/* DndProviderでラップされいるコンポーネント間でdrag&dropが可能 */}
      <DndProvider backend={HTML5Backend}>
        <AppTodosCategoryColumn
          title="short"
          setCreateForm={setCreateForm} >
          {returnTodosForColumn("short")}
        </AppTodosCategoryColumn>
        <AppTodosCategoryColumn
          title="medium"
          setCreateForm={setCreateForm} >
          {returnTodosForColumn("medium")}
        </AppTodosCategoryColumn>
        <AppTodosCategoryColumn
          title="long"
          setCreateForm={setCreateForm} >
          {returnTodosForColumn("long")}
        </AppTodosCategoryColumn>
        <AppTodosCategoryColumn
          title="completed"
          setCreateForm={setCreateForm} >
          {returnTodosForColumn("completed")}
        </AppTodosCategoryColumn>
      </DndProvider>
    </div>
  );
};

export default AppTodos;