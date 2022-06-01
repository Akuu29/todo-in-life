import { Dispatch, FC, ReactNode, SetStateAction } from "react";
import { useDrop } from "react-dnd";
import { css } from "@emotion/react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SetCreateForm } from "../../App";
import Tooltip from "../../common/Tooltip";


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

type SetPage = Dispatch<SetStateAction<number>>;

const AppTodosCategoryColumn: FC<{
    children: ReactNode;
    title: string;
    setCreateForm: SetCreateForm;
    currentPage: number,
    maxPage: number,
    setPage: SetPage;
  }> = ({
    children,
    title,
    setCreateForm,
    currentPage,
    maxPage,
    setPage
  }) => {
  
  const [, drop] = useDrop({
    accept: "todo",
    drop: () => ({name: title}),
  });

  const switchToPrev = () => {
    setPage(currentPage - 1);
  }

  const switchToNext = () => {
    setPage(currentPage + 1);
  };

  return (
    <div>
      <h1 css={categoryTitle}>{title}</h1>
      <nav css={navigationArea}>
        <ul>
        {title !== "completed" &&
          <li>
            <Tooltip tooltipType="plusIcon">
              <a css={displayFormBtn} onClick={() => {setCreateForm([true, title])}}>
                <FontAwesomeIcon icon={faPlus} />
              </a>
            </Tooltip>
          </li>}
          <li>
            <Tooltip tooltipType="DL">
              <a css={todoOrderBtn}>
                DL
              </a>
            </Tooltip>
          </li>
          <li>
            <Tooltip tooltipType="DC">
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