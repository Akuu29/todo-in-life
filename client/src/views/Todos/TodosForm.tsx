import { Dispatch, SetStateAction, ChangeEvent } from "react";
import { css } from "@emotion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRectangleXmark } from "@fortawesome/free-solid-svg-icons/faRectangleXmark";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Todo } from "../../utils/types/todo.types";
import { useTodo } from "../../components/context/TodoContext";
import { TODO_CATEGORIES } from "../../utils/constants/todoCategory.constants";
import TodoFormErrorMessages from "../../components/forms/TodoFormErrorMessages/TodoFormErrorMessages";
import { DateFormatters } from "../../utils/helpers/date.helpers";

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
  setIsShowForm,
  todoFunction,
  errorMessages,
  setErrorMessages,
}: {
  setIsShowForm: Dispatch<SetStateAction<boolean>>;
  todoFunction: FnToHandleTodosTable;
  errorMessages: ErrorMessages;
  setErrorMessages: Dispatch<SetStateAction<ErrorMessages>>;
}) {
  const { todo, setTodo } = useTodo();

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
          <input type="button" value="POST" onClick={todoFunction} />
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
