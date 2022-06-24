import {
  FC,
  Dispatch,
  SetStateAction,
  ChangeEvent
} from "react";
import { css } from "@emotion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRectangleXmark } from "@fortawesome/free-solid-svg-icons/faRectangleXmark";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Todo,
  FnToHandleTodosTable,
  ErrorMessages
} from "../AppTodos";
import { DateFunctions, CATEGORY } from "../../../common/common";
import FormErrorMessage from "../../common/FormErrorMessage";

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
  }
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
  }
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
    }
  }
});

const closeBtnkWrapper = css({
  textAlign: "center",
  marginTop: 20,
});

const closeBtn = css({
  cursor: "pointer",
  "&:hover": {
    opacity: 0.6,
  }
});

type HandleChangeEvent = ChangeEvent<HTMLInputElement> |
  ChangeEvent<HTMLTextAreaElement> |
  ChangeEvent<HTMLSelectElement>;

const AppForm: FC<{
    todo: Todo;
    setTodo: Dispatch<SetStateAction<Todo>>;
    setIsShowForm: Dispatch<SetStateAction<boolean>>;
    submitTodo: FnToHandleTodosTable;
    errorMessages: ErrorMessages;
    setErrorMessages: Dispatch<SetStateAction<ErrorMessages>>;
  }> = ({
    todo,
    setTodo,
    setIsShowForm,
    submitTodo,
    errorMessages,
    setErrorMessages
  }) => {

  const handleChange = (event: HandleChangeEvent) => {
    const key = event.target.name;
    const val = event.target.value;
    setTodo((todo) => {
      return {
        ...todo,
        [key]: val,
      };
    });
  };

  const handleChangeLimitDate  = (date: Date | null) => {
    setTodo((todo) => {
      return {
        ...todo,
        date_limit: DateFunctions.convertDateToString(date)
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
            onChange={handleChange} />
          <FormErrorMessage errorMessages={errorMessages.title}/>
        </div>
        <div css={todoFormContent}>
          <label>Content</label>
          <textarea
            name="content"
            value={todo.content}
            onChange={handleChange} />
          <FormErrorMessage errorMessages={errorMessages.content}/>
        </div>
        <div css={todoFormContent}>
          <label>Category</label>
          <select
            name="category"
            onChange={handleChange} >
            <option value={CATEGORY.SHORT}
              selected={todo.category == CATEGORY.SHORT}>
              {CATEGORY.SHORT}
            </option>
            <option value={CATEGORY.MEDIUM}
              selected={todo.category == CATEGORY.MEDIUM}>
              {CATEGORY.MEDIUM}
            </option>
            <option value={CATEGORY.LONG}
              selected={todo.category == CATEGORY.LONG}>
              {CATEGORY.LONG}
            </option>
          </select>
        </div>
        <div css={todoFormContent}>
          <label>Deadline</label>
          <DatePicker
            dateFormat="yyyy/MM/dd"
            selected={DateFunctions.convertStrDateToDate(todo.date_limit)}
            onChange={handleChangeLimitDate} />
          <FormErrorMessage errorMessages={errorMessages.date_limit}/>
        </div>
        <div css={submitBtnWrapper}>
          <input type="button" value="POST" onClick={submitTodo} />
        </div>
        <div css={closeBtnkWrapper}>
          <FontAwesomeIcon
            icon={faRectangleXmark}
            size="2x"
            css={closeBtn}
            onClick={handleCloseBtn} />
        </div>
      </div>
    </div>
  );
};

export default AppForm;