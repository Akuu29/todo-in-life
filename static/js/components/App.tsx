import React, { FC, useState, Dispatch, SetStateAction } from "react";
import GlobalStyles from "../styles/Global";
import Header from "./common/Header";
import Footer from "./common/Footer";
import AppForm from "./App/AppForm";
import AppTodos from "./App/AppTodos";

export interface CreatedTodo {
  id: string;
  title: string;
  content: string;
  category: string;
  date_limit: string;
  done: boolean;
  date_created: string;
};

export type SetCreateForm = Dispatch<SetStateAction<[boolean, string]>>;

const App: FC = () => {

  // isShowCreateForm: todo作成フォームの表示非表示用
  // category: todo作成フォームのcategoryの初期値の判定に使用
  const [[isShowCreateForm, category], setCreateForm] = useState([
    false,
    ""
  ]);

  return (
    <div>
      <GlobalStyles />
      <Header />
      <AppForm
        isShow={isShowCreateForm}
        category={category}
        setCreateForm={setCreateForm} />
      <AppTodos setCreateForm={setCreateForm} />
      <Footer />
    </div>
  );
};

export default App;