import {
  FC,
  ReactNode,
  Dispatch,
  SetStateAction,
  useState
} from "react";
import { useDrop } from "react-dnd";
import { css } from "@emotion/react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tooltip from "../../common/Tooltip";
import { Todo, Todos } from "../AppTodos";
import { CATEGORY } from "../../../common/common";

const categoryTitle = css({
  fontSize: 20,
  marginBottom: 5,
});

const todosContainer = css({
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
    setTodos: Dispatch<SetStateAction<Todos>>;
  }> = ({
    children,
    title,
    setIsShowForm,
    currentPage,
    maxPage,
    setPage,
    setTodo,
    setFormType,
    setTodos
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

  // オーダー名称'dlDescending', 'dlAscending', 'dcDescending', 'dcAscending'
  const [todosOrder, setTodosOrder] = useState<string>("");

  // 'Deadline'のソート
  const sortByDeadline = () => {
    if(todosOrder == "dlDescending") {
      // 'todosOrder'がdeadlineで降順の場合は、昇順にする
      // ソート
      setTodos(prevTodos => {
        const todosSorted = prevTodos[title]
          .sort((a, b) => {
            if(!a.date_limit) return 1;
            if(!b.date_limit) return -1;
            return a.date_limit > b.date_limit ? 1 : -1;
          });

        return {
          ...prevTodos,
          [title]: todosSorted
        };
      });
      // 'todosOrder'にソート結果の並び順をセット
      setTodosOrder("dlAscending");
    }else {
      // 'todosOrder'がdeadlineで降順以外の場合は、降順にする
      // ソート
      setTodos(prevTodos => {
        const todosSorted = prevTodos[title]
          .sort((a, b) => {
            if(!a.date_limit) return 1;
            if(!b.date_limit) return -1;
            return a.date_limit < b.date_limit ? 1 : -1;
          });

        return {
          ...prevTodos,
          [title]: todosSorted
        }
      });
      // 'todosOrder'にソート結果の並び順をセット
      setTodosOrder("dlDescending");
    }
  }

  // 'Date Created'のソート
  const sortByDateCreated = () => {
    if(todosOrder == "dcDescending") {
      // 'todosOrder'がDate Created で降順の場合は、昇順にする
      // ソート
      setTodos(prevTodos => {
        const todosSorted = prevTodos[title]
          .sort((a, b) => {
            return a.date_created! > b.date_created! ? 1 : -1;
          });

        return {
          ...prevTodos,
          [title]: todosSorted
        };
      });
      // 'todosOrder'にソートの名称をセット
      setTodosOrder("dcAscending");
    }else  {
      // 'todosOrder'がDate Createdで降順以外の場合は、降順にする
      // ソート
      setTodos(prevTodos => {
        const todosSorted = prevTodos[title]
          .sort((a, b) => {
            return a.date_created! < b.date_created! ? 1 : -1;
          });

        return {
          ...prevTodos,
          [title]: todosSorted
        };
      });
      // 'todosOrder'にソートの名称をセット
      setTodosOrder("dcDescending");
    }
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
        {title !== CATEGORY.COMPLETE &&
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
              <a css={todoOrderBtn} onClick={sortByDeadline}>
                DL
              </a>
            </Tooltip>
          </li>
          <li>
            <Tooltip tooltipType="DC"
              tooltipStyle={css({position: "relative"})}>
              <a css={todoOrderBtn} onClick={sortByDateCreated}>
                DC
              </a>
            </Tooltip>
          </li>
        </ul>
      </nav>
      <div css={todosContainer} ref={drop}>
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