import { FC, Dispatch, SetStateAction } from "react";
import { css } from "@emotion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRectangleXmark } from "@fortawesome/free-solid-svg-icons/faRectangleXmark";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import Tooltip from "../../components/layout/Tooltip/Tooltip";
import { Todo } from "./TodosContents";
import { TODO_CATEGORIES } from "../../utils/constants/todoCategory.constants";
import { DateFormatters } from "../../utils/helpers/date.helpers";

const todoDescContainer = css({
  height: "100%",
  width: "100%",
  top: 0,
  left: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "fixed",
  backgroundColor: "rgba(0,0,0,0.5)",
  zIndex: 7,
});

const todoDescription = css({
  zIndex: 2,
  padding: "3em",
  backgroundColor: "#ffffff",
  border: "solid",
  borderRadius: 10,
});

const titleAndBtnWrapper = css({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  marginBottom: 16,
  borderBottom: "solid",
  paddingBottom: 5,
  "& h1": {
    fontSize: 30,
  },
});

const editIcon = css({
  position: "absolute",
  bottom: 5,
  right: 34,
  cursor: "pointer",
  "&:hover": {
    opacity: 0.6,
  },
});

const trashIcon = css({
  position: "absolute",
  bottom: 5,
  right: 0,
  cursor: "pointer",
  "&:hover": {
    opacity: 0.6,
  },
});

const todoDescContent = css({
  width: 430,
  marginBottom: 40,
  "& p": {
    fontFamily: "none",
  },
});

const sentence = css({
  whiteSpace: "pre-wrap",
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

const TodoDescription: FC<{
  todo: Todo;
  setIsShowTodoDesc: Dispatch<SetStateAction<boolean>>;
  setIsShowForm: Dispatch<SetStateAction<boolean>>;
  setFormType: Dispatch<SetStateAction<string>>;
  deleteTodo: FnToHandleTodosTable;
}> = ({ todo, setIsShowTodoDesc, setIsShowForm, setFormType, deleteTodo }) => {
  const handleEditIcon = () => {
    // todo詳細ページを非表示
    setIsShowTodoDesc(false);
    // todoフォームの表示
    setIsShowForm(true);
    // フォームタイプをエディットに設定
    setFormType("edit");
  };

  const handleDeleteIcon = () => {
    // todoを削除
    deleteTodo();
    // todo詳細ページを非表示
    setIsShowTodoDesc(false);
  };

  return (
    <div css={todoDescContainer}>
      <div css={todoDescription}>
        <div css={titleAndBtnWrapper}>
          <h1>Description</h1>
          {todo.category != TODO_CATEGORIES.COMPLETE && (
            <Tooltip tooltipType="editIcon" tooltipStyle={null}>
              <FontAwesomeIcon
                icon={faPenToSquare}
                css={editIcon}
                size="2x"
                onClick={handleEditIcon}
              />
            </Tooltip>
          )}
          <Tooltip tooltipType="trashIcon" tooltipStyle={null}>
            <FontAwesomeIcon
              icon={faTrash}
              size="2x"
              css={trashIcon}
              onClick={handleDeleteIcon}
            />
          </Tooltip>
        </div>
        <div css={todoDescContent}>
          <label>Title</label>
          <p>{todo.title}</p>
        </div>
        <div css={todoDescContent}>
          <label>Content</label>
          <p css={sentence}>{todo.content}</p>
        </div>
        <div css={todoDescContent}>
          <label>Category</label>
          <p>{todo.category}</p>
        </div>
        <div css={todoDescContent}>
          <label>Deadline</label>
          <p>{DateFormatters.convertStrDateToDispDate(todo.date_limit)}</p>
        </div>
        <div css={todoDescContent}>
          <label>Date Created</label>
          <p>{DateFormatters.convertUtcStrDateToDispDate(todo.date_created)}</p>
        </div>
        <div css={closeBtnkWrapper}>
          <FontAwesomeIcon
            icon={faRectangleXmark}
            size="2x"
            css={closeBtn}
            onClick={() => setIsShowTodoDesc(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default TodoDescription;
