import { css } from "@emotion/react";
import React, {useState} from "react";

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
  height: "70%",
  width: "30%",
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
  width: 400,
  marginBottom: 20,
  "& input": {
    width: 400,
  },
  "& textarea": {
    width: 400,
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

const btnWrapper = css({
  textAlign: "center",
  paddingTop: 20,
  "& input": {
    width: "100%",
    height: 30,
    backgroundColor: "#000000",
    color: "#ffffff",
    borderRadius: 6,
    "&:hover": {
      backgroundColor: "#2b2b2b",
    }
  }
});
  const [todo, setTodo] = useState({
    title: "",
    content: "",
    category: "",
    date_limit: "",
  });

  const handleChange: React.ChangeEventHandler = () => {

  }

  return (
    <div css={[todoFormWrapper, isRender]}>
      <form css={todoForm}>
        <div css={titleWrapper}>
          <h1>POST</h1>
        </div>
        <div css={todoFormContent}>
          <label>Title</label>
          <input
            type="text"
            name="title"
            required
            onChange={handleChange} />
        </div>
        <div css={todoFormContent}>
          <label>Content</label>
          <textarea
            name="content"
            onChange={handleChange} />
        </div>
        <div css={todoFormContent}>
          <label>Category</label>
          <select
            name="category"
            onChange={handleChange} >
            <option value=""></option>
            <option value="short">short</option>
            <option value="medium">medium</option>
            <option value="long">long</option>
          </select>
        </div>
        <div css={todoFormContent}>
          <label>Limit Date</label>
          <input
            className="inputDate"
            type="date"
            name="date_limit"
            onChange={handleChange} />
        </div>
        <div css={btnWrapper}>
          <input type="submit" value="POST" />
        </div>
      </form>
    </div>
  );
};

export default AppForm;