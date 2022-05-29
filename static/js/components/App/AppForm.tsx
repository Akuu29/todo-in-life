import React, {useState} from "react";
import GlobalTodoForm from "../../styles/GlobalTodoForm";

const AppForm: React.FC = () => {
  const [todo, setTodo] = useState({
    title: "",
    content: "",
    category: "",
    date_limit: "",
  });

  const handleChange: React.ChangeEventHandler = () => {

  }

  return (
    <div className="todoFormWrapper">
      <GlobalTodoForm />
      <form className="todoForm">
        <div className="titleWrapper">
          <h1>POST</h1>
        </div>
        <div className="todoFormContent">
          <label>Title</label>
          <input
            type="text"
            name="title"
            required
            onChange={handleChange} />
        </div>
        <div className="todoFormContent">
          <label>Content</label>
          <textarea
            name="content"
            onChange={handleChange} />
        </div>
        <div className="todoFormContent">
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
        <div className="todoFormContent">
          <label>Limit Date</label>
          <input
            className="inputDate"
            type="date"
            name="date_limit"
            onChange={handleChange} />
        </div>
        <div className="btnWrapper">
          <input type="submit" value="POST" />
        </div>
      </form>
    </div>
  );
};

export default AppForm;