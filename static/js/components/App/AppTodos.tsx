import { FC, useEffect, useState } from "react";
import { css } from "@emotion/react";
import { DndProvider }  from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import AppTodo from "./AppTodos/AppTodo";
import AppTodosCategoryColumn from "./AppTodos/AppTodosCategoryColumn";
import AppTodoDescription from "./AppTodos/AppTodoDescription";
import { Todo, SetCreateForm } from "../App";

// 後削除
import { SampleGetTodos } from "./SampleGetTodos";

const AppTodosWrapper = css({
  marginTop: 40,
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-around",
});

export interface Todos {
  [key: string]: Array<Todo>;
}

export type SetTodoForTodoDesc = (
  id: string,
  title: string,
  content: string,
  category: string,
  date_limit: string,
  done: boolean,
  date_created: string,
  ) => void;

const AppTodos: FC<{setCreateForm: SetCreateForm}> = ({setCreateForm}) => {
  const [todos, setTodos] = useState<Todos>({
    short: [],
    medium: [],
    long: [],
    completed: [],
  });

  // それぞれのカテゴリ内における現在のページと最大のページ数
  const [[currentPageShort, maxPageShort], setPageShort] = useState([0, 0]);
  const [[currentPageMedium, maxPageMedium], setPageMedium] = useState([0, 0]);
  const [[currentPageLong, maxPageLong], setPageLong] = useState([0, 0]);
  const [[currentPageCompleted, maxPageCompleted], setPageCompleted] = useState([0, 0]);

  // todo詳細ページの表示非表示制御
  const [isShowTodoDesc, setIsShowTodoDesc] = useState(false);
  // todo詳細ページ用のtodo
  const [todo, setTodo] = useState<Todo>({
    id: "",
    title: "",
    content: "",
    category: "",
    date_limit: "",
    done: false,
    date_created: "",
  });

  useEffect(() => {
    // todoの取得
    const getTodos = () => {
      let todosData: Todos = {
        short: [],
        medium: [],
        long: [],
        completed: [],
      };

      // TODO! 後にsampleGetTodos()を削除
      const todosGetted: Array<Todo> = SampleGetTodos();

      todosGetted.forEach((todo: Todo) => {
        const key: keyof Todos = todo.category;
        todosData[key].push(todo);
      });

      setTodos(todosData);
    };

    getTodos();
  }, []);

  // todosの更新時に実行される
  useEffect(() => {
    // 各カテゴリの最大ページの設定
    const setMaxPage = () => {
      Object.keys(todos).forEach((key) => {
        let todosLen = todos[key].length;
        let todosMaxPage = Math.ceil(todosLen / 6) - 1;
        if(key == "short") {
          setPageShort([currentPageShort, todosMaxPage]);
        }else if(key == "medium") {
          setPageMedium([currentPageMedium, todosMaxPage]);
        }else if(key == "long") {
          setPageLong([currentPageLong, todosMaxPage]);
        }else {
          setPageCompleted([currentPageCompleted, todosMaxPage]);
        }
      })
    };

    setMaxPage();
  }, [todos]);

  // todo詳細ページ用にtodoStateを更新
  const setTodoForTodoDesc: SetTodoForTodoDesc = (
    id: string,
    title: string,
    content: string,
    category: string,
    date_limit: string,
    done: boolean,
    date_created: string) => {
    setTodo({
      id,
      title,
      content,
      category,
      date_limit,
      done,
      date_created
    });
  };

  const returnTodosForColumn = (columnName: string, page: number) => {
    if(todos[columnName].length) {
      // 1pageに6件表示
      return todos[columnName]
        .filter((_, i) => ((i >= 6 * page) && (i < 6 * (page + 1))))
        .map((todo) => (
          <AppTodo
            key={todo.id}
            id={todo.id}
            title={todo.title}
            content={todo.content}
            category={todo.category}
            date_limit={todo.date_limit}
            done={todo.done}
            date_created={todo.date_created}
            setTodos={setTodos}
            setIsShowTodoDesc={setIsShowTodoDesc}
            setTodoForTodoDesc={setTodoForTodoDesc} />
        ));
    }
  };
 
  return (
    <div css={AppTodosWrapper}>
{/* TODO! AppTodoDescriptionの引数が冗長、todoとして１つにまとめる */}
      {isShowTodoDesc && <AppTodoDescription 
        title={todo.title}
        content={todo.content}
        category={todo.category}
        date_limit={todo.date_limit}
        done={todo.done}
        date_created={todo.date_created}
        setIsShowTodoDesc={setIsShowTodoDesc} /> }
      {/* DndProviderでラップされいるコンポーネント間でdrag&dropが可能 */}
      <DndProvider backend={HTML5Backend}>
        <AppTodosCategoryColumn
          title="short"
          setCreateForm={setCreateForm}
          currentPage={currentPageShort}
          maxPage={maxPageShort}
          setPage={setPageShort} >
          {returnTodosForColumn("short", currentPageShort)}
        </AppTodosCategoryColumn>
        <AppTodosCategoryColumn
          title="medium"
          setCreateForm={setCreateForm}
          currentPage={currentPageMedium}
          maxPage={maxPageMedium}
          setPage={setPageMedium} >
          {returnTodosForColumn("medium", currentPageMedium)}
        </AppTodosCategoryColumn>
        <AppTodosCategoryColumn
          title="long"
          setCreateForm={setCreateForm}
          currentPage={currentPageLong}
          maxPage={maxPageLong}
          setPage={setPageLong} >
          {returnTodosForColumn("long", currentPageLong)}
        </AppTodosCategoryColumn>
        <AppTodosCategoryColumn
          title="completed"
          setCreateForm={setCreateForm}
          currentPage={currentPageCompleted}
          maxPage={maxPageCompleted}
          setPage={setPageCompleted}>
          {returnTodosForColumn("completed", currentPageCompleted)}
        </AppTodosCategoryColumn>
      </DndProvider>
    </div>
  );
};

export default AppTodos;