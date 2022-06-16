import {
  FC,
  ReactNode,
  Dispatch,
  SetStateAction
} from "react";
import { useDrop } from "react-dnd";
import { css } from "@emotion/react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Tooltip from "../../common/Tooltip";

import {
  Todo,
  COMPLETE
} from "../AppTodos";

const categoryTitle = css({
  fontsize: 20,
  marginBottom: 5,
});

const todosWrapper = css({
  width: 330,
  height: 1160,
  border: "solid",
  borderRadius: 8,
});

const navigationArea = css({
  "& ul": {
    display: "flex",
    justifyContent: "flex-end",
  },
  "& li": {
    marginRight: 15,
    marginBottom: 5,
  }
});

const displayFormBtn = css({
  cursor: "pointer",
  "&:hover": {
    opacity: 0.6,
  }
});

const todoOrderBtn = css({
  cursor: "pointer",
  "&:hover": {
    opacity: 0.6,
  }
});

const pagenation = css({
  width: "90%",
  margin: "auto",
  paddingTop: 5,
});

const prevBtn = css({
  cursor: "pointer",
  "&:hover": {
    opacity: 0.6,
  }
});

const nextBtn = css({
  float: "right",
  cursor: "pointer",
  "&:hover": {
    opacity: 0.6,
  }
});

const AppTodosCategoryColumn: FC<{
    children: ReactNode;
    title: string;
    setIsShowForm: Dispatch<SetStateAction<boolean>>;
    currentPage: number;
    maxPage: number;
    setPage: Dispatch<SetStateAction<[number, number]>>;
    setTodo: Dispatch<SetStateAction<Todo>>;
    setFormType: Dispatch<SetStateAction<string>>;
  }> = ({
    children,
    title,
    setIsShowForm,
    currentPage,
    maxPage,
    setPage,
    setTodo,
    setFormType
  }) => {
  
  const [, drop] = useDrop({
    accept: "todo",
    drop: () => ({name: title}),
  });

  const handleDispFormBtn = () => {
    // フォームの表示
    setIsShowForm(true);
    // todoを初期化,'category'のみ初期値として'title'をセットしておく
    setTodo({
      id: "",
      title: "",
      content: "",
      category: title,
      date_limit: null,
      date_created: null
    });
    // フォームタイプをnewに設定
    setFormType("new");
  };

  const switchToPrev = () => {
    setPage([currentPage - 1, maxPage]);
  };

  const switchToNext = () => {
    setPage([currentPage + 1, maxPage]);
  };

  return (
    <div>
      <h1 css={categoryTitle}>{title}</h1>
      <nav css={navigationArea}>
        <ul>
        {title !== COMPLETE &&
          <li>
            <Tooltip tooltipType="plusIcon"
              tooltipStyle={css({position: "relative"})}>
              <a css={displayFormBtn} onClick={handleDispFormBtn}>
                <FontAwesomeIcon icon={faPlus} />
              </a>
            </Tooltip>
          </li>}
          <li>
            <Tooltip tooltipType="DL"
              tooltipStyle={css({position: "relative"})}>
              <a css={todoOrderBtn}>
                DL
              </a>
            </Tooltip>
          </li>
          <li>
            <Tooltip tooltipType="DC"
              tooltipStyle={css({position: "relative"})}>
              <a css={todoOrderBtn}>
                DC
              </a>
            </Tooltip>
          </li>
        </ul>
      </nav>
      <div css={todosWrapper} ref={drop}>
        {children}
      </div>
      <div css={pagenation}>
        {currentPage > 0 && <a css={prevBtn} onClick={switchToPrev}>Prev</a>}
        {currentPage < maxPage && <a css={nextBtn} onClick={switchToNext}>Next</a>}
      </div>
    </div>
  );
};

export default AppTodosCategoryColumn;