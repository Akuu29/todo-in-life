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
import {
  TodoApi,
  ValidationErrors,
  ValidationError
} from "../../api/todoApi";
import { CATEGORY } from "../../common/common";

const AppTodosWrapper = css({
  marginTop: 40,
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-around",
});

export interface CustomObject<T> {
  [key: string]: T;
}

export interface Todo {
  id: string;
  title: string;
  content: string;
  category: string;
  date_limit: string | null;
  date_created: string | null;
}

export type Todos = CustomObject<Array<Todo>>;

export type ErrorMessages = CustomObject<Array<string>>;

export type FnToHandleTodosTable = () => Promise<void>;

const AppTodos: FC = () => {
  const [todo, setTodo] = useState<Todo>({
    id: "",
    title: "",
    content: "",
    category: "",
    date_limit: null,
    date_created: null,
  });

  const [todos, setTodos] = useState<Todos>({
    [CATEGORY.SHORT]: [],
    [CATEGORY.MEDIUM]: [],
    [CATEGORY.LONG]: [],
    [CATEGORY.COMPLETE]: [],
  });

  useEffect(() => {
    // todoの一覧の設定
    const setInitialTodos = async () => {
      let initialTodosData: Todos = {
        [CATEGORY.SHORT]: [],
        [CATEGORY.MEDIUM]: [],
        [CATEGORY.LONG]: [],
        [CATEGORY.COMPLETE]: [],
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

  // それぞれのカテゴリ内における現在のページと最大のページ数
  const [[currentPageShort, maxPageShort], setPageShort] = useState<[number, number]>([0, 0]);
  const [[currentPageMedium, maxPageMedium], setPageMedium] = useState<[number, number]>([0, 0]);
  const [[currentPageLong, maxPageLong], setPageLong] = useState<[number, number]>([0, 0]);
  const [[currentPageCompleted, maxPageCompleted], setPageCompleted] = useState<[number, number]>([0, 0]);

  // todosの更新時に実行される
  useEffect(() => {
    // 各カテゴリの最大ページの設定
    const setMaxPage = () => {
      Object.keys(todos).forEach((key) => {
        let todosLen = todos[key].length;
        let todosMaxPage = Math.ceil(todosLen / 6) - 1;
        if(key == CATEGORY.SHORT) {
          setPageShort([currentPageShort, todosMaxPage]);
        }else if(key == CATEGORY.MEDIUM) {
          setPageMedium([currentPageMedium, todosMaxPage]);
        }else if(key == CATEGORY.LONG) {
          setPageLong([currentPageLong, todosMaxPage]);
        }else {
          setPageCompleted([currentPageCompleted, todosMaxPage]);
        }
      })
    };

    setMaxPage();
  }, [todos]);

  // todo詳細ページの表示非表示制御
  const [isShowTodoDesc, setIsShowTodoDesc] = useState<boolean>(false);

  // todoフォームの表示非表示制御用のstate
  const [isShowForm, setIsShowForm] = useState<boolean>(false);

  // フォームタイプ(new or edit), フォームにて'post'ボタンが押下された際の
  // ファンクションの判別に使用される
  const [formType, setFormType] = useState<string>("");

  // editとしてフォームが開かれた場合に、edit前のtodoのcategoryを保持しておく
  const [prevTodoCategory, setPrevTodoCategory] = useState<string>("");

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
            date_created={todo.date_created}
            setTodos={setTodos}
            setIsShowTodoDesc={setIsShowTodoDesc}
            setTodo={setTodo}
            setPrevTodoCategory={setPrevTodoCategory} />
        ));
    }
  };

  // フォームエラーメッセージ
  const [errorMessages, setErrorMessages] = useState<ErrorMessages>({
    title: [],
    content: [],
    date_limit: [],
  });

  const submitTodoForCreating: FnToHandleTodosTable = async () => {
    const response = await TodoApi.postTodo(todo);

    if(response.status == "success") {
      // state'todos'に作成されたtodoを反映
      const todoCreated = response.todo!;
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
      handleValidationErrors(response.validationErrors!);
    }
  };

  const submitTodoForEditing: FnToHandleTodosTable = async () => {
    const response = await TodoApi.putTodo(todo);

    if(response.status == "success") {
      const todoEdited = response.todoEdited!;
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
      handleValidationErrors(response.validationErrors!);
    }
  };

  const handleValidationErrors = (responseValidationErrors: ValidationErrors) => {
    // エラー
    let validationErrorMessages: ErrorMessages = {
      title: [],
      content: [],
      date_limit: [],
    };
    // validationErrorsのメッセージをvalidationErrorMessagesに追加していく
    Object.keys(responseValidationErrors).forEach((key) => {
      const validationErrors = responseValidationErrors[key];
      validationErrors.forEach((validationError: ValidationError) => {
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
        errorMessages={errorMessages}
        setErrorMessages={setErrorMessages} />}
{/* TODO! AppTodoDescriptionの引数が冗長、todoとして１つにまとめる */}
      {isShowTodoDesc && <AppTodoDescription 
        title={todo.title}
        content={todo.content}
        category={todo.category}
        date_limit={todo.date_limit}
        date_created={todo.date_created}
        setIsShowTodoDesc={setIsShowTodoDesc}
        setIsShowForm={setIsShowForm}
        setFormType={setFormType}
        deleteTodo={deleteTodo} /> }
      {/* DndProviderでラップされいるコンポーネント間でdrag&dropが可能 */}
      <DndProvider backend={HTML5Backend}>
        <AppTodosCategoryColumn
          title={CATEGORY.SHORT}
          setIsShowForm={setIsShowForm}
          currentPage={currentPageShort}
          maxPage={maxPageShort}
          setPage={setPageShort}
          setTodo={setTodo}
          setFormType={setFormType} >
          {returnTodosForColumn(CATEGORY.SHORT, currentPageShort)}
        </AppTodosCategoryColumn>
        <AppTodosCategoryColumn
          title={CATEGORY.MEDIUM}
          setIsShowForm={setIsShowForm}
          currentPage={currentPageMedium}
          maxPage={maxPageMedium}
          setPage={setPageMedium}
          setTodo={setTodo}
          setFormType={setFormType} >
          {returnTodosForColumn(CATEGORY.MEDIUM, currentPageMedium)}
        </AppTodosCategoryColumn>
        <AppTodosCategoryColumn
          title={CATEGORY.LONG}
          setIsShowForm={setIsShowForm}
          currentPage={currentPageLong}
          maxPage={maxPageLong}
          setPage={setPageLong}
          setTodo={setTodo}
          setFormType={setFormType} >
          {returnTodosForColumn(CATEGORY.LONG, currentPageLong)}
        </AppTodosCategoryColumn>
        <AppTodosCategoryColumn
          title={CATEGORY.COMPLETE}
          setIsShowForm={setIsShowForm}
          currentPage={currentPageCompleted}
          maxPage={maxPageCompleted}
          setPage={setPageCompleted}
          setTodo={setTodo}
          setFormType={setFormType} >
          {returnTodosForColumn(CATEGORY.COMPLETE, currentPageCompleted)}
        </AppTodosCategoryColumn>
      </DndProvider>
    </div>
  );
};

export default AppTodos;