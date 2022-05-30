import React, { useState } from "react";
import GlobalStyles from "../styles/Global";
import Header from "./common/Header";
import Footer from "./common/Footer";
import AppForm from "./App/AppForm";
export type SetCreateForm = React.Dispatch<React.SetStateAction<[boolean, string]>>;

const App: React.FC = () => {
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
      <Footer />
    </div>
  );
};

export default App;