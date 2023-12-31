import { Dispatch, SetStateAction, ChangeEvent } from "react";
import { css } from "@emotion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRectangleXmark } from "@fortawesome/free-solid-svg-icons/faRectangleXmark";
import DatePicker from "react-datepicker";
import { Todo } from "../../utils/types/todo.types";
import { useTodo } from "../../components/context/TodoContext";
import { TODO_CATEGORIES } from "../../utils/constants/todoCategory.constants";
import TodoFormErrorMessages from "../../components/forms/TodoFormErrorMessages/TodoFormErrorMessages";
import { DateFormatters } from "../../utils/helpers/date.helpers";
import { TodoApi } from "../../services/api/todoApi";

const todosFormContainer = css({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  zIndex: 7,
});

const todosForm = css({
  padding: "3em",
  background: "#ffffff",
  border: "solid",
  borderRadius: 10,
});

const titleWrapper = css({
  textAlign: "center",
  marginBottom: 20,
  "& h1": {
    fontSize: 30,
    borderBottom: "solid",
    paddingBottom: 5,
  },
});

const todoFormContent = css({
  width: 430,
  marginBottom: 20,
  "& input": {
    width: 420,
  },
  "& textarea": {
    width: 420,
    height: 150,
  },
  "& select": {
    width: 150,
    display: "block",
  },
  ".inputDate": {
    width: 150,
    display: "block",
  },
});

const submitBtnWrapper = css({
  textAlign: "center",
  paddingTop: 10,
  "& input": {
    width: "100%",
    height: 30,
    backgroundColor: "#000000",
    color: "#ffffff",
    borderRadius: 6,
    cursor: "pointer",
    fontFamily: "Arial Black",
    "&:hover": {
      opacity: 0.6,
    },
  },
});

const closeBtnkWrapper = css({
  textAlign: "center",
  marginTop: 20,
});

const closeBtn = css({
  cursor: "pointer",
  "&:hover": {
    opacity: 0.6,
  },
});

type HandleChangeEvent =
  | ChangeEvent<HTMLInputElement>
  | ChangeEvent<HTMLTextAreaElement>
  | ChangeEvent<HTMLSelectElement>;

function TodosForm({
  formType,
  prevTodoCategory,
  errorMessages,
  setIsShowForm,
  setErrorMessages,
}: {
  formType: string;
  prevTodoCategory: string;
  errorMessages: ErrorMessages;
  setIsShowForm: Dispatch<SetStateAction<boolean>>;
  setErrorMessages: Dispatch<SetStateAction<ErrorMessages>>;
}) {
  const { todo, setTodo, todosByCategory, setTodosByCategory } = useTodo();

  const handleChange = (event: HandleChangeEvent) => {
    const key = event.target.name;
    const val = event.target.value;
    setTodo((todo: Todo) => {
      return {
        ...todo,
        [key]: val,
      };
    });
  };

  const handleChangeLimitDate = (date: Date | null) => {
    setTodo((todo: Todo) => {
      return {
        ...todo,
        date_limit: date?.toISOString().slice(0, -1),
      };
    });
  };

  const handleCloseBtn = () => {
    // エラーメッセージを初期化
    setErrorMessages({
      title: [],
      content: [],
      date_limit: [],
    });
    // フォームを閉じる
    setIsShowForm(false);
  };

  // todoの作成。作成後、画面に反映
  const createTodo: FnToHandleTodosTable = async () => {
    const postTodoResult = await TodoApi.postTodo(todo);

    if (postTodoResult) {
      const data = postTodoResult.data;
      if (data.status == "success") {
        const todoCreated = data.todo;
        setTodosByCategory({
          ...todosByCategory,
          [todoCreated.category]: [...todosByCategory[todoCreated.category], todoCreated],
        });

        // フォーム画面を閉じる
        setIsShowForm(false);
      } else {
        // AxiosError
        if (data.validationErrors) {
          // バリデーションエラー
          const validationErrors = data.validationErrors;
          handleValidationErrors(validationErrors);
        } else {
          alert(`ERROR: ${postTodoResult.status}`);
        }
      }
    } else {
      // Error
      alert("ERROR");
    }
  };

  // todoの編集。編集内容を画面に反映
  const editTodo: FnToHandleTodosTable = async () => {
    const putTodoResult = await TodoApi.putTodo(todo);

    if (putTodoResult) {
      const data = putTodoResult.data;
      if (data.status == "success") {
        const todoEdited = data.todoEdited;
        setTodosByCategory((prevTodos) => {
          // edit対象となるcategoryのtodo配列の取得
          const targetTodoArray = prevTodos[prevTodoCategory];

          if (todoEdited.category == prevTodoCategory) {
            // edit前と後でcategoryが同じ場合
            // 対象のtodoにedit後のtodoを反映
            targetTodoArray
              .filter((todo) => todo.id == todoEdited.id)
              .forEach((todo) => {
                todo.title = todoEdited.title;
                todo.content = todoEdited.content;
                todo.category = todoEdited.category;
                todo.date_limit = todoEdited.date_limit;
              });

            return {
              ...prevTodos,
              [todoEdited.category]: targetTodoArray,
            };
          } else {
            // edit前と後でcategoryが違う場合
            // 'targetTodoArray'より対象のtodoのインデックスの取得
            const targetTodoIndex = prevTodos[prevTodoCategory].findIndex(
              (prevTodo) => prevTodo.id == todoEdited.id
            );
            // 対象のtodoの取得
            const targetTodo = prevTodos[prevTodoCategory].splice(
              targetTodoIndex,
              1
            );
            targetTodo.forEach((todo) => {
              todo.title = todoEdited.title;
              todo.content = todoEdited.content;
              todo.category = todoEdited.category;
              todo.date_limit = todoEdited.date_limit;
            });

            return {
              ...prevTodos,
              [todoEdited.category]:
                prevTodos[todoEdited.category].concat(targetTodo),
            };
          }
        });

        // フォーム画面を閉じる
        setIsShowForm(false);
      } else {
        // AxiosError
        if (data.validationErrors) {
          // バリデーションエラー
          const validationErrors = data.validationErrors;
          handleValidationErrors(validationErrors!);
        } else {
          alert(`ERROR: ${putTodoResult.status}`);
        }
      }
    } else {
      // Error
      alert("ERROR");
    }
  };

  // バリデーションエラーの内容をstate'errorMessages'に反映する
  const handleValidationErrors = (
    responseValidationErrors: ValidationErrors
  ) => {
    const validationErrorMessages: ErrorMessages = {
      title: [],
      content: [],
      date_limit: [],
    };
    // validationErrorsのメッセージをvalidationErrorMessagesに追加していく
    Object.keys(responseValidationErrors).forEach((key) => {
      const validationErrors = responseValidationErrors[key];
      validationErrors.forEach((validationError: ValidationError) => {
        validationErrorMessages[key].push(validationError.message);
      });
    });
    // validationErrorMessagesをerrorMessagesにセットする
    setErrorMessages(validationErrorMessages);
  };

  return (
    <div css={todosFormContainer}>
      <div css={todosForm}>
        <div css={titleWrapper}>
          <h1>POST</h1>
        </div>
        <div css={todoFormContent}>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={todo.title}
            required
            onChange={handleChange}
          />
          <TodoFormErrorMessages errorMessages={errorMessages.title} />
        </div>
        <div css={todoFormContent}>
          <label>Content</label>
          <textarea
            name="content"
            value={todo.content}
            onChange={handleChange}
          />
          <TodoFormErrorMessages errorMessages={errorMessages.content} />
        </div>
        <div css={todoFormContent}>
          <label>Category</label>
          <select name="category" onChange={handleChange}>
            <option
              value={TODO_CATEGORIES.SHORT}
              selected={todo.category == TODO_CATEGORIES.SHORT}
            >
              {TODO_CATEGORIES.SHORT}
            </option>
            <option
              value={TODO_CATEGORIES.MEDIUM}
              selected={todo.category == TODO_CATEGORIES.MEDIUM}
            >
              {TODO_CATEGORIES.MEDIUM}
            </option>
            <option
              value={TODO_CATEGORIES.LONG}
              selected={todo.category == TODO_CATEGORIES.LONG}
            >
              {TODO_CATEGORIES.LONG}
            </option>
          </select>
        </div>
        <div css={todoFormContent}>
          <label>Deadline</label>
          <DatePicker
            dateFormat="yyyy/MM/dd"
            selected={DateFormatters.convertISOStringToDate(todo.date_limit)}
            onChange={handleChangeLimitDate}
          />
          <TodoFormErrorMessages errorMessages={errorMessages.date_limit} />
        </div>
        <div css={submitBtnWrapper}>
          <input type="button" value="POST" onClick={formType == "new" ? createTodo : editTodo} />
        </div>
        <div css={closeBtnkWrapper}>
          <FontAwesomeIcon
            icon={faRectangleXmark}
            size="2x"
            css={closeBtn}
            onClick={handleCloseBtn}
          />
        </div>
      </div>
    </div>
  );
}

export default TodosForm;
