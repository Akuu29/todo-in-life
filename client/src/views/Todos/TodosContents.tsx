import {
  FC,
  useEffect,
  useState
} from "react";
import { css } from "@emotion/react";
import { DndProvider }  from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TodoContents from "./Todo/TodoContents";
import TodosCategoryColumn from "./TodosCategoryColumn";
import TodoDescription from "./TodosTodoDescription";
import TodosForm from "./TodosForm";
import { TodoApi } from "../../services/api/todoApi";
import { TODO_CATEGORIES } from "../../utils/constants/todoCategory.constants";

const todosContainer = css({
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
  date_created: string;
}

export type Todos = CustomObject<Array<Todo>>;

const TodosContens: FC = () => {
  const [todo, setTodo] = useState<Todo>({
    id: "",
    title: "",
    content: "",
    category: "",
    date_limit: null,
    date_created: "",
  });

  const [todos, setTodos] = useState<Todos>({
    [TODO_CATEGORIES.SHORT]: [],
    [TODO_CATEGORIES.MEDIUM]: [],
    [TODO_CATEGORIES.LONG]: [],
    [TODO_CATEGORIES.COMPLETE]: [],
  });

  useEffect(() => {
    // todoの一覧の設定
    const setInitialTodos = async () => {
      let initialTodosData: Todos = {
        [TODO_CATEGORIES.SHORT]: [],
        [TODO_CATEGORIES.MEDIUM]: [],
        [TODO_CATEGORIES.LONG]: [],
        [TODO_CATEGORIES.COMPLETE]: [],
      };

      const getTodosResult = await TodoApi.getTodos();
      if(getTodosResult) {
        const data = getTodosResult.data;
        if(data.status == "success") {
          data.todos.forEach((todo: Todo) => {
            const key: keyof Todos = todo.category;
            initialTodosData[key].push(todo);
          });
        }else {
          // AxiosError
          alert(`ERROR: ${getTodosResult.status}`);
        }
      }else {
        // Error
        alert("ERROR");
      }

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
        if(key == TODO_CATEGORIES.SHORT) {
          setPageShort([currentPageShort, todosMaxPage]);
        }else if(key == TODO_CATEGORIES.MEDIUM) {
          setPageMedium([currentPageMedium, todosMaxPage]);
        }else if(key == TODO_CATEGORIES.LONG) {
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

  // 各'AppTodosCategoryColumn'にtodoを描画する
  const returnTodosForColumn = (columnName: string, page: number) => {
    if(todos[columnName].length) {
      // 1pageに6件表示
      return todos[columnName]
        .filter((_, i) => ((i >= 6 * page) && (i < 6 * (page + 1))))
        .map((todo) => (
          <TodoContents
            key={todo.id}
            id={todo.id}
            title={todo.title}
            content={todo.content}
            category={todo.category}
            date_limit={todo.date_limit}
            date_created={todo.date_created}
            todos={todos}
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

  // todoの作成。作成後、画面に反映
  const createTodo: FnToHandleTodosTable = async () => {
    const postTodoResult = await TodoApi.postTodo(todo);

    if(postTodoResult) {
      const data = postTodoResult.data;
      if(data.status == "success") {
        const todoCreated = data.todo;
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
        // AxiosError
        if(data.validationErrors) {
          // バリデーションエラー
          const validationErrors = data.validationErrors;
          handleValidationErrors(validationErrors);
        }else {
          alert(`ERROR: ${postTodoResult.status}`);
        }
      }
    }else {
      // Error
      alert("ERROR");
    }
  };

  // todoの編集。編集内容を画面に反映
  const editTodo: FnToHandleTodosTable = async () => {
    const putTodoResult = await TodoApi.putTodo(todo);

    if(putTodoResult) {
      const data = putTodoResult.data;
      if(data.status == "success") {
        const todoEdited = data.todoEdited;
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
        // AxiosError
        if(data.validationErrors) {
          // バリデーションエラー
          const validationErrors = data.validationErrors;
          handleValidationErrors(validationErrors!);
        }else {
          alert(`ERROR: ${putTodoResult.status}`);
        }
      }
    }else {
      // Error
      alert("ERROR");
    }
  }

  // バリデーションエラーの内容をstate'errorMessages'に反映する
  const handleValidationErrors = (responseValidationErrors: ValidationErrors) => {
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

  // todoの削除。削除後、画面に反映
  const deleteTodo: FnToHandleTodosTable = async () => {
    const deleteTodoResult = await TodoApi.deleteTodo(todo);

    if(deleteTodoResult) {
      const data = deleteTodoResult.data;
      if(data.status == "success") {
        const todoDeleted = data.todoDeleted;
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
      }else {
        // AxiosError
        alert(`ERROR: ${deleteTodoResult.status}`);
      }
    }else {
      // Error
      alert("ERROR");
    }
  };

  return (
    <div css={todosContainer}>
      {isShowForm && <TodosForm
        todo={todo}
        setTodo={setTodo}
        setIsShowForm={setIsShowForm}
        todoFunction={formType == "new" ?
          createTodo : editTodo}
        errorMessages={errorMessages}
        setErrorMessages={setErrorMessages} />}
      {isShowTodoDesc && <TodoDescription
        todo={todo}
        setIsShowTodoDesc={setIsShowTodoDesc}
        setIsShowForm={setIsShowForm}
        setFormType={setFormType}
        deleteTodo={deleteTodo} /> }
      {/* DndProviderでラップされいるコンポーネント間でdrag&dropが可能 */}
      <DndProvider backend={HTML5Backend}>
        <TodosCategoryColumn
          title={TODO_CATEGORIES.SHORT}
          setIsShowForm={setIsShowForm}
          currentPage={currentPageShort}
          maxPage={maxPageShort}
          setPage={setPageShort}
          setTodo={setTodo}
          setFormType={setFormType}
          setTodos={setTodos} >
          {returnTodosForColumn(TODO_CATEGORIES.SHORT, currentPageShort)}
        </TodosCategoryColumn>
        <TodosCategoryColumn
          title={TODO_CATEGORIES.MEDIUM}
          setIsShowForm={setIsShowForm}
          currentPage={currentPageMedium}
          maxPage={maxPageMedium}
          setPage={setPageMedium}
          setTodo={setTodo}
          setFormType={setFormType}
          setTodos={setTodos} >
          {returnTodosForColumn(TODO_CATEGORIES.MEDIUM, currentPageMedium)}
        </TodosCategoryColumn>
        <TodosCategoryColumn
          title={TODO_CATEGORIES.LONG}
          setIsShowForm={setIsShowForm}
          currentPage={currentPageLong}
          maxPage={maxPageLong}
          setPage={setPageLong}
          setTodo={setTodo}
          setFormType={setFormType}
          setTodos={setTodos} >
          {returnTodosForColumn(TODO_CATEGORIES.LONG, currentPageLong)}
        </TodosCategoryColumn>
        <TodosCategoryColumn
          title={TODO_CATEGORIES.COMPLETE}
          setIsShowForm={setIsShowForm}
          currentPage={currentPageCompleted}
          maxPage={maxPageCompleted}
          setPage={setPageCompleted}
          setTodo={setTodo}
          setFormType={setFormType}
          setTodos={setTodos} >
          {returnTodosForColumn(TODO_CATEGORIES.COMPLETE, currentPageCompleted)}
        </TodosCategoryColumn>
      </DndProvider>
    </div>
  );
};

export default TodosContens;