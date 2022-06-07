import {
  FC,
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
  ChangeEvent
} from "react";
import { css } from "@emotion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRectangleXmark } from "@fortawesome/free-solid-svg-icons";

import {
  Todo,
  FnToHandleTodosTable,
  SHORT,
  MEDIUM,
  LONG
} from "../AppTodos";

const todoFormWrapper = css({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
});

const todoForm = css({
  zIndex: 2,
  height: "67%",
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
  }> = ({
    todo,
    setTodo,
    setIsShowForm,
    submitTodo
  }) => {

  const handleChange: ChangeEventHandler = (event: HandleChangeEvent) => {
    const key = event.target.name;
    const val = event.target.value;
    setTodo((todo) => {
      return {
        ...todo,
        [key]: val,
      };
    });
  };

  return (
    <div css={todoFormWrapper}>
      <form css={todoForm} onSubmit={submitTodo}>
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
        </div>
        <div css={todoFormContent}>
          <label>Content</label>
          <textarea
            name="content"
            value={todo.content}
            onChange={handleChange} />
        </div>
        <div css={todoFormContent}>
          <label>Category</label>
          <select
            name="category"
            onChange={handleChange} >
            <option value={SHORT}
              selected={todo.category == SHORT}>
              {SHORT}
            </option>
            <option value={MEDIUM}
              selected={todo.category == MEDIUM}>
              {MEDIUM}
            </option>
            <option value={LONG}
              selected={todo.category == LONG}>
              {LONG}
            </option>
          </select>
        </div>
        <div css={todoFormContent}>
          <label>Limit Date</label>
          <input
            className="inputDate"
            type="date"
            name="date_limit"
            value={todo.date_limit}
            onChange={handleChange} />
        </div>
        <div css={submitBtnWrapper}>
          <input type="submit" value="POST" />
        </div>
        <div css={closeBtnkWrapper}>
          <FontAwesomeIcon
            icon={faRectangleXmark}
            size="2x"
            css={closeBtn}
            onClick={() => {setIsShowForm(false)}} />
        </div>
      </form>
    </div>
  );
};

export default AppForm;