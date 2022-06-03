import { Dispatch, FC, SetStateAction } from "react";
import { css } from "@emotion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRectangleXmark, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const todoDescWrapper = css({
  height: "100%",
  width: "100%",
  top: 0,
  left: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "fixed",
  backgroundColor: "rgba(0,0,0,0.5)",
});

const todoDescContainer = css({
  zIndex: 2,
  height: "54%",
  padding: "3em",
  backgroundColor: "#ffffff",
  border: "solid",
  borderRadius: 10,
});

const titleWrapper = css({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  marginBottom: 16,
  borderBottom: "solid",
  paddingBottom: 5,
  "& h1": {
    fontSize: 30,
  }
});

const editIcon = css({
  position: "absolute",
  right: 0,
  cursor: "pointer",
  "&:hover": {
    opacity: 0.6,
  }
});

const todoDescContent = css({
  width: 430,
  marginBottom: 40,
  "& p": {
    fontFamily: "none",
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

const AppTodoDescription: FC<{
    title: string;
    content: string;
    category: string;
    date_limit: string;
    done: boolean;
    date_created: string;
    setIsShowTodoDesc: Dispatch<SetStateAction<boolean>>;
  }> = ({
    title,
    content,
    category,
    date_limit,
    done,
    date_created,
    setIsShowTodoDesc,
  }) => {
  return (
    <div css={todoDescWrapper} >
      <div css={todoDescContainer}>
        <div css={titleWrapper}>
          <h1>Description</h1>
          {category != "completed" && <FontAwesomeIcon
            icon={faPenToSquare}
            size="2x"
            css={editIcon} />}
        </div>
        <div css={todoDescContent}>
          <label>Title</label>
          <p>{title}</p>
        </div>
        <div css={todoDescContent}>
          <label>Content</label>
          <p>{content}</p>
        </div>
        <div css={todoDescContent}>
          <label>Category</label>
          <p>{category}</p>
        </div>
        <div css={todoDescContent}>
          <label>Deadline</label>
          <p>{date_limit}</p>
        </div>
        <div css={todoDescContent}>
          <label>Date Created</label>
          <p>{date_created}</p>
        </div>
        <div css={closeBtnkWrapper}>
          <FontAwesomeIcon
            icon={faRectangleXmark}
            size="2x"
            css={closeBtn}
            onClick={() => setIsShowTodoDesc(false)} />
        </div>
      </div>
    </div>
  );
};

export default AppTodoDescription;