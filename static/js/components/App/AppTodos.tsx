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

export interface Todos {
  [key: string]: Array<Array<CreatedTodo>>;
}

const AppTodos: FC<{setCreateForm: SetCreateForm}> = ({setCreateForm}) => {
  const [todos, setTodos] = useState<Todos>({
    "short": [],
    "medium": [],
    "long": [],
    "completed": [],
  });

  // カテゴリごとにstateを持つ
  // const [todosShort, setTodosShort] = useState<Todos>([]);
  // const [todosMedium, setTodosMedium] = useState<Todos>([]);
  // const [todosLong, setTodosLong] = useState<Todos>([]);
  // const [todosCompleted, setTodosCompleted] = useState<Todos>([]);

  // それぞれのカテゴリ内でのページを保持
  const [pageShort, setPageShort] = useState(0);
  const [pageMedium, setPageMedium] = useState(0);
  const [pageLong, setPageLong] = useState(0);
  const [pageCompleted, setPageCompleted] =useState(0);

  useEffect(() => {
    const get_todos = () => {

      let todosData: Todos = {
        "short": [],
        "medium": [],
        "long": [],
        "completed": [],
      };

      // TODO! 後にsampleGetTodos()を削除
      const todosGetted: Array<CreatedTodo> = SampleGetTodos();

      todosGetted.forEach((todo: CreatedTodo) => {
        const key: keyof Todos = todo.category;
        
        if(!todosData[key].length) {
          todosData[key].push([]);
        }

        todosData[key][0].push(todo);
      });

      // 1pageに6件todoを表示するため、todoが格納されている配列の長さを最大6配列に分割する
      Object.keys(todosData).forEach((key) => {
        if(todosData[key][0] && todosData[key][0].length >= 6) {
          const numOfArr = Math.ceil(todosData[key][0].length / 6);

          let todos = todosData[key].pop();
          for(let i = 0; i < numOfArr; i++) {
            todosData[key].push(todos!.slice(i * 6, (i + 1) * 6));
          }
        }
      });

      setTodos(todosData);
    };

    get_todos();
  }, []);

  const returnTodosForColumn = (columnName: string, page: number) => {
    if(todos[columnName][page]) {
      return todos[columnName][page]
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
    }

  };
 
  return (
    <div css={AppTodosWrapper}>
      {/* DndProviderでラップされいるコンポーネント間でdrag&dropが可能 */}
      <DndProvider backend={HTML5Backend}>
        <AppTodosCategoryColumn
          title="short"
          setCreateForm={setCreateForm}
          currentPage={pageShort}
          maxPage={todos["short"].length - 1}
          setPage={setPageShort} >
          {returnTodosForColumn("short", pageShort)}
        </AppTodosCategoryColumn>
        <AppTodosCategoryColumn
          title="medium"
          setCreateForm={setCreateForm}
          currentPage={pageMedium}
          maxPage={todos["medium"].length - 1}
          setPage={setPageMedium} >
          {returnTodosForColumn("medium", pageMedium)}
        </AppTodosCategoryColumn>
        <AppTodosCategoryColumn
          title="long"
          setCreateForm={setCreateForm}
          currentPage={pageLong}
          maxPage={todos["long"].length - 1}
          setPage={setPageLong} >
          {returnTodosForColumn("long", pageLong)}
        </AppTodosCategoryColumn>
        <AppTodosCategoryColumn
          title="completed"
          setCreateForm={setCreateForm}
          currentPage={pageCompleted}
          maxPage={todos["completed"].length - 1}
          setPage={setPageCompleted}>
          {returnTodosForColumn("completed", pageCompleted)}
        </AppTodosCategoryColumn>
      </DndProvider>
    </div>
  );
};

export default AppTodos;