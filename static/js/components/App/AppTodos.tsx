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

import TodoApi from "../../api/todoApi";

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
  date_limit: string | null;
  done: boolean;
  date_created: string | null;
};

export interface Todos {
  [key: string]: Array<Todo>;
};

export interface ErrorMessages {
  [key: string]: Array<string>
};

interface validationErrros {
  [key: string]: Array<validationError>;
};

interface validationError {
  code: string,
  message: string,
  params: {
    value: string,
  }
};

export type FnToHandleTodosTable = () => void;

const AppTodos: FC = () => {
  const [todo, setTodo] = useState<Todo>({
    id: "",
    title: "",
    content: "",
    category: "",
    date_limit: null,
    done: false,
    date_created: null,
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

  // フォームエラーメッセージ
  const [errorMessages, setErrorMessages] = useState<ErrorMessages>({
    title: [],
    content: [],
    date_limit: [],
  });

  // editとしてフォームが開かれた場合に、edit前のtodoのcategoryを保持しておく
  const [prevTodoCategory, setPrevTodoCategory] = useState<string>("");

  useEffect(() => {
    // todoの取得
    const setInitialTodos = async () => {
      let initialTodosData: Todos = {
        [SHORT]: [],
        [MEDIUM]: [],
        [LONG]: [],
        [COMPLETE]: [],
      };

      const getTodosResult = await TodoApi.getTodos();
      getTodosResult.todos.forEach((todo: Todo) => {
        const key: keyof Todos = todo.category;
        initialTodosData[key].push(todo);
      });

      setTodos(initialTodosData);
    };

    setInitialTodos();
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
            setTodo={setTodo}
            setPrevTodoCategory={setPrevTodoCategory} />
        ));
    }
  };

  const submitTodoForCreating: FnToHandleTodosTable = async () => {
    const response = await TodoApi.postTodo(todo);

    if(response.status == "success") {
      // state'todos'に作成されたtodoを反映
      const todoCreated = response.todo;
      setTodos({
        ...todos,
        [todoCreated.category]: [
          ...todos[todoCreated.category],
          todoCreated
        ]
      });
      // フォーム画面を閉じる
      setIsShowForm(false);
    }else {
      // エラー
      handleValidationErrors(response.validationErrors);
    }
  };

  const submitTodoForEditing: FnToHandleTodosTable = async () => {
    const response = await TodoApi.putTodo(todo);

    if(response.status == "success") {
      const todoEdited = response.todoEdited;
      setTodos((prevTodos) => {
        // edit対象となるcategoryのtodo配列の取得
        let targetTodoArray = prevTodos[prevTodoCategory];

        if(todoEdited.category == prevTodoCategory) {
          // edit前と後でcategoryが同じ場合
          // 対象のtodoにedit後のtodoを反映
          targetTodoArray.filter(todo => todo.id == todoEdited.id)
          .forEach(todo => {
            todo.title = todoEdited.title;
            todo.content =  todoEdited.content;
            todo.category = todoEdited.category;
            todo.date_limit = todoEdited.date_limit;
          });

          return {
            ...prevTodos,
            [todoEdited.category]: targetTodoArray
          };
        }else {
          // edit前と後でcategoryが違う場合
          // 'targetTodoArray'より対象のtodoのインデックスの取得
          const targetTodoIndex = prevTodos[prevTodoCategory]
            .findIndex(prevTodo => prevTodo.id == todoEdited.id);
          // 対象のtodoの取得
          let targetTodo = prevTodos[prevTodoCategory].splice(targetTodoIndex, 1);
          targetTodo.forEach(todo => {
            todo.title = todoEdited.title;
            todo.content = todoEdited.content;
            todo.category = todoEdited.category;
            todo.date_limit = todoEdited.date_limit;
          });

          return {
            ...prevTodos,
            [todoEdited.category]: prevTodos[todoEdited.category].concat(targetTodo),
          };
        }
      })

      // フォーム画面を閉じる
      setIsShowForm(false);
    }else {
      // エラー
      handleValidationErrors(response.validationErrors);
    }
  };

  const handleValidationErrors = (responseValidationErrors: validationErrros) => {
    // エラー
    let validationErrorMessages: ErrorMessages = {
      title: [],
      content: [],
      date_limit: [],
    };
    // validationErrorsのメッセージをvalidationErrorMessagesに追加していく
    Object.keys(responseValidationErrors).forEach((key) => {
      const validationErrors = responseValidationErrors[key];
      validationErrors.forEach((validationError: validationError) => {
        validationErrorMessages[key].push(validationError.message);
      })
    })
    // validationErrorMessagesをerrorMessagesにセットする
    setErrorMessages(validationErrorMessages);
  };

  const deleteTodo: FnToHandleTodosTable = async () => {
    const response = await TodoApi.deleteTodo(todo);
    const todoDeleted = response.todoDeleted;

    if(response.status == "success") {
      setTodos(prevTodos => {
        // 削除されたtodoが格納されている配列
        let targetTodoArray = prevTodos[prevTodoCategory];
        // 削除されたtodoのインデックスの取得
        const targetTodoIndex = targetTodoArray.findIndex(todo => todo.id == todoDeleted.id);
        // 削除
        prevTodos[prevTodoCategory].splice(targetTodoIndex, 1);

        return {
          ...prevTodos,
          [prevTodoCategory]: prevTodos[prevTodoCategory],
        };
      });
    }
  };
 
  return (
    <div css={AppTodosWrapper}>
      {isShowForm && <AppForm
        todo={todo}
        setTodo={setTodo}
        setIsShowForm={setIsShowForm}
        submitTodo={formType == "new" ?
          submitTodoForCreating : submitTodoForEditing}
        errorMessages={errorMessages}/>}
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