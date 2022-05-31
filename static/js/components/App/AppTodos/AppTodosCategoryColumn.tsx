import { css } from "@emotion/react";
import React, { ReactNode } from "react";
import { useDrop } from "react-dnd";
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
  height: 1000,
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

const AppTodosCategoryColumn: React.FC<{
  children: ReactNode;
  title: string;
  setCreateForm: SetCreateForm;}>
  = ({children, title,  setCreateForm}) => {
  
  const [, drop] = useDrop({
    accept: "todo",
    drop: () => ({name: title}),
  });

  const handleCreateForm = () => {
    setCreateForm([true, title]);
  };

  return (
    <div>
      <h1 css={categoryTitle}>{title}</h1>
        <nav css={navigationArea}>
          <ul>
          {title !== "completed" &&
            <li>
              <Tooltip tooltipType="plusIcon">
                <a css={displayFormBtn} onClick={handleCreateForm}>
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
    </div>
  );
};

export default AppTodosCategoryColumn;