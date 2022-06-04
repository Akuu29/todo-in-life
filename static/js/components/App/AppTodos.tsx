import {
  FC,
  useEffect,
  useState
} from "react";
import { css } from "@emotion/react";
import { DndProvider }  from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import AppTodo from "./AppTodos/AppTodo";
import AppTodosCategoryColumn from "./AppTodos/AppTodosCategoryColumn";
import AppTodoDescription from "./AppTodos/AppTodoDescription";
import AppForm from "./AppTodos/AppTodoForm";

// 後削除
import { SampleGetTodos } from "./SampleGetTodos";

export const SHORT = "short";
export const MEDIUM = "medium";
export const LONG = "long";
export const COMPLETE = "complete";

const AppTodosWrapper = css({
  marginTop: 40,
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-around",
});

export interface Todo {
  id: string;
  title: string;
  content: string;
  category: string;
  date_limit: string;
  done: boolean;
  date_created: string;
};

export interface Todos {
  [key: string]: Array<Todo>;
};

export type FnToHandleTodosTable = () => void;

const AppTodos: FC = () => {
  const [todo, setTodo] = useState<Todo>({
    id: "",
    title: "",
    content: "",
    category: "",
    date_limit: "",
    done: false,
    date_created: "",
  });

  const [todos, setTodos] = useState<Todos>({
    [SHORT]: [],
    [MEDIUM]: [],
    [LONG]: [],
    [COMPLETE]: [],
  });

  // それぞれのカテゴリ内における現在のページと最大のページ数
  const [[currentPageShort, maxPageShort], setPageShort] = useState([0, 0]);
  const [[currentPageMedium, maxPageMedium], setPageMedium] = useState([0, 0]);
  const [[currentPageLong, maxPageLong], setPageLong] = useState([0, 0]);
  const [[currentPageCompleted, maxPageCompleted], setPageCompleted] = useState([0, 0]);

  // todo詳細ページの表示非表示制御
  const [isShowTodoDesc, setIsShowTodoDesc] = useState(false);
  // todoフォームの表示非表示制御用のstate
  const [isShowForm, setIsShowForm] = useState(false);
  // フォームタイプ new or edit
  const [formType, setFormType] = useState("");

  useEffect(() => {
    // todoの取得
    const getTodos = () => {
      let todosData: Todos = {
        [SHORT]: [],
        [MEDIUM]: [],
        [LONG]: [],
        [COMPLETE]: [],
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
        if(key == SHORT) {
          setPageShort([currentPageShort, todosMaxPage]);
        }else if(key == MEDIUM) {
          setPageMedium([currentPageMedium, todosMaxPage]);
        }else if(key == LONG) {
          setPageLong([currentPageLong, todosMaxPage]);
        }else {
          setPageCompleted([currentPageCompleted, todosMaxPage]);
        }
      })
    };

    setMaxPage();
  }, [todos]);

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
            setTodo={setTodo} />
        ));
    }
  };

  const submitTodoForCreating: FnToHandleTodosTable = () => {
    const todoForCreating = {
      title: todo.title,
      content: todo.content,
      category: todo.category,
      date_limit: todo.date_limit,
    };

  };

  const submitTodoForEditing: FnToHandleTodosTable = () => {
    const todoForEditing = {
      ...todo
    };

  };

  const deleteTodo: FnToHandleTodosTable = () => {

  };
 
  return (
    <div css={AppTodosWrapper}>
      {isShowForm && <AppForm
        todo={todo}
        setTodo={setTodo}
        setIsShowForm={setIsShowForm}
        submitTodo={formType == "new" ?
          submitTodoForCreating : submitTodoForEditing} />}
{/* TODO! AppTodoDescriptionの引数が冗長、todoとして１つにまとめる */}
      {isShowTodoDesc && <AppTodoDescription 
        title={todo.title}
        content={todo.content}
        category={todo.category}
        date_limit={todo.date_limit}
        done={todo.done}
        date_created={todo.date_created}
        setIsShowTodoDesc={setIsShowTodoDesc}
        setIsShowForm={setIsShowForm}
        setFormType={setFormType}
        deleteTodo={deleteTodo} /> }
      {/* DndProviderでラップされいるコンポーネント間でdrag&dropが可能 */}
      <DndProvider backend={HTML5Backend}>
        <AppTodosCategoryColumn
          title={SHORT}
          setIsShowForm={setIsShowForm}
          currentPage={currentPageShort}
          maxPage={maxPageShort}
          setPage={setPageShort} 
          setTodo={setTodo}
          setFormType={setFormType} >
          {returnTodosForColumn(SHORT, currentPageShort)}
        </AppTodosCategoryColumn>
        <AppTodosCategoryColumn
          title={MEDIUM}
          setIsShowForm={setIsShowForm}
          currentPage={currentPageMedium}
          maxPage={maxPageMedium}
          setPage={setPageMedium} 
          setTodo={setTodo}
          setFormType={setFormType} >
          {returnTodosForColumn(MEDIUM, currentPageMedium)}
        </AppTodosCategoryColumn>
        <AppTodosCategoryColumn
          title={LONG}
          setIsShowForm={setIsShowForm}
          currentPage={currentPageLong}
          maxPage={maxPageLong}
          setPage={setPageLong}
          setTodo={setTodo}
          setFormType={setFormType} >
          {returnTodosForColumn(LONG, currentPageLong)}
        </AppTodosCategoryColumn>
        <AppTodosCategoryColumn
          title={COMPLETE}
          setIsShowForm={setIsShowForm}
          currentPage={currentPageCompleted}
          maxPage={maxPageCompleted}
          setPage={setPageCompleted}
          setTodo={setTodo}
          setFormType={setFormType} >
          {returnTodosForColumn(COMPLETE, currentPageCompleted)}
        </AppTodosCategoryColumn>
      </DndProvider>
    </div>
  );
};

export default AppTodos;